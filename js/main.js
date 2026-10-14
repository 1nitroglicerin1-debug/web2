/* ==========================================================================
   Kinobase — Основной скрипт сайта (Лабораторные работы №1–4)
   Включает: Каталог, Умный фильтр, Печать, Регистрацию, Авторизацию (Cookie),
   Закрытый раздел, Сброс пароля по ссылке, Защиту от XSS / SQL-инъекций
   и Онлайн-видеоплеер (YouTube) с индивидуальными трейлерами для 20 фильмов.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
	// =========================================================================
	// 1. ЗАЩИТА ОТ XSS И КРИПТОГРАФИЧЕСКИЕ ХЕЛПЕРЫ (Пункт 7 ТЗ)
	// =========================================================================
	function escapeHtml(str) {
		if (str === null || str === undefined) return '';
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	// Двойное хеширование пароля по методичке: hash(hash(trim(password)))
	function doubleHash(str) {
		const clean = String(str).trim();
		function simpleMd5Like(s) {
			let h1 = 0xdeadbeef ^ s.length;
			let h2 = 0x41c6ce57 ^ s.length;
			for (let i = 0, ch; i < s.length; i++) {
				ch = s.charCodeAt(i);
				h1 = Math.imul(h1 ^ ch, 2654435761);
				h2 = Math.imul(h2 ^ ch, 1597334677);
			}
			h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
			h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
			return (h1 >>> 0).toString(16).padStart(8, '0') +
			       (h2 >>> 0).toString(16).padStart(8, '0') +
			       ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0') +
			       ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
		}
		return simpleMd5Like(simpleMd5Like(clean));
	}

	// Генерация случайной строки (аналог generateCode() из методички)
	function generateCode(length = 16) {
		const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789';
		let code = '';
		for (let i = 0; i < length; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	}

	// Работа с Cookie (по методичке: id и hash на 30 дней)
	function setCookie(name, value, days = 30) {
		const maxAge = days * 24 * 60 * 60;
		document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
	}

	function getCookie(name) {
		const matches = document.cookie.match(new RegExp(
			'(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
		));
		return matches ? decodeURIComponent(matches[1]) : null;
	}

	function deleteCookie(name) {
		document.cookie = `${encodeURIComponent(name)}=; max-age=-1; path=/; SameSite=Lax`;
	}

	// =========================================================================
	// 2. БАЗА ПОЛЬЗОВАТЕЛЕЙ (ТАБЛИЦА `users`) И СЕССИЯ
	// =========================================================================
	const DB_KEY = 'kinobase_users_db';
	const DEFAULT_AVATAR = 'images/logo.png';

	function getUsersDB() {
		const raw = localStorage.getItem(DB_KEY);
		if (!raw) {
			const initialUsers = [
				{
					user_id: 1,
					user_login: 'admin',
					user_password: doubleHash('superpass'),
					user_fio: 'Администратор Кинопортала',
					user_email: 'admin@kinobase.ru',
					user_avatar: DEFAULT_AVATAR,
					user_hash: '',
					user_ip: '0',
					reset_token: null
				}
			];
			localStorage.setItem(DB_KEY, JSON.stringify(initialUsers));
			return initialUsers;
		}
		try {
			return JSON.parse(raw);
		} catch (e) {
			return [];
		}
	}

	function saveUsersDB(users) {
		localStorage.setItem(DB_KEY, JSON.stringify(users));
	}

	// Проверка авторизации по Cookie (аналог check.php из методички)
	function getAuthenticatedUser() {
		const cookieId = getCookie('id');
		const cookieHash = getCookie('hash');
		if (!cookieId || !cookieHash) return null;

		const users = getUsersDB();
		const user = users.find(u => String(u.user_id) === String(cookieId));

		if (!user || user.user_hash !== cookieHash) {
			deleteCookie('id');
			deleteCookie('hash');
			return null;
		}
		return user;
	}

	// Выход из системы (аналог exit.php)
	function logoutUser() {
		const user = getAuthenticatedUser();
		if (user) {
			const users = getUsersDB();
			const idx = users.findIndex(u => u.user_id === user.user_id);
			if (idx !== -1) {
				users[idx].user_hash = '';
				saveUsersDB(users);
			}
		}
		deleteCookie('id');
		deleteCookie('hash');

		if (window.location.pathname.endsWith('profile.html')) {
			window.location.href = 'index.html';
		} else {
			updateAuthUI();
		}
	}

	// =========================================================================
	// 3. МОДАЛЬНОЕ ОКНО: ВХОД / РЕГИСТРАЦИЯ / СБРОС ПАРОЛЯ (Пункты 1, 5, 6 ТЗ)
	// =========================================================================
	let tempAvatarBase64 = DEFAULT_AVATAR;

	function buildAuthModal() {
		let modal = document.getElementById('login-modal');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = 'login-modal';
			modal.className = 'modal-overlay hidden';
			document.body.appendChild(modal);
		}

		modal.innerHTML = `
			<div class="modal-window">
				<div class="modal-header">
					<h3 class="modal-title" id="auth-modal-title">Авторизация в Kinobase</h3>
					<button type="button" id="close-modal-btn" class="modal-close">&times;</button>
				</div>

				<div class="auth-tabs">
					<button type="button" class="auth-tab-btn active" data-tab="login">Вход</button>
					<button type="button" class="auth-tab-btn" data-tab="register">Регистрация</button>
					<button type="button" class="auth-tab-btn" data-tab="forgot">Сброс пароля</button>
				</div>

				<div id="auth-alert-box" class="auth-alert hidden"></div>

				<!-- ВКЛАДКА 1: ВХОД -->
				<form id="auth-login-form" class="modal-form">
					<div class="form-group">
						<label for="login-username">Логин или Email:</label>
						<input type="text" id="login-username" class="form-control" placeholder="Например: admin" required>
					</div>
					<div class="form-group">
						<label for="login-password">Пароль:</label>
						<input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
					</div>
					<label class="checkbox-row">
						<input type="checkbox" id="login-not-attach-ip">
						<span>Не прикреплять к IP (не безопасно)</span>
					</label>
					<button type="submit" class="button button-primary button-block">Войти в аккаунт</button>
					<p class="form-help-text" style="margin-top:10px; text-align:center;">
						Тестовый вход: логин <strong>admin</strong>, пароль <strong>superpass</strong>
					</p>
				</form>

				<!-- ВКЛАДКА 2: РЕГИСТРАЦИЯ (логин, пароль, ФИО, почта, аватар) -->
				<form id="auth-register-form" class="modal-form hidden">
					<div class="form-group">
						<label for="reg-login">Логин (только латиница и цифры, 3–30 симв.):</label>
						<input type="text" id="reg-login" class="form-control" placeholder="ivan2026" required>
					</div>
					<div class="form-group">
						<label for="reg-password">Пароль (не менее 4 символов):</label>
						<input type="password" id="reg-password" class="form-control" placeholder="••••••••" required>
					</div>
					<div class="form-group">
						<label for="reg-fio">ФИО полностью:</label>
						<input type="text" id="reg-fio" class="form-control" placeholder="Иванов Иван Иванович" required>
					</div>
					<div class="form-group">
						<label for="reg-email">Электронная почта (Email):</label>
						<input type="email" id="reg-email" class="form-control" placeholder="ivan@example.com" required>
					</div>
					<div class="form-group">
						<label for="reg-avatar">Аватар профиля:</label>
						<input type="file" id="reg-avatar" class="form-control" accept="image/*">
						<div class="avatar-preview-row">
							<img id="reg-avatar-preview" src="${DEFAULT_AVATAR}" alt="Превью" class="avatar-preview-img">
							<span class="form-help-text">Загрузите своё фото (или будет использован стандартный аватар)</span>
						</div>
					</div>
					<button type="submit" class="button button-primary button-block">Зарегистрироваться</button>
				</form>

				<!-- ВКЛАДКА 3: ВОССТАНОВЛЕНИЕ ПАРОЛЯ ПО ССЫЛКЕ (Пункт 6 ТЗ) -->
				<form id="auth-forgot-form" class="modal-form hidden">
					<div class="form-group">
						<label for="forgot-ident">Введите ваш Логин или Email:</label>
						<input type="text" id="forgot-ident" class="form-control" placeholder="admin или admin@kinobase.ru" required>
					</div>
					<button type="submit" class="button button-primary button-block">Сгенерировать ссылку сброса</button>
					<div id="forgot-link-output" class="reset-link-box hidden"></div>
				</form>

				<!-- ВКЛАДКА 4: УСТАНОВКА НОВОГО ПАРОЛЯ ПО ТОКЕНУ ИЗ ССЫЛКИ -->
				<form id="auth-reset-confirm-form" class="modal-form hidden">
					<input type="hidden" id="reset-confirm-login">
					<input type="hidden" id="reset-confirm-token">
					<div class="form-group">
						<label for="reset-new-pass">Введите новый пароль:</label>
						<input type="password" id="reset-new-pass" class="form-control" placeholder="Минимум 4 символа" required>
					</div>
					<div class="form-group">
						<label for="reset-new-pass2">Повторите новый пароль:</label>
						<input type="password" id="reset-new-pass2" class="form-control" placeholder="Повторите пароль" required>
					</div>
					<button type="submit" class="button button-primary button-block">Сохранить новый пароль</button>
				</form>
			</div>
		`;

		// Переключение вкладок
		const tabBtns = modal.querySelectorAll('.auth-tab-btn');
		tabBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				switchAuthTab(btn.dataset.tab);
			});
		});

		// Закрытие модалки
		modal.querySelector('#close-modal-btn').addEventListener('click', () => {
			modal.classList.add('hidden');
		});
		modal.addEventListener('click', (e) => {
			if (e.target === modal) modal.classList.add('hidden');
		});

		// Превью аватара при регистрации
		const regAvatarInput = modal.querySelector('#reg-avatar');
		const regAvatarPreview = modal.querySelector('#reg-avatar-preview');
		regAvatarInput.addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				tempAvatarBase64 = ev.target.result;
				regAvatarPreview.src = tempAvatarBase64;
			};
			reader.readAsDataURL(file);
		});

		// Обработка ВХОДА
		modal.querySelector('#auth-login-form').addEventListener('submit', (e) => {
			e.preventDefault();
			const ident = document.getElementById('login-username').value.trim();
			const pass = document.getElementById('login-password').value;
			const notAttachIp = document.getElementById('login-not-attach-ip').checked;

			// Проверка на попытку SQL-инъекции (п. 7 ТЗ)
			if (/('|--|;|\bOR\b|\bUNION\b|\bSELECT\b|\bDROP\b)/i.test(ident)) {
				showAuthAlert('Обнаружена попытка SQL-инъекции! Запрос заблокирован системой безопасности.', 'error');
				return;
			}

			const users = getUsersDB();
			const userIdx = users.findIndex(
				u => u.user_login.toLowerCase() === ident.toLowerCase() || u.user_email.toLowerCase() === ident.toLowerCase()
			);

			if (userIdx === -1 || users[userIdx].user_password !== doubleHash(pass)) {
				showAuthAlert('Вы ввели неправильный логин или пароль!', 'error');
				return;
			}

			// Генерируем случайный хеш сессии и записываем в БД и Cookie (по методичке)
			const sessionHash = doubleHash(generateCode(12));
			users[userIdx].user_hash = sessionHash;
			users[userIdx].user_ip = notAttachIp ? '0 (Отключено)' : '127.0.0.1 (Привязан к IP)';
			saveUsersDB(users);

			setCookie('id', users[userIdx].user_id, 30);
			setCookie('hash', sessionHash, 30);

			showAuthAlert(`Привет, ${escapeHtml(users[userIdx].user_fio)}! Перенаправление в закрытый раздел...`, 'success');
			updateAuthUI();

			setTimeout(() => {
				window.location.href = 'profile.html';
			}, 600);
		});

		// Обработка РЕГИСТРАЦИИ (п. 1 ТЗ)
		modal.querySelector('#auth-register-form').addEventListener('submit', (e) => {
			e.preventDefault();
			const login = document.getElementById('reg-login').value.trim();
			const password = document.getElementById('reg-password').value;
			const fio = document.getElementById('reg-fio').value.trim();
			const email = document.getElementById('reg-email').value.trim();

			const errors = [];
			if (!/^[a-zA-Z0-9]+$/.test(login)) {
				errors.push('Логин может состоять только из букв английского алфавита и цифр');
			}
			if (login.length < 3 || login.length > 30) {
				errors.push('Логин должен быть не меньше 3-х символов и не больше 30');
			}
			if (password.trim().length < 4) {
				errors.push('Пароль должен содержать не менее 4 символов');
			}
			if (fio.length < 3) {
				errors.push('Укажите корректное ФИО');
			}

			const users = getUsersDB();
			if (users.some(u => u.user_login.toLowerCase() === login.toLowerCase())) {
				errors.push('Пользователь с таким логином уже существует в базе данных');
			}
			if (users.some(u => u.user_email.toLowerCase() === email.toLowerCase())) {
				errors.push('Пользователь с такой почтой уже зарегистрирован');
			}

			if (errors.length > 0) {
				showAuthAlert('<b>При регистрации произошли ошибки:</b><br>• ' + errors.join('<br>• '), 'error');
				return;
			}

			const newId = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;
			const sessionHash = doubleHash(generateCode(12));

			const newUser = {
				user_id: newId,
				user_login: login,
				user_password: doubleHash(password),
				user_fio: fio,
				user_email: email,
				user_avatar: tempAvatarBase64 || DEFAULT_AVATAR,
				user_hash: sessionHash,
				user_ip: '127.0.0.1 (Привязан к IP)',
				reset_token: null
			};

			users.push(newUser);
			saveUsersDB(users);

			// Автоматически авторизуем после регистрации
			setCookie('id', newUser.user_id, 30);
			setCookie('hash', sessionHash, 30);

			showAuthAlert('Регистрация прошла успешно! Выполняется вход в закрытый раздел...', 'success');
			updateAuthUI();

			setTimeout(() => {
				window.location.href = 'profile.html';
			}, 700);
		});

		// Обработка ВОССТАНОВЛЕНИЯ ПАРОЛЯ (п. 6 ТЗ — вывод ссылки на экран и скачивание в файл)
		modal.querySelector('#auth-forgot-form').addEventListener('submit', (e) => {
			e.preventDefault();
			const ident = document.getElementById('forgot-ident').value.trim();
			const users = getUsersDB();
			const idx = users.findIndex(
				u => u.user_login.toLowerCase() === ident.toLowerCase() || u.user_email.toLowerCase() === ident.toLowerCase()
			);

			const outBox = document.getElementById('forgot-link-output');
			if (idx === -1) {
				outBox.classList.add('hidden');
				showAuthAlert('Пользователь с таким логином или Email не найден.', 'error');
				return;
			}

			const token = generateCode(24);
			users[idx].reset_token = token;
			saveUsersDB(users);

			const baseUrl = window.location.origin + window.location.pathname;
			const resetUrl = `${baseUrl}?action=reset_password&login=${encodeURIComponent(users[idx].user_login)}&token=${encodeURIComponent(token)}`;

			showAuthAlert(`Ссылка для восстановления пароля сформирована для <b>${escapeHtml(users[idx].user_email)}</b>:`, 'info');
			outBox.classList.remove('hidden');
			outBox.innerHTML = `
				<div><strong>Письмо для:</strong> ${escapeHtml(users[idx].user_fio)} (${escapeHtml(users[idx].user_email)})</div>
				<div style="margin-top:4px;">Перейдите по одноразовой ссылке для смены пароля (п. 6 ТЗ):</div>
				<a href="${resetUrl}" id="direct-reset-link">${escapeHtml(resetUrl)}</a>
				<div style="margin-top:10px; display:flex; gap:8px;">
					<button type="button" id="download-reset-txt" class="button button-detail" style="flex:1;">💾 Сохранить ссылку в файл (.txt)</button>
				</div>
			`;

			document.getElementById('download-reset-txt').addEventListener('click', () => {
				const text = `Восстановление пароля Kinobase\nПользователь: ${users[idx].user_login}\nEmail: ${users[idx].user_email}\nСсылка для сброса пароля:\n${resetUrl}\n`;
				const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
				const a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = `password_reset_${users[idx].user_login}.txt`;
				a.click();
			});
		});

		// Обработка СОХРАНЕНИЯ НОВОГО ПАРОЛЯ ПО ССЫЛКЕ
		modal.querySelector('#auth-reset-confirm-form').addEventListener('submit', (e) => {
			e.preventDefault();
			const login = document.getElementById('reset-confirm-login').value;
			const token = document.getElementById('reset-confirm-token').value;
			const pass1 = document.getElementById('reset-new-pass').value;
			const pass2 = document.getElementById('reset-new-pass2').value;

			if (pass1.trim().length < 4) {
				showAuthAlert('Новый пароль должен быть не короче 4 символов.', 'error');
				return;
			}
			if (pass1 !== pass2) {
				showAuthAlert('Введённые пароли не совпадают!', 'error');
				return;
			}

			const users = getUsersDB();
			const idx = users.findIndex(u => u.user_login === login && u.reset_token === token);
			if (idx === -1) {
				showAuthAlert('Недействительная или устаревшая ссылка восстановления пароля!', 'error');
				return;
			}

			users[idx].user_password = doubleHash(pass1);
			users[idx].reset_token = null;
			saveUsersDB(users);

			showAuthAlert('Пароль успешно изменён! Теперь вы можете войти с новым паролем.', 'success');
			setTimeout(() => {
				window.history.replaceState({}, document.title, window.location.pathname);
				switchAuthTab('login');
				document.getElementById('login-username').value = login;
			}, 1200);
		});
	}

	function showAuthAlert(htmlMessage, type = 'info') {
		const box = document.getElementById('auth-alert-box');
		if (!box) return;
		box.className = `auth-alert ${type}`;
		box.innerHTML = htmlMessage;
		box.classList.remove('hidden');
	}

	function switchAuthTab(tabName) {
		const modal = document.getElementById('login-modal');
		if (!modal) return;

		const title = document.getElementById('auth-modal-title');
		const alertBox = document.getElementById('auth-alert-box');
		if (alertBox) alertBox.classList.add('hidden');

		modal.querySelectorAll('.auth-tab-btn').forEach(btn => {
			btn.classList.toggle('active', btn.dataset.tab === tabName);
		});

		document.getElementById('auth-login-form').classList.toggle('hidden', tabName !== 'login');
		document.getElementById('auth-register-form').classList.toggle('hidden', tabName !== 'register');
		document.getElementById('auth-forgot-form').classList.toggle('hidden', tabName !== 'forgot');
		document.getElementById('auth-reset-confirm-form').classList.toggle('hidden', tabName !== 'reset-confirm');

		if (tabName === 'login') title.textContent = 'Вход в Kinobase';
		if (tabName === 'register') title.textContent = 'Регистрация пользователя';
		if (tabName === 'forgot') title.textContent = 'Восстановление пароля';
		if (tabName === 'reset-confirm') title.textContent = 'Установка нового пароля';
	}

	function openAuthModal(defaultTab = 'login', message = null, msgType = 'info') {
		const modal = document.getElementById('login-modal');
		if (!modal) return;
		modal.classList.remove('hidden');
		switchAuthTab(defaultTab);
		if (message) {
			showAuthAlert(message, msgType);
		}
	}

	// =========================================================================
	// 4. ОБНОВЛЕНИЕ ШАПКИ, МЕНЮ И СТРАНИЦЫ ПРОФИЛЯ (Пункты 2, 3, 4 ТЗ)
	// =========================================================================
	function updateAuthUI() {
		const user = getAuthenticatedUser();

		// 1. Добавляем пункт «🔒 Закрытый раздел» в главное меню на всех страницах
		const navLists = document.querySelectorAll('.nav-list');
		navLists.forEach(ul => {
			let secretLi = ul.querySelector('.nav-item-secret');
			if (!secretLi) {
				secretLi = document.createElement('li');
				secretLi.className = 'nav-item nav-item-secret';
				if (window.location.pathname.endsWith('profile.html')) {
					secretLi.classList.add('active');
				}
				secretLi.innerHTML = `<a href="profile.html" class="nav-link">🔒 Закрытый раздел</a>`;
				ul.appendChild(secretLi);
			}
		});

		// 2. Обновляем панель пользователя в шапке
		const userPanel = document.querySelector('.user-panel');
		if (userPanel) {
			const printBtn = document.getElementById('toggle-print-btn');
			userPanel.innerHTML = '';
			if (printBtn) {
				userPanel.appendChild(printBtn);
			}

			if (user) {
				const profileBadge = document.createElement('a');
				profileBadge.href = 'profile.html';
				profileBadge.className = 'header-user-badge';
				profileBadge.title = 'Перейти в закрытый личный кабинет';
				profileBadge.innerHTML = `
					<img src="${escapeHtml(user.user_avatar || DEFAULT_AVATAR)}" alt="Аватар" class="header-avatar-mini">
					<span class="header-user-name">${escapeHtml(user.user_fio || user.user_login)}</span>
				`;

				const logoutBtn = document.createElement('button');
				logoutBtn.type = 'button';
				logoutBtn.className = 'button button-login';
				logoutBtn.textContent = 'Выход';
				logoutBtn.addEventListener('click', logoutUser);

				userPanel.appendChild(profileBadge);
				userPanel.appendChild(logoutBtn);
			} else {
				const loginBtn = document.createElement('button');
				loginBtn.type = 'button';
				loginBtn.id = 'open-login-btn';
				loginBtn.className = 'button button-login';
				loginBtn.textContent = 'Вход / Регистрация';
				loginBtn.addEventListener('click', () => openAuthModal('login'));
				userPanel.appendChild(loginBtn);
			}
		}

		// 3. Если мы находимся на странице profile.html — заполняем данные профиля
		const profileEditForm = document.getElementById('profile-edit-form');
		if (profileEditForm && user) {
			document.getElementById('profile-current-avatar').src = user.user_avatar || DEFAULT_AVATAR;
			document.getElementById('profile-display-fio').textContent = user.user_fio;
			document.getElementById('profile-display-login').textContent = user.user_login;
			document.getElementById('profile-display-email').textContent = user.user_email;

			document.getElementById('edit-login').value = user.user_login;
			document.getElementById('edit-fio').value = user.user_fio;
			document.getElementById('edit-email').value = user.user_email;

			document.getElementById('debug-cookie-id').textContent = getCookie('id') || '-';
			document.getElementById('debug-cookie-hash').textContent = getCookie('hash') || '-';
			document.getElementById('debug-user-ip').textContent = user.user_ip || '127.0.0.1';
		}
	}

	// Обработчик редактирования данных в личном кабинете (Пункт 3 ТЗ: всё кроме логина)
	function initProfilePage() {
		const profileEditForm = document.getElementById('profile-edit-form');
		if (!profileEditForm) return;

		let updatedAvatarBase64 = null;
		const avatarInput = document.getElementById('edit-avatar-file');
		avatarInput.addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				updatedAvatarBase64 = ev.target.result;
				document.getElementById('profile-current-avatar').src = updatedAvatarBase64;
			};
			reader.readAsDataURL(file);
		});

		profileEditForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const currentUser = getAuthenticatedUser();
			if (!currentUser) {
				window.location.replace('index.html?auth_required=1');
				return;
			}

			const newFio = document.getElementById('edit-fio').value.trim();
			const newEmail = document.getElementById('edit-email').value.trim();
			const newPass = document.getElementById('edit-new-password').value;
			const msgBox = document.getElementById('profile-message');

			const users = getUsersDB();
			const idx = users.findIndex(u => u.user_id === currentUser.user_id);
			if (idx === -1) return;

			// Проверяем, не занят ли новый Email другим пользователем
			if (users.some(u => u.user_id !== currentUser.user_id && u.user_email.toLowerCase() === newEmail.toLowerCase())) {
				msgBox.className = 'auth-alert error';
				msgBox.textContent = 'Этот Email уже используется другим аккаунтом!';
				msgBox.classList.remove('hidden');
				return;
			}

			// Логин НЕ меняется ни при каких условиях (п. 3 ТЗ)
			users[idx].user_fio = newFio;
			users[idx].user_email = newEmail;
			if (updatedAvatarBase64) {
				users[idx].user_avatar = updatedAvatarBase64;
			}
			if (newPass && newPass.trim().length >= 4) {
				users[idx].user_password = doubleHash(newPass);
			}

			saveUsersDB(users);
			document.getElementById('edit-new-password').value = '';

			msgBox.className = 'auth-alert success';
			msgBox.textContent = 'Регистрационные данные (кроме логина) успешно обновлены!';
			msgBox.classList.remove('hidden');

			updateAuthUI();
		});

		const profileLogoutBtn = document.getElementById('profile-logout-btn');
		if (profileLogoutBtn) {
			profileLogoutBtn.addEventListener('click', logoutUser);
		}
	}

	// Проверка URL-параметров (редирект из закрытого раздела или переход по ссылке сброса пароля)
	function checkUrlAuthActions() {
		const params = new URLSearchParams(window.location.search);

		if (params.get('auth_required') === '1') {
			openAuthModal(
				'login',
				'🔒 Доступ к закрытому разделу по прямой ссылке запрещён для неавторизованных пользователей! Пожалуйста, войдите в аккаунт.',
				'error'
			);
		}

		if (params.get('action') === 'reset_password') {
			const login = params.get('login') || '';
			const token = params.get('token') || '';
			const users = getUsersDB();
			const validUser = users.find(u => u.user_login === login && u.reset_token === token);

			if (validUser) {
				document.getElementById('reset-confirm-login').value = login;
				document.getElementById('reset-confirm-token').value = token;
				openAuthModal(
					'reset-confirm',
					`Токен подтверждён! Установите новый пароль для пользователя <b>${escapeHtml(login)}</b>.`,
					'info'
				);
			} else {
				openAuthModal('forgot', 'Ссылка для восстановления пароля недействительна или уже была использована.', 'error');
			}
		}
	}

	// =========================================================================
	// 5. БАЗА ДАННЫХ ФИЛЬМОВ, ТРЕЙЛЕРЫ, УМНЫЙ ФИЛЬТР И КАТАЛОГ
	// =========================================================================
	const MOVIES_DATA = [
		{ id: 1, title: 'Интерстеллар', year: 2014, rating: 8.6, genres: ['Фантастика', 'Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-interstellar.jpg', trailerUrl: 'https://www.youtube.com/embed/m2vijtILDuk?autoplay=1&rel=0', summary: 'Когда засуха приводит человечество к глобальному кризису, команда исследователей отправляется сквозь червоточину в поисках нового дома.' },
		{ id: 2, title: 'Начало', year: 2010, rating: 8.7, genres: ['Фантастика', 'Боевик'], country: 'США', quality: '4K UHD', poster: 'images/poster-inception.jpg', trailerUrl: 'https://www.youtube.com/embed/c9hxnFo8lhI?autoplay=1&rel=0', summary: 'Кобб — профессиональный вор, крадущий ценные секреты из глубин подсознания во время сна. Ему предстоит внедрить чужую мысль.' },
		{ id: 3, title: 'Матрица', year: 1999, rating: 8.5, genres: ['Фантастика', 'Боевик'], country: 'США', quality: '4K UHD', poster: 'images/poster-matrix.jpg', trailerUrl: 'https://www.youtube.com/embed/fvdYOMHCqcg?autoplay=1&rel=0', summary: 'Хакер Нео узнает шокирующую правду: весь привычный мир — иллюзия, созданная машинами для контроля над людьми.' },
		{ id: 4, title: 'Гладиатор', year: 2000, rating: 8.6, genres: ['Боевик', 'Драма'], country: 'США', quality: 'Full HD', poster: 'images/poster-gladiator.jpg', trailerUrl: 'https://www.youtube.com/embed/F2Dr7Qb2Zf8?autoplay=1&rel=0', summary: 'Преданный римский полководец Максимус становится рабом-гладиатором и бросает вызов жестокому императору Рима.' },
		{ id: 5, title: 'Тёмный рыцарь', year: 2008, rating: 9.0, genres: ['Боевик', 'Криминал'], country: 'США', quality: '4K UHD', poster: 'images/poster-dark-knight.jpg', trailerUrl: 'https://www.youtube.com/embed/W_zqKjy-Vv4?autoplay=1&rel=0', summary: 'Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Гордона он намерен очистить улицы Готэма от Джокера.' },
		{ id: 6, title: 'Побег из Шоушенка', year: 1994, rating: 9.1, genres: ['Драма'], country: 'США', quality: 'Full HD', poster: 'images/poster-shawshank.jpg', trailerUrl: 'https://www.youtube.com/embed/6FNZr0SoRfY?autoplay=1&rel=0', summary: 'Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены. Оказавшись в тюрьме Шоушенк, он не теряет надежды на свободу.' },
		{ id: 7, title: 'Криминальное чтиво', year: 1994, rating: 8.9, genres: ['Криминал', 'Комедия'], country: 'США', quality: 'Full HD', poster: 'images/poster-pulp-fiction.jpg', trailerUrl: 'https://www.youtube.com/embed/HKMfTF6yNYk?autoplay=1&rel=0', summary: 'Двое бандитов Винсент Вега и Джулс Винфилд попадают в череду непредсказуемых криминальных историй в Лос-Анджелесе.' },
		{ id: 8, title: 'Бойцовский клуб', year: 1999, rating: 8.8, genres: ['Драма', 'Криминал'], country: 'США', quality: 'Full HD', poster: 'images/poster-fight-club.jpg', trailerUrl: 'https://www.youtube.com/embed/8vHtD5psc00?autoplay=1&rel=0', summary: 'Страдающий от бессонницы клерк встречает Тайлера Дёрдена и вместе с ним организует подпольный бойцовский клуб.' },
		{ id: 9, title: 'Во все тяжкие', year: 2008, rating: 9.5, genres: ['Криминал', 'Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-breaking-bad.jpg', trailerUrl: 'https://www.youtube.com/embed/HhesaQXLuRY?autoplay=1&rel=0', summary: 'Школьный учитель химии Уолтер Уайт узнаёт о тяжёлом диагнозе и решает обеспечить семью, вступив в опасный криминальный мир.' },
		{ id: 10, title: 'Чернобыль', year: 2019, rating: 8.9, genres: ['Драма'], country: 'Великобритания', quality: '4K UHD', poster: 'images/poster-chernobyl.jpg', trailerUrl: 'https://www.youtube.com/embed/dPKaAxXqyIw?autoplay=1&rel=0', summary: 'Историческая драма о героической ликвидации последствий аварии на Чернобыльской АЭС в апреле 1986 года.' },
		{ id: 11, title: 'Очень странные дела', year: 2016, rating: 8.7, genres: ['Фантастика', 'Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-stranger-things.jpg', trailerUrl: 'https://www.youtube.com/embed/Ns1TyqmAKTU?autoplay=1&rel=0', summary: 'В тихом провинциальном городке Хоукинс загадочно исчезает подросток, открывая тайну параллельного измерения.' },
		{ id: 12, title: 'Острые козырьки', year: 2013, rating: 8.8, genres: ['Криминал', 'Драма'], country: 'Великобритания', quality: 'Full HD', poster: 'images/poster-peaky-blinders.jpg', trailerUrl: 'https://www.youtube.com/embed/0jMT4QZ3B6Y?autoplay=1&rel=0', summary: 'История криминального клана Шелби в Бирмингеме 1920-х годов под руководством амбициозного Томаса Шелби.' },
		{ id: 13, title: 'Дюна: Часть вторая', year: 2024, rating: 8.6, genres: ['Фантастика', 'Боевик'], country: 'США', quality: '4K UHD', poster: 'images/poster-dune-2.jpg', trailerUrl: 'https://www.youtube.com/embed/ZyUpJUNMYV4?autoplay=1&rel=0', summary: 'Пол Атрейдес объединяется с фрименами пустынной планеты Арракис, чтобы дать отпор заговорщикам, уничтожившим его семью.' },
		{ id: 14, title: 'Оппенгеймер', year: 2023, rating: 8.5, genres: ['Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-oppenheimer.jpg', trailerUrl: 'https://www.youtube.com/embed/FZBHHslg6gA?autoplay=1&rel=0', summary: 'История жизни американского физика-теоретика Роберта Оппенгеймера, стоявшего во главе Манхэттенского проекта.' },
		{ id: 15, title: 'Аватар: Путь воды', year: 2022, rating: 7.9, genres: ['Фантастика', 'Боевик'], country: 'США', quality: '4K UHD', poster: 'images/poster-avatar-2.jpg', trailerUrl: 'https://www.youtube.com/embed/L-2iTKw_BBg?autoplay=1&rel=0', summary: 'Джейк Салли и Нейтири вынуждены покинуть свой дом и отправиться к водным кланам Пандоры, чтобы защитить семью.' },
		{ id: 16, title: 'Бегущий по лезвию 2049', year: 2017, rating: 8.0, genres: ['Фантастика', 'Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-blade-runner.jpg', trailerUrl: 'https://www.youtube.com/embed/YIPFtD0oHxk?autoplay=1&rel=0', summary: 'Офицер полиции Кей раскрывает давний секрет, способный погрузить остатки человеческого общества в хаос.' },
		{ id: 17, title: '1+1 (Неприкасаемые)', year: 2011, rating: 8.8, genres: ['Драма', 'Комедия'], country: 'Франция', quality: 'Full HD', poster: 'images/poster-intouchables.jpg', trailerUrl: 'https://www.youtube.com/embed/UhV86p8xHIs?autoplay=1&rel=0', summary: 'Пострадавший в результате несчастного случая богатый аристократ Филипп нанимает в помощники жизнерадостного Дрисса.' },
		{ id: 18, title: 'Престиж', year: 2006, rating: 8.5, genres: ['Драма', 'Фантастика'], country: 'Великобритания', quality: 'Full HD', poster: 'images/poster-prestige.jpg', trailerUrl: 'https://www.youtube.com/embed/gh_nJkuMKGA?autoplay=1&rel=0', summary: 'Противостояние двух иллюзионистов в Лондоне на рубеже XIX и XX веков превращается в опасную одержимость.' },
		{ id: 19, title: 'Игра престолов', year: 2011, rating: 9.2, genres: ['Боевик', 'Драма'], country: 'США', quality: '4K UHD', poster: 'images/poster-game-of-thrones.jpg', trailerUrl: 'https://www.youtube.com/embed/edBuDu7QE14?autoplay=1&rel=0', summary: 'Эпическая борьба благородных домов Вестероса за Железный Трон на фоне пробуждения древней угрозы на Севере.' },
		{ id: 20, title: 'Мстители: Финал', year: 2019, rating: 8.4, genres: ['Фантастика', 'Боевик'], country: 'США', quality: '4K UHD', poster: 'images/poster-avengers-endgame.jpg', trailerUrl: 'https://www.youtube.com/embed/uTZYaoeo85I?autoplay=1&rel=0', summary: 'Оставшиеся в живых супергерои разрабатывают план путешествия во времени, чтобы обратить вспять действия Таноса.' }
	];

	// Автозаполнение списка «Популярные фильмы» в сайдбаре (на movies.html)
	const topMoviesList = document.getElementById('top-movies-list');
	if (topMoviesList && topMoviesList.children.length === 0) {
		const topFive = [...MOVIES_DATA].sort((a, b) => b.rating - a.rating).slice(0, 5);
		topMoviesList.innerHTML = topFive.map((m, idx) => `
			<li class="top-list-item">
				<span class="position-number">${idx + 1}</span>
				<div class="top-info">
					<a href="movie.html?id=${m.id}" class="top-link">${escapeHtml(m.title)}</a>
					<span class="rating">${m.rating.toFixed(1)}</span>
				</div>
			</li>
		`).join('');
	}

	// Инициализация кнопки режима печати
	const togglePrintBtn = document.getElementById('toggle-print-btn');
	const exitPrintBtn = document.getElementById('exit-print-btn');
	if (togglePrintBtn) {
		togglePrintBtn.addEventListener('click', () => document.body.classList.add('print-mode'));
	}
	if (exitPrintBtn) {
		exitPrintBtn.addEventListener('click', () => document.body.classList.remove('print-mode'));
	}

	// Инициализация каталога на index.html и movies.html
	const moviesContainer = document.getElementById('movies-container');
	if (moviesContainer) {
		let currentGenre = 'all';
		let currentSort = 'date';
		let currentPage = 1;
		const itemsPerPage = 5;
		const urlParams = new URLSearchParams(window.location.search);
		let searchQuery = (urlParams.get('search') || '').trim().toLowerCase();

		const searchInput = document.getElementById('search-input');
		if (searchInput && searchQuery) {
			searchInput.value = urlParams.get('search');
		}

		// Состояние умного фильтра (movies.html)
		const smartFilterContainer = document.getElementById('smart-filters-container');
		const selectedSmart = { genres: new Set(), country: new Set(), quality: new Set() };

		function filterMoviesList() {
			return MOVIES_DATA.filter(m => {
				if (searchQuery && !m.title.toLowerCase().includes(searchQuery)) return false;
				if (currentGenre !== 'all' && !m.genres.includes(currentGenre)) return false;
				if (selectedSmart.genres.size > 0 && !m.genres.some(g => selectedSmart.genres.has(g))) return false;
				if (selectedSmart.country.size > 0 && !selectedSmart.country.has(m.country)) return false;
				if (selectedSmart.quality.size > 0 && !selectedSmart.quality.has(m.quality)) return false;
				return true;
			}).sort((a, b) => currentSort === 'rating' ? b.rating - a.rating : b.year - a.year);
		}

		function renderSmartFilters() {
			if (!smartFilterContainer) return;
			const groups = [
				{ key: 'genres', title: 'Жанр', values: ['Фантастика', 'Боевик', 'Драма', 'Криминал', 'Комедия'], isArray: true },
				{ key: 'country', title: 'Страна производства', values: ['США', 'Великобритания', 'Франция'], isArray: false },
				{ key: 'quality', title: 'Качество видео', values: ['4K UHD', 'Full HD'], isArray: false }
			];

			smartFilterContainer.innerHTML = groups.map(group => {
				const itemsHtml = group.values.map(val => {
					const isChecked = selectedSmart[group.key].has(val);
					const matchingCount = MOVIES_DATA.filter(m => {
						if (searchQuery && !m.title.toLowerCase().includes(searchQuery)) return false;
						for (const gKey of ['genres', 'country', 'quality']) {
							if (gKey === group.key) continue;
							if (selectedSmart[gKey].size > 0) {
								if (gKey === 'genres' && !m.genres.some(x => selectedSmart.genres.has(x))) return false;
								if (gKey !== 'genres' && !selectedSmart[gKey].has(m[gKey])) return false;
							}
						}
						return group.isArray ? m.genres.includes(val) : m[group.key] === val;
					}).length;

					const isDisabled = matchingCount === 0 && !isChecked;
					return `
						<label class="filter-checkbox-item ${isDisabled ? 'disabled' : ''}">
							<input type="checkbox" data-group="${group.key}" value="${val}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
							<span>${val}</span>
							<span class="filter-count-badge">${matchingCount}</span>
						</label>
					`;
				}).join('');

				return `<div class="filter-group"><div class="filter-group-title">${group.title}</div>${itemsHtml}</div>`;
			}).join('');

			smartFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
				cb.addEventListener('change', () => {
					const grp = cb.dataset.group;
					if (cb.checked) selectedSmart[grp].add(cb.value);
					else selectedSmart[grp].delete(cb.value);
					currentPage = 1;
					updateCatalog();
				});
			});
		}

		function updateCatalog() {
			renderSmartFilters();
			const filtered = filterMoviesList();
			const activeMatches = document.getElementById('active-matches-info');
			if (activeMatches) activeMatches.textContent = `Найдено: ${filtered.length}`;

			const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
			if (currentPage > totalPages) currentPage = 1;

			const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
			moviesContainer.innerHTML = pageItems.length === 0
				? `<p class="not-found-text">По вашему запросу фильмов не найдено.</p>`
				: pageItems.map(m => `
					<article class="movie-card">
						<div class="poster-box">
							<a href="movie.html?id=${m.id}">
								<img src="${m.poster}" alt="Постер к фильму ${escapeHtml(m.title)}" class="poster-image">
							</a>
							<span class="movie-rating-badge">${m.rating.toFixed(1)}</span>
						</div>
						<div class="movie-info">
							<h3 class="movie-name"><a href="movie.html?id=${m.id}" class="movie-link">${escapeHtml(m.title)}</a></h3>
							<p class="movie-meta">${m.year} г. • ${m.genres.join(', ')} • ${m.country} (${m.quality})</p>
							<p class="movie-summary">${escapeHtml(m.summary)}</p>
							<div class="movie-actions">
								<a href="movie.html?id=${m.id}" class="button button-detail">Смотреть онлайн</a>
							</div>
						</div>
					</article>
				`).join('');

			const paginationEl = document.getElementById('pagination');
			if (paginationEl) {
				paginationEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
					<li class="page-item"><button type="button" class="page-link ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button></li>
				`).join('');
				paginationEl.querySelectorAll('.page-link').forEach(btn => {
					btn.addEventListener('click', () => {
						currentPage = Number(btn.dataset.page);
						updateCatalog();
					});
				});
			}
		}

		// Фильтр жанров в сайдбаре index.html
		document.querySelectorAll('#genre-filter .genre-link').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				document.querySelectorAll('#genre-filter .genre-link').forEach(l => l.classList.remove('active'));
				link.classList.add('active');
				currentGenre = link.dataset.genre || 'all';
				currentPage = 1;
				updateCatalog();
			});
		});

		// Сортировка
		const sortDate = document.getElementById('sort-date');
		const sortRating = document.getElementById('sort-rating');
		if (sortDate && sortRating) {
			sortDate.addEventListener('click', (e) => {
				e.preventDefault();
				currentSort = 'date';
				sortDate.classList.add('active');
				sortRating.classList.remove('active');
				updateCatalog();
			});
			sortRating.addEventListener('click', (e) => {
				e.preventDefault();
				currentSort = 'rating';
				sortRating.classList.add('active');
				sortDate.classList.remove('active');
				updateCatalog();
			});
		}

		const resetBtn = document.getElementById('reset-filters-btn');
		if (resetBtn) {
			resetBtn.addEventListener('click', () => {
				selectedSmart.genres.clear();
				selectedSmart.country.clear();
				selectedSmart.quality.clear();
				searchQuery = '';
				if (searchInput) searchInput.value = '';
				currentPage = 1;
				updateCatalog();
			});
		}

		const promoBtn = document.getElementById('promo-action-btn');
		if (promoBtn) {
			promoBtn.addEventListener('click', () => {
				window.location.href = 'movie.html?id=1';
			});
		}

		updateCatalog();
	}

	// =========================================================================
	// 6. СТРАНИЦА ОТДЕЛЬНОГО ФИЛЬМА И ОНЛАЙН-ПЛЕЕР YOUTUBE (movie.html)
	// =========================================================================
	const movieDetailsContainer = document.getElementById('movie-details-container');
	if (movieDetailsContainer) {
		const params = new URLSearchParams(window.location.search);
		const movieId = Number(params.get('id')) || 1;
		const movie = MOVIES_DATA.find(m => m.id === movieId) || MOVIES_DATA[0];

		document.title = `Kinobase — ${movie.title} (${movie.year})`;
		movieDetailsContainer.innerHTML = `
			<article class="movie-view-card">
				<div class="movie-view-header">
					<div class="movie-view-poster">
						<img src="${movie.poster}" alt="${escapeHtml(movie.title)}">
					</div>
					<div class="movie-view-info">
						<h1 class="movie-view-title">${escapeHtml(movie.title)}</h1>
						<p class="movie-view-meta"><span>Год:</span> ${movie.year} • <span>Жанр:</span> ${movie.genres.join(', ')} • <span>Страна:</span> ${movie.country}</p>
						<div class="movie-view-rating">Рейтинг Kinobase: ${movie.rating.toFixed(1)} / 10</div>
						<p class="movie-view-desc">${escapeHtml(movie.summary)}</p>
						<div>
							<a href="movies.html" class="button button-detail">← Все фильмы каталога</a>
						</div>
					</div>
				</div>
				<div class="player-section">
					<h3 class="widget-title">Онлайн-плеер (${movie.quality})</h3>
					<div class="player-box" id="video-player-box">
						<div class="player-icon" id="start-video-btn" title="Запустить просмотр"></div>
						<p class="player-caption">Нажмите Play для просмотра «${escapeHtml(movie.title)}» в качестве ${movie.quality}</p>
					</div>
				</div>
			</article>
		`;

		const startVideoBtn = document.getElementById('start-video-btn');
		const playerBox = document.getElementById('video-player-box');
		if (startVideoBtn && playerBox) {
			startVideoBtn.addEventListener('click', () => {
				playerBox.innerHTML = `
					<iframe
						src="${movie.trailerUrl}"
						title="Трейлер ${escapeHtml(movie.title)}"
						style="width: 100%; height: 100%; border: 0; border-radius: 6px; background: #000;"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen>
					</iframe>
				`;
			});
		}

		const similarList = document.getElementById('similar-movies-list');
		if (similarList) {
			const similar = MOVIES_DATA.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 5);
			similarList.innerHTML = similar.map((m, idx) => `
				<li class="top-list-item">
					<span class="position-number">${idx + 1}</span>
					<div class="top-info">
						<a href="movie.html?id=${m.id}" class="top-link">${escapeHtml(m.title)}</a>
						<span class="rating">${m.rating.toFixed(1)}</span>
					</div>
				</li>
			`).join('');
		}
	}

	// Запускаем модули Лабораторной работы №4
	buildAuthModal();
	updateAuthUI();
	initProfilePage();
	checkUrlAuthActions();
});