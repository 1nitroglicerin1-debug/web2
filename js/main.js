document.addEventListener("DOMContentLoaded", function () {
	// ==========================================
	// База данных из 20 фильмов
	// ==========================================
	const moviesData = [
		{ id: 1, title: "Интерстеллар", year: 2014, rating: 8.6, genre: "Фантастика, Драма", type: "movies", desc: "Когда засуха приводит человечество к глобальному кризису, команда исследователей отправляется сквозь червоточину в поисках нового дома.", color1: "#0b1d3a", color2: "#1e3a5f" },
		{ id: 2, title: "Начало", year: 2010, rating: 8.7, genre: "Фантастика, Боевик", type: "movies", desc: "Кобб — профессиональный вор, крадущий ценные секреты из глубин подсознания во время сна. Ему предстоит выполнить противоположное — внедрить мысль.", color1: "#2d3748", color2: "#1a202c" },
		{ id: 3, title: "Матрица", year: 1999, rating: 8.5, genre: "Фантастика, Боевик", type: "movies", desc: "Хакер Нео узнает шокирующую правду: весь привычный мир — иллюзия, созданная машинами для контроля над людьми.", color1: "#082f14", color2: "#021207" },
		{ id: 4, title: "Гладиатор", year: 2000, rating: 8.6, genre: "Боевик, Драма", type: "movies", desc: "Преданный римский полководец Максимус становится рабом-гладиатором и бросает вызов жестокому императору Рима.", color1: "#4a2408", color2: "#2a1204" },
		{ id: 5, title: "Тёмный рыцарь", year: 2008, rating: 9.0, genre: "Боевик, Криминал", type: "top", desc: "Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Гордона и прокурора Дента он намерен очистить улицы Готэма от Джокера.", color1: "#1a202c", color2: "#0f172a" },
		{ id: 6, title: "Побег из Шоушенка", year: 1994, rating: 9.1, genre: "Драма, Криминал", type: "top", desc: "Бухгалтер Энди Дюфрейн несправедливо осужден на два пожизненных срока. Оказавшись в тюрьме Шоушенк, он не теряет надежду на свободу.", color1: "#334155", color2: "#1e293b" },
		{ id: 7, title: "Криминальное чтиво", year: 1994, rating: 8.9, genre: "Криминал, Комедия", type: "top", desc: "Двое бандитов ведут философские беседы в перерывах между разборками и поручениями криминального босса.", color1: "#3b1e08", color2: "#1e0f04" },
		{ id: 8, title: "Бойцовский клуб", year: 1999, rating: 8.7, genre: "Драма, Триллер", type: "movies", desc: "Терзаемый бессонницей клерк встречает харизматичного торговца мылом Тайлера Дёрдена и открывает подпольный клуб.", color1: "#471822", color2: "#21090e" },
		{ id: 9, title: "Во все тяжкие", year: 2008, rating: 9.5, genre: "Драма, Криминал", type: "series", desc: "Школьный учитель химии Уолтер Уайт узнает о смертельном диагнозе и решает варить метамфетамин ради будущего семьи.", color1: "#064e3b", color2: "#022c22" },
		{ id: 10, title: "Чернобыль", year: 2019, rating: 8.9, genre: "Драма, История", type: "series", desc: "Хроника катастрофы на Чернобыльской АЭС в 1986 году и самоотверженных усилий людей по ликвидации ее последствий.", color1: "#364152", color2: "#1c2430" },
		{ id: 11, title: "Острые козырьки", year: 2013, rating: 8.4, genre: "Криминал, Драма", type: "series", desc: "Британская гангстерская сага о семье Шелби в Бирмингеме 1920-х годов под руководством Томаса Шелби.", color1: "#27272a", color2: "#18181b" },
		{ id: 12, title: "Очень странные дела", year: 2016, rating: 8.4, genre: "Фантастика, Драма", type: "series", desc: "В тихом городке пропадает мальчик. Его друзья и семья сталкиваются с секретными экспериментами и потусторонним миром.", color1: "#581c87", color2: "#2e1065" },
		{ id: 13, title: "Дюна: Часть вторая", year: 2024, rating: 8.5, genre: "Фантастика, Боевик", type: "new", desc: "Пол Атрейдес объединяется с фременами, чтобы отомстить заговорщикам, уничтожившим его семью на планете Арракис.", color1: "#78350f", color2: "#451a03" },
		{ id: 14, title: "Оппенгеймер", year: 2023, rating: 8.4, genre: "Драма, История", type: "new", desc: "История жизни американского физика-теоретика Роберта Оппенгеймера, руководителя Манхэттенского проекта.", color1: "#713f12", color2: "#3b1e08" },
		{ id: 15, title: "Бегущий по лезвию 2049", year: 2017, rating: 8.0, genre: "Фантастика, Триллер", type: "movies", desc: "Офицер полиции Кей случайно натыкается на секрет, способный погрузить остатки цивилизации в хаос.", color1: "#0c4a6e", color2: "#082f49" },
		{ id: 16, title: "Престиж", year: 2006, rating: 8.5, genre: "Драма, Фантастика", type: "movies", desc: "Два фокусника-иллюзиониста в Лондоне на рубеже XIX и XX веков ведут смертельную борьбу за секреты мастерства.", color1: "#312e81", color2: "#1e1b4b" },
		{ id: 17, title: "1+1 (Неприкасаемые)", year: 2011, rating: 8.8, genre: "Комедия, Драма", type: "top", desc: "Богатый аристократ, прикованный к инвалидному креслу, нанимает в качестве сиделки парня с криминальным прошлым.", color1: "#1e293b", color2: "#0f172a" },
		{ id: 18, title: "Аватар: Путь воды", year: 2022, rating: 7.6, genre: "Фантастика, Боевик", type: "new", desc: "Джейк Салли и Нейтири борются за выживание своей семьи на прекрасной и опасной планете Пандора.", color1: "#0891b2", color2: "#164e63" },
		{ id: 19, title: "Игра престолов", year: 2011, rating: 9.2, genre: "Фэнтези, Драма", type: "series", desc: "К концу подходит время благоденствия. Несколько могущественных домов плетут интриги за Железный трон Вестероса.", color1: "#3f3f46", color2: "#18181b" },
		{ id: 20, title: "Мстители: Финал", year: 2019, rating: 8.4, genre: "Фантастика, Боевик", type: "top", desc: "Оставшиеся в живых члены команды Мстителей разрабатывают дерзкий план, чтобы отменить действия Таноса.", color1: "#4c1d95", color2: "#2e1065" }
	];

	// Состояние страницы
	let currentGenre = "all";
	let currentTab = "all";
	let currentSort = "date";
	let searchQuery = "";
	let currentPage = 1;
	const pageSize = 5; // 5 фильмов на страницу = ровно 4 страницы

	const container = document.getElementById("movies-container");
	const pagination = document.getElementById("pagination");
	const catalogTitle = document.getElementById("catalog-title");

	// Функция рисования постера прямо в Canvas (чтобы не нужны были картинки)
	function drawPoster(canvas, movie) {
		const ctx = canvas.getContext("2d");
		const grad = ctx.createLinearGradient(0, 0, 0, 190);
		grad.addColorStop(0, movie.color1);
		grad.addColorStop(1, movie.color2);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, 140, 190);

		// Рамка
		ctx.strokeStyle = "#ed8936";
		ctx.lineWidth = 1;
		ctx.strokeRect(8, 8, 124, 174);

		// Заголовок
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 13px Arial";
		ctx.textAlign = "center";

		// Если название длинное, переносим
		const words = movie.title.split(" ");
		if (words.length > 2) {
			ctx.fillText(words.slice(0, 2).join(" "), 70, 90);
			ctx.fillText(words.slice(2).join(" "), 70, 110);
		} else {
			ctx.fillText(movie.title, 70, 100);
		}

		// Год
		ctx.fillStyle = "#ed8936";
		ctx.font = "11px Arial";
		ctx.fillText(movie.year, 70, 130);
	}

	// Рендер сайдбара "Популярные фильмы"
	function renderTopSidebar() {
		const topList = document.getElementById("top-movies-list");
		if (!topList) return;
		const sorted = [...moviesData].sort((a, b) => b.rating - a.rating).slice(0, 5);
		topList.innerHTML = sorted.map((m, idx) => `
			<li class="top-list-item">
				<span class="position-number">${idx + 1}</span>
				<div class="top-info">
					<a href="#" class="top-link" data-id="${m.id}">${m.title}</a>
					<span class="rating">${m.rating}</span>
				</div>
			</li>
		`).join("");

		topList.querySelectorAll(".top-link").forEach(link => {
			link.addEventListener("click", function (e) {
				e.preventDefault();
				document.getElementById("search-input").value = this.textContent;
				searchQuery = this.textContent.toLowerCase();
				currentPage = 1;
				renderCatalog();
			});
		});
	}

	// Фильтрация, сортировка и пагинация
	function getFilteredMovies() {
		return moviesData.filter(movie => {
			// Фильтр по верхним вкладкам
			if (currentTab === "movies" && movie.type !== "movies") return false;
			if (currentTab === "series" && movie.type !== "series") return false;
			if (currentTab === "new" && movie.type !== "new") return false;
			if (currentTab === "top" && movie.rating < 8.7) return false;

			// Фильтр по сайдбару
			if (currentGenre !== "all" && !movie.genre.includes(currentGenre)) return false;

			// Поиск
			if (searchQuery) {
				const full = (movie.title + " " + movie.desc).toLowerCase();
				if (!full.includes(searchQuery)) return false;
			}
			return true;
		}).sort((a, b) => {
			if (currentSort === "date") return b.year - a.year;
			return b.rating - a.rating;
		});
	}

	function renderCatalog() {
		const filtered = getFilteredMovies();
		const totalPages = Math.ceil(filtered.length / pageSize) || 1;
		if (currentPage > totalPages) currentPage = 1;

		const start = (currentPage - 1) * pageSize;
		const pageMovies = filtered.slice(start, start + pageSize);

		if (pageMovies.length === 0) {
			container.innerHTML = `<p style="padding: 20px; color: #a0aec0;">Фильмов не найдено. Попробуйте сбросить фильтры или изменить поиск.</p>`;
		} else {
			container.innerHTML = pageMovies.map(movie => `
				<article class="movie-card">
					<div class="poster-box">
						<canvas class="poster-canvas" width="140" height="190" id="canvas-${movie.id}"></canvas>
						<span class="movie-rating-badge">${movie.rating}</span>
					</div>
					<div class="movie-info">
						<h3 class="movie-name"><a href="#" class="movie-link">${movie.title}</a></h3>
						<p class="movie-meta">${movie.year} г. • ${movie.genre}</p>
						<p class="movie-summary">${movie.desc}</p>
						<div class="movie-actions">
							<button type="button" class="button button-detail" onclick="alert('Открытие фильма: ${movie.title}')">Смотреть</button>
						</div>
					</div>
				</article>
			`).join("");

			// Отрисовываем каждый постер
			pageMovies.forEach(movie => {
				const c = document.getElementById(`canvas-${movie.id}`);
				if (c) drawPoster(c, movie);
			});
		}

		// Рендер кнопок страниц пагинации
		renderPagination(totalPages);
	}

	function renderPagination(totalPages) {
		let html = "";
		for (let i = 1; i <= totalPages; i++) {
			html += `<li class="page-item"><button type="button" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button></li>`;
		}
		pagination.innerHTML = html;

		pagination.querySelectorAll(".page-link").forEach(btn => {
			btn.addEventListener("click", function () {
				currentPage = Number(this.dataset.page);
				renderCatalog();
				window.scrollTo({ top: 300, behavior: "smooth" });
			});
		});
	}

	// ==========================================
	// 1. Вкладки главного меню
	// ==========================================
	const navLinks = document.querySelectorAll("#nav-tabs .nav-link");
	const promoBanner = document.getElementById("promo-banner");
	const catalogView = document.getElementById("catalog-view");
	const contactsView = document.getElementById("contacts-view");

	navLinks.forEach(link => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			navLinks.forEach(l => l.parentElement.classList.remove("active"));
			this.parentElement.classList.add("active");

			currentTab = this.dataset.tab;
			currentPage = 1;

			if (currentTab === "contacts") {
				promoBanner.classList.add("hidden");
				catalogView.classList.add("hidden");
				contactsView.classList.remove("hidden");
			} else {
				contactsView.classList.add("hidden");
				catalogView.classList.remove("hidden");
				promoBanner.classList.remove("hidden");

				catalogTitle.textContent = this.textContent;
				renderCatalog();
			}
		});
	});

	// Кнопка в футере "Контакты"
	const footerContact = document.getElementById("footer-contact-link");
	if (footerContact) {
		footerContact.addEventListener("click", function (e) {
			e.preventDefault();
			const contactTab = document.querySelector('[data-tab="contacts"]');
			if (contactTab) contactTab.click();
		});
	}

	// ==========================================
	// 2. Сайдбар - фильтр по жанрам
	// ==========================================
	const genreLinks = document.querySelectorAll("#genre-filter .genre-link");
	genreLinks.forEach(link => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			genreLinks.forEach(l => l.classList.remove("active"));
			this.classList.add("active");
			currentGenre = this.dataset.genre;
			currentPage = 1;
			renderCatalog();
		});
	});

	// ==========================================
	// 3. Сортировка по дате / рейтингу
	// ==========================================
	const sortDateBtn = document.getElementById("sort-date");
	const sortRatingBtn = document.getElementById("sort-rating");

	if (sortDateBtn && sortRatingBtn) {
		sortDateBtn.addEventListener("click", function (e) {
			e.preventDefault();
			sortRatingBtn.classList.remove("active");
			this.classList.add("active");
			currentSort = "date";
			renderCatalog();
		});

		sortRatingBtn.addEventListener("click", function (e) {
			e.preventDefault();
			sortDateBtn.classList.remove("active");
			this.classList.add("active");
			currentSort = "rating";
			renderCatalog();
		});
	}

	// ==========================================
	// 4. Поиск
	// ==========================================
	const searchInput = document.getElementById("search-input");
	const searchForm = document.getElementById("search-form");

	if (searchInput) {
		searchInput.addEventListener("input", function () {
			searchQuery = this.value.toLowerCase().trim();
			currentPage = 1;
			renderCatalog();
		});
	}

	if (searchForm) {
		searchForm.addEventListener("submit", function (e) {
			e.preventDefault();
			searchQuery = searchInput.value.toLowerCase().trim();
			currentPage = 1;
			renderCatalog();
		});
	}

	// ==========================================
	// 5. Модалка входа
	// ==========================================
	const loginBtn = document.getElementById("open-login-btn");
	const loginModal = document.getElementById("login-modal");
	const closeModalBtn = document.getElementById("close-modal-btn");
	const loginForm = document.getElementById("login-form");

	if (loginBtn && loginModal) {
		loginBtn.addEventListener("click", () => loginModal.classList.remove("hidden"));
		closeModalBtn.addEventListener("click", () => loginModal.classList.add("hidden"));
		loginModal.addEventListener("click", (e) => {
			if (e.target === loginModal) loginModal.classList.add("hidden");
		});

		loginForm.addEventListener("submit", function (e) {
			e.preventDefault();
			const email = document.getElementById("login-email").value;
			alert(`Вы успешно вошли как: ${email}`);
			loginModal.classList.add("hidden");
			loginBtn.textContent = email.split("@")[0];
		});
	}

	// Форма обратной связи
	const feedback = document.getElementById("feedback-form");
	if (feedback) {
		feedback.addEventListener("submit", function (e) {
			e.preventDefault();
			alert("Спасибо! Ваше обращение отправлено администрации Kinobase.");
			feedback.reset();
		});
	}

	// Кнопка трейлера в баннере
	const promoBtn = document.getElementById("promo-action-btn");
	if (promoBtn) {
		promoBtn.addEventListener("click", function () {
			alert("Запуск премьерного трейлера недели!");
		});
	}

	// Старт
	renderTopSidebar();
	renderCatalog();
});