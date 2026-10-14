<?php
session_start();
$mysqli = new mysqli("localhost", "root", "", "kinobase_db");
$mysqli->set_charset("utf8mb4");

function e($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// Проверка Cookie (id, hash и IP) — защита от прямого доступа по ссылке (п. 2 и п. 4 ТЗ)
$userdata = null;
if (isset($_COOKIE['id'], $_COOKIE['hash'])) {
    $uid = intval($_COOKIE['id']);
    $stmt = $mysqli->prepare("SELECT *, INET_NTOA(user_ip) AS user_ip_str FROM users WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $userdata = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$userdata || $userdata['user_hash'] !== $_COOKIE['hash'] ||
        ($userdata['user_ip_str'] !== $_SERVER['REMOTE_ADDR'] && $userdata['user_ip_str'] !== '0.0.0.0')) {
        setcookie("id", "", time() - 3600, "/");
        setcookie("hash", "", time() - 3600, "/");
        header("Location: index.html?auth_required=1");
        exit();
    }
} else {
    header("Location: index.html?auth_required=1");
    exit();
}

// Обновление регистрационных данных кроме логина (п. 3 ТЗ)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $newFio   = trim($_POST['fio'] ?? $userdata['user_fio']);
    $newEmail = trim($_POST['email'] ?? $userdata['user_email']);
    $uid      = intval($userdata['user_id']);

    $stmt = $mysqli->prepare("UPDATE users SET user_fio = ?, user_email = ? WHERE user_id = ?");
    $stmt->bind_param("ssi", $newFio, $newEmail, $uid);
    $stmt->execute();
    $stmt->close();
    header("Location: secretplace.php?saved=1");
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Закрытый раздел — <?= e($userdata['user_login']) ?></title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container" style="margin-top:40px;">
        <h2>Приветствуем Вас, <?= e($userdata['user_fio']) ?> (Логин: <?= e($userdata['user_login']) ?>)!</h2>
        <p>Вы находитесь на защищённой странице. <a href="auth.php?action=logout">Выход</a></p>
    </div>
</body>
</html>