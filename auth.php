<?php
session_start();
header('Content-Type: text/html; charset=utf-8');

// Подключение к СУБД MySQL
$mysqli = new mysqli("localhost", "root", "", "kinobase_db");
$mysqli->set_charset("utf8mb4");

// Защита от XSS при выводе
function e($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// Генерация случайной строки (из методички)
function generateCode($length = 10) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;
    while (strlen($code) < $length) {
        $code .= $chars[random_int(0, $clen)];
    }
    return $code;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// 1. РЕГИСТРАЦИЯ (Защита от SQL-инъекций через Prepared Statements)
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = trim($_POST['login'] ?? '');
    $pass  = trim($_POST['password'] ?? '');
    $fio   = trim($_POST['fio'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $err   = [];

    if (!preg_match("/^[a-zA-Z0-9]{3,30}$/", $login)) {
        $err[] = "Логин должен состоять из латинских букв/цифр (3–30 символов)";
    }

    // Безопасная параметризованная проверка существования логина
    $stmt = $mysqli->prepare("SELECT COUNT(user_id) FROM users WHERE user_login = ?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ($count > 0) {
        $err[] = "Пользователь с таким логином уже существует";
    }

    // Загрузка аватара
    $avatarPath = 'images/logo.png';
    if (!empty($_FILES['avatar']['name']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
            $avatarPath = 'images/avatar_' . time() . '.' . $ext;
            move_uploaded_file($_FILES['avatar']['tmp_name'], $avatarPath);
        }
    }

    if (empty($err)) {
        // Двойное шифрование md5 по методичке
        $passwordHash = md5(md5($pass));
        $stmt = $mysqli->prepare("INSERT INTO users (user_login, user_password, user_fio, user_email, user_avatar) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $login, $passwordHash, $fio, $email, $avatarPath);
        $stmt->execute();
        $stmt->close();
        header("Location: index.html");
        exit();
    }
}

// 2. АВТОРИЗАЦИЯ И ВЫСТАВЛЕНИЕ COOKIE
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = trim($_POST['login'] ?? '');
    $pass  = md5(md5(trim($_POST['password'] ?? '')));

    $stmt = $mysqli->prepare("SELECT user_id, user_password FROM users WHERE user_login = ? LIMIT 1");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = $res->fetch_assoc();
    $stmt->close();

    if ($data && hash_equals($data['user_password'], $pass)) {
        $hash = md5(generateCode(10));
        $ip   = empty($_POST['not_attach_ip']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';

        $stmt = $mysqli->prepare("UPDATE users SET user_hash = ?, user_ip = INET_ATON(?) WHERE user_id = ?");
        $stmt->bind_param("ssi", $hash, $ip, $data['user_id']);
        $stmt->execute();
        $stmt->close();

        // HttpOnly защищает Cookie от кражи через XSS
        setcookie("id", (string)$data['user_id'], time() + 60 * 60 * 24 * 30, "/", "", false, true);
        setcookie("hash", $hash, time() + 60 * 60 * 24 * 30, "/", "", false, true);
        $_SESSION['logged_user'] = $login;

        header("Location: secretplace.php");
        exit();
    }
}

// 3. ВЫХОД
if ($action === 'logout') {
    unset($_SESSION['logged_user']);
    setcookie("id", "", time() - 3600, "/");
    setcookie("hash", "", time() - 3600, "/");
    header("Location: index.html");
    exit();
}
?>