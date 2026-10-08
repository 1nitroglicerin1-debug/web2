document.addEventListener("DOMContentLoaded", function () {
	// ==========================================
	// База данных фильмов (20 фильмов)
	// ==========================================
	const moviesData = [
		{ id: 1, title: "Интерстеллар", year: 2014, rating: 8.6, genre: "Фантастика, Драма", type: "movies", file: "poster-interstellar.jpg", desc: "Когда засуха приводит человечество к глобальному кризису, команда исследователей отправляется сквозь червоточину в поисках нового дома." },
		{ id: 2, title: "Начало", year: 2010, rating: 8.7, genre: "Фантастика, Боевик", type: "movies", file: "poster-inception.jpg", desc: "Кобб — профессиональный вор, крадущий ценные секреты из глубин подсознания во время сна. Ему предстоит выполнить противоположное — внедрить мысль." },
		{ id: 3, title: "Матрица", year: 1999, rating: 8.5, genre: "Фантастика, Боевик", type: "movies", file: "poster-matrix.jpg", desc: "Хакер Нео узнает шокирующую правду: весь привычный мир — иллюзия, созданная машинами для контроля над людьми." },
		{ id: 4, title: "Гладиатор", year: 2000, rating: 8.6, genre: "Боевик, Драма", type: "movies", file: "poster-gladiator.jpg", desc: "Преданный римский полководец Максимус становится рабом-гладиатором и бросает вызов жестокому императору Рима." },
		{ id: 5, title: "Тёмный рыцарь", year: 2008, rating: 9.0, genre: "Боевик, Криминал", type: "top", file: "poster-dark-knight.jpg", desc: "Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Гордона и прокурора Дента он намерен очистить улицы Готэма от Джокера." },
		{ id: 6, title: "Побег из Шоушенка", year: 1994, rating: 9.1, genre: "Драма, Криминал", type: "top", file: "poster-shawshank.jpg", desc: "Бухгалтер Энди Дюфрейн несправедливо осужден на два пожизненных срока. Оказавшись в тюрьме Шоушенк, он не теряет надежду на свободу." },
		{ id: 7, title: "Криминальное чтиво", year: 1994, rating: 8.9, genre: "Криминал, Комедия", type: "top", file: "poster-pulp-fiction.jpg", desc: "Двое бандитов ведут философские беседы в перерывах между разборками и поручениями криминального босса." },
		{ id: 8, title: "Бойцовский клуб", year: 1999, rating: 8.7, genre: "Драма, Триллер", type: "movies", file: "poster-fight-club.jpg", desc: "Терзаемый бессонницей клерк встречает харизматичного торговца мылом Тайлера Дёрдена и открывает подпольный клуб." },
		{ id: 9, title: "Во все тяжкие", year: 2008, rating: 9.5, genre: "Драма, Криминал", type: "series", file: "poster-breaking-bad.jpg", desc: "Школьный учитель химии Уолтер Уайт узнает о смертельном диагнозе и решает варить метамфетамин ради будущего семьи." },
		{ id: 10, title: "Чернобыль", year: 2019, rating: 8.9, genre: "Драма, История", type: "series", file: "poster-chernobyl.jpg", desc: "Хроника катастрофы на Чернобыльской АЭС в 1986 году и самоотверженных усилий людей по ликвидации ее последствий." },
		{ id: 11, title: "Острые козырьки", year: 2013, rating: 8.4, genre: "Криминал, Драма", type: "series", file: "poster-peaky-blinders.jpg", desc: "Британская гангстерская сага о семье Шелби в Бирмингеме 1920-х годов под руководством Томаса Шелби." },
		{ id: 12, title: "Очень странные дела", year: 2016, rating: 8.4, genre: "Фантастика, Драма", type: "series", file: "poster-stranger-things.jpg", desc: "В тихом городке пропадает мальчик. Его друзья и семья сталкиваются с секретными экспериментами и потусторонним миром." },
		{ id: 13, title: "Дюна: Часть вторая", year: 2024, rating: 8.5, genre: "Фантастика, Боевик", type: "new", file: "poster-dune-2.jpg", desc: "Пол Атрейдес объединяется с фременами, чтобы отомстить заговорщикам, уничтожившим его семью на планете Арракис." },
		{ id: 14, title: "Оппенгеймер", year: 2023, rating: 8.4, genre: "Драма, История", type: "new", file: "poster-oppenheimer.jpg", desc: "История жизни американского физика-теоретика Роберта Оппенгеймера, руководителя Манхэттенского проекта." },
		{ id: 15, title: "Бегущий по лезвию 2049", year: 2017, rating: 8.0, genre: "Фантастика, Триллер", type: "movies", file: "poster-blade-runner.jpg", desc: "Офицер полиции Кей случайно натыкается на секрет, способный погрузить остатки цивилизации в хаос." },
		{ id: 16, title: "Престиж", year: 2006, rating: 8.5, genre: "Драма, Фантастика", type: "movies", file: "poster-prestige.jpg", desc: "Два фокусника-иллюзиониста в Лондоне на рубеже XIX и XX веков ведут смертельную борьбу за секреты мастерства." },
		{ id: 17, title: "1+1 (Неприкасаемые)", year: 2011, rating: 8.8, genre: "Комедия, Драма", type: "top", file: "poster-intouchables.jpg", desc: "Богатый аристократ, прикованный к инвалидному креслу, нанимает в качестве сиделки парня с криминальным прошлым." },
		{ id: 18, title: "Аватар: Путь воды", year: 2022, rating: 7.6, genre: "Фантастика, Боевик", type: "new", file: "poster-avatar-2.jpg", desc: "Джейк Салли и Нейтири борются за выживание своей семьи на прекрасной и опасной планете Пандора." },
		{ id: 19, title: "Игра престолов", year: 2011, rating: 9.2, genre: "Фэнтези, Драма", type: "series", file: "poster-game-of-thrones.jpg", desc: "К концу подходит время благоденствия. Несколько могущественных домов плетут интриги за Железный трон Вестероса." },
		{ id: 20, title: "Мстители: Финал", year: 2019, rating: 8.4, genre: "Фантастика, Боевик", type: "top", file: "poster-avengers-endgame.jpg", desc: "Оставшиеся в живых члены команды Мстителей разрабатывают дерзкий план, чтобы отменить действия Таноса." }
	];

	// =========================================================================
	// А. Логика страницы отдельного фильма (movie.html)
	// =========================================================================
	const movieDetailsContainer = document.getElementById("movie-details-container");
	if (movieDetailsContainer) {
		const params = new URLSearchParams(window.location.search);
		const movieId = Number(params.get("id")) || 1;
		const movie = moviesData.find(m => m.id === movieId);

		if (!movie) {
			movieDetailsContainer.innerHTML = `
				<div class="movie-view-card">
					<h2>Фильм не найден</h2>
					<p style="margin: 15px 0; color: #a0aec0;">Запрашиваемый фильм отсутствует в базе данных.</p>
					<a href="index.html" class="button button-primary">Вернуться на главную</a>
				</div>
			`;
		} else {
			document.title = `${movie.title} (${movie.year}) — Kinobase`;
			const titleTag = document.getElementById("movie-page-title");
			if (titleTag) titleTag.textContent = `${movie.title} — Kinobase`;

			movieDetailsContainer.innerHTML = `
				<article class="movie-view-card">
					<div class="movie-view-header">
						<div class="movie-view-poster">
							<img src="images/${movie.file}" alt="Постер к фильму ${movie.title}">
						</div>
						<div class="movie-view-info">
							<h1 class="movie-view-title">${movie.title}</h1>
							<div class="movie-view-rating">★ Рейтинг: ${movie.rating} / 10</div>
							<div class="movie-view-meta">
								<span>Год выпуска:</span> <strong>${movie.year}</strong><br>
								<span>Жанр:</span> <strong>${movie.genre}</strong>
							</div>
							<p class="movie-view-desc">${movie.desc}</p>
							<div>
								<button type="button" class="button button-primary" onclick="document.getElementById('video-player').scrollIntoView({behavior: 'smooth'})">Смотреть онлайн</button>
								<a href="index.html" class="button button-detail" style="margin-left: 10px;">В каталог</a>
							</div>
						</div>
					</div>

					<!-- Онлайн-плеер -->
					<section class="player-section" id="video-player">
						<h3 class="widget-title">Онлайн плеер Kinobase</h3>
						<div class="player-box">
							<div class="player-icon" onclick="alert('Воспроизведение: ${movie.title}')"></div>
							<p class="player-caption">Нажмите для запуска официального видеоплеера Full HD 1080p</p>
						</div>
					</section>
				</article>
			`;

			// Сайдбар: похожие фильмы, отсортированные строго по рейтингу
			const similarList = document.getElementById("similar-movies-list");
			if (similarList) {
				const mainGenre = movie.genre.split(",")[0].trim();
				const similar = moviesData
					.filter(m => m.id !== movie.id && m.genre.includes(mainGenre))
					.sort((a, b) => b.rating - a.rating)
					.slice(0, 4);

				similarList.innerHTML = similar.map((m, idx) => `
					<li class="top-list-item">
						<span class="position-number">${idx + 1}</span>
						<div class="top-info">
							<a href="movie.html?id=${m.id}" class="top-link">${m.title}</a>
							<span class="rating">${m.rating}</span>
						</div>
					</li>
				`).join("");
			}
		}
	}

	// =========================================================================
	// Б. Логика каталога на главной странице (index.html)
	// =========================================================================
	const moviesContainer = document.getElementById("movies-container");
	if (moviesContainer) {
		const urlParams = new URLSearchParams(window.location.search);
		let currentTab = urlParams.get("tab") || "all";
		let currentGenre = "all";
		let currentSort = currentTab === "top" ? "rating" : "date";
		let searchQuery = urlParams.get("search") ? urlParams.get("search").toLowerCase().trim() : "";
		let currentPage = 1;
		const pageSize = 5;

		const pagination = document.getElementById("pagination");
		const catalogTitle = document.getElementById("catalog-title");
		const promoBanner = document.getElementById("promo-banner");
		const catalogView = document.getElementById("catalog-view");
		const contactsView = document.getElementById("contacts-view");
		const sortDateBtn = document.getElementById("sort-date");
		const sortRatingBtn = document.getElementById("sort-rating");
		const searchInput = document.getElementById("search-input");
		const searchForm = document.getElementById("search-form");

		if (searchInput && searchQuery) {
			searchInput.value = searchQuery;
		}

		function updateGenreCounters() {
			const genres = [
				{ id: "count-all", name: "all" },
				{ id: "count-sci-fi", name: "Фантастика" },
				{ id: "count-action", name: "Боевик" },
				{ id: "count-drama", name: "Драма" },
				{ id: "count-crime", name: "Криминал" },
				{ id: "count-comedy", name: "Комедия" }
			];

			genres.forEach(g => {
				const el = document.getElementById(g.id);
				if (el) {
					const count = g.name === "all"
						? moviesData.length
						: moviesData.filter(m => m.genre.includes(g.name)).length;
					el.textContent = `(${count})`;
				}
			});
		}

		function renderTopSidebar() {
			const topList = document.getElementById("top-movies-list");
			if (!topList) return;
			const sorted = [...moviesData].sort((a, b) => b.rating - a.rating).slice(0, 5);
			topList.innerHTML = sorted.map((m, idx) => `
				<li class="top-list-item">
					<span class="position-number">${idx + 1}</span>
					<div class="top-info">
						<a href="movie.html?id=${m.id}" class="top-link">${m.title}</a>
						<span class="rating">${m.rating}</span>
					</div>
				</li>
			`).join("");
		}

		function getFilteredMovies() {
			return moviesData.filter(movie => {
				if (currentTab === "movies" && movie.type !== "movies") return false;
				if (currentTab === "series" && movie.type !== "series") return false;
				if (currentTab === "new" && movie.type !== "new") return false;
				if (currentTab === "top" && movie.rating < 8.6) return false;

				if (currentGenre !== "all" && !movie.genre.includes(currentGenre)) return false;

				if (searchQuery) {
					const full = (movie.title + " " + movie.desc).toLowerCase();
					if (!full.includes(searchQuery)) return false;
				}
				return true;
			}).sort((a, b) => {
				// Во вкладке "Топ-100" сортировка ВСЕГДА по рейтингу по убыванию
				if (currentTab === "top" || currentSort === "rating") {
					return b.rating - a.rating;
				}
				return b.year - a.year;
			});
		}

		function renderCatalog() {
			const filtered = getFilteredMovies();
			const totalPages = Math.ceil(filtered.length / pageSize) || 1;
			if (currentPage > totalPages) currentPage = 1;

			const start = (currentPage - 1) * pageSize;
			const pageMovies = filtered.slice(start, start + pageSize);

			if (pageMovies.length === 0) {
				moviesContainer.innerHTML = `<p style="padding: 20px; color: #a0aec0;">Фильмов не найдено. Попробуйте сбросить фильтры.</p>`;
			} else {
				moviesContainer.innerHTML = pageMovies.map(movie => `
					<article class="movie-card">
						<div class="poster-box">
							<a href="movie.html?id=${movie.id}">
								<img src="images/${movie.file}" alt="Постер к фильму ${movie.title}" class="poster-image">
							</a>
							<span class="movie-rating-badge">${movie.rating}</span>
						</div>
						<div class="movie-info">
							<h3 class="movie-name"><a href="movie.html?id=${movie.id}" class="movie-link">${movie.title}</a></h3>
							<p class="movie-meta">${movie.year} г. • ${movie.genre}</p>
							<p class="movie-summary">${movie.desc}</p>
							<div class="movie-actions">
								<a href="movie.html?id=${movie.id}" class="button button-detail">Смотреть</a>
							</div>
						</div>
					</article>
				`).join("");
			}

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
					window.scrollTo({ top: 250, behavior: "smooth" });
				});
			});
		}

		function applyTab(tabName, titleText) {
			currentTab = tabName;
			currentPage = 1;

			document.querySelectorAll("#nav-tabs .nav-item").forEach(item => {
				const link = item.querySelector(".nav-link");
				if (link && link.dataset.tab === tabName) {
					item.classList.add("active");
				} else {
					item.classList.remove("active");
				}
			});

			if (currentTab === "contacts") {
				if (promoBanner) promoBanner.classList.add("hidden");
				if (catalogView) catalogView.classList.add("hidden");
				if (contactsView) contactsView.classList.remove("hidden");
			} else {
				if (contactsView) contactsView.classList.add("hidden");
				if (catalogView) catalogView.classList.remove("hidden");
				if (promoBanner) promoBanner.classList.remove("hidden");

				if (currentTab === "top") {
					currentSort = "rating";
					if (sortRatingBtn) sortRatingBtn.classList.add("active");
					if (sortDateBtn) sortDateBtn.classList.remove("active");
				}

				if (catalogTitle && titleText) catalogTitle.textContent = titleText;
				renderCatalog();
			}
		}

		// Обработка кликов по вкладкам на главной
		const navLinks = document.querySelectorAll("#nav-tabs .nav-link");
		navLinks.forEach(link => {
			link.addEventListener("click", function (e) {
				e.preventDefault();
				applyTab(this.dataset.tab, this.textContent);
			});
		});

		// Сайдбар - фильтрация по жанрам
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

		// Переключатели сортировки
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

		// Поиск
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

		// Стартовая инициализация
		updateGenreCounters();
		renderTopSidebar();

		const initialTabTitles = {
			all: "Главная",
			movies: "Фильмы",
			series: "Сериалы",
			new: "Новинки",
			top: "Топ-100",
			contacts: "Контакты"
		};
		applyTab(currentTab, initialTabTitles[currentTab] || "Новинки проката");
	}

	// =========================================================================
	// В. Общие модули (Вход, Контакты)
	// =========================================================================
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

	const feedback = document.getElementById("feedback-form");
	if (feedback) {
		feedback.addEventListener("submit", function (e) {
			e.preventDefault();
			alert("Спасибо! Ваше обращение отправлено администрации Kinobase.");
			feedback.reset();
		});
	}

	const promoBtn = document.getElementById("promo-action-btn");
	if (promoBtn) {
		promoBtn.addEventListener("click", () => {
			window.location.href = "movie.html?id=1";
		});
	}
});