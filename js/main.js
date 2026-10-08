document.addEventListener("DOMContentLoaded", function () {
	// ==========================================
	// База данных фильмов Kinobase (20 фильмов)
	// ==========================================
	const moviesData = [
		{ id: 1, title: "Интерстеллар", year: 2014, epoch: "2010-е", rating: 8.6, ratingTier: "8.5+", genre: "Фантастика, Драма", mainGenre: "Фантастика", file: "poster-interstellar.jpg", desc: "Когда засуха приводит человечество к глобальному кризису, команда исследователей отправляется сквозь червоточину в поисках нового дома." },
		{ id: 2, title: "Начало", year: 2010, epoch: "2010-е", rating: 8.7, ratingTier: "8.5+", genre: "Фантастика, Боевик", mainGenre: "Фантастика", file: "poster-inception.jpg", desc: "Кобб — профессиональный вор, крадущий ценные секреты из глубин подсознания во время сна. Ему предстоит внедрить чужую мысль." },
		{ id: 3, title: "Матрица", year: 1999, epoch: "1990-е", rating: 8.5, ratingTier: "8.5+", genre: "Фантастика, Боевик", mainGenre: "Фантастика", file: "poster-matrix.jpg", desc: "Хакер Нео узнает шокирующую правду: весь привычный мир — иллюзия, созданная машинами для контроля над людьми." },
		{ id: 4, title: "Гладиатор", year: 2000, epoch: "2000-е", rating: 8.6, ratingTier: "8.5+", genre: "Боевик, Драма", mainGenre: "Боевик", file: "poster-gladiator.jpg", desc: "Преданный римский полководец Максимус становится рабом-гладиатором и бросает вызов жестокому императору Рима." },
		{ id: 5, title: "Тёмный рыцарь", year: 2008, epoch: "2000-е", rating: 9.0, ratingTier: "9.0+", genre: "Боевик, Криминал", mainGenre: "Боевик", file: "poster-dark-knight.jpg", desc: "Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Гордона он намерен очистить улицы Готэма от Джокера." },
		{ id: 6, title: "Побег из Шоушенка", year: 1994, epoch: "1990-е", rating: 9.1, ratingTier: "9.0+", genre: "Драма, Криминал", mainGenre: "Драма", file: "poster-shawshank.jpg", desc: "Бухгалтер Энди Дюфрейн несправедливо осужден на два пожизненных срока в мрачной тюрьме Шоушенк." },
		{ id: 7, title: "Криминальное чтиво", year: 1994, epoch: "1990-е", rating: 8.9, ratingTier: "8.5+", genre: "Криминал, Комедия", mainGenre: "Криминал", file: "poster-pulp-fiction.jpg", desc: "Двое бандитов ведут философские беседы в перерывах между разборками и поручениями криминального босса." },
		{ id: 8, title: "Бойцовский клуб", year: 1999, epoch: "1990-е", rating: 8.7, ratingTier: "8.5+", genre: "Драма, Триллер", mainGenre: "Драма", file: "poster-fight-club.jpg", desc: "Терзаемый бессонницей клерк встречает харизматичного торговца мылом Тайлера Дёрдена и открывает подпольный клуб." },
		{ id: 9, title: "Во все тяжкие", year: 2008, epoch: "2000-е", rating: 9.5, ratingTier: "9.0+", genre: "Драма, Криминал", mainGenre: "Драма", file: "poster-breaking-bad.jpg", desc: "Школьный учитель химии Уолтер Уайт узнает о смертельном диагнозе и решает производить метамфетамин ради семьи." },
		{ id: 10, title: "Чернобыль", year: 2019, epoch: "2010-е", rating: 8.9, ratingTier: "8.5+", genre: "Драма, История", mainGenre: "Драма", file: "poster-chernobyl.jpg", desc: "Хроника катастрофы на Чернобыльской АЭС в 1986 году и самоотверженных усилий людей по ликвидации ее последствий." },
		{ id: 11, title: "Острые козырьки", year: 2013, epoch: "2010-е", rating: 8.4, ratingTier: "8.0+", genre: "Криминал, Драма", mainGenre: "Криминал", file: "poster-peaky-blinders.jpg", desc: "Британская гангстерская сага о семье Шелби в Бирмингеме 1920-х годов под руководством Томаса Шелби." },
		{ id: 12, title: "Очень странные дела", year: 2016, epoch: "2010-е", rating: 8.4, ratingTier: "8.0+", genre: "Фантастика, Драма", mainGenre: "Фантастика", file: "poster-stranger-things.jpg", desc: "В тихом городке пропадает мальчик. Его друзья сталкиваются с секретными экспериментами и потусторонним миром." },
		{ id: 13, title: "Дюна: Часть вторая", year: 2024, epoch: "2020-е", rating: 8.5, ratingTier: "8.5+", genre: "Фантастика, Боевик", mainGenre: "Фантастика", file: "poster-dune-2.jpg", desc: "Пол Атрейдес объединяется с фременами, чтобы отомстить заговорщикам, уничтожившим его семью на Арракисе." },
		{ id: 14, title: "Оппенгеймер", year: 2023, epoch: "2020-е", rating: 8.4, ratingTier: "8.0+", genre: "Драма, История", mainGenre: "Драма", file: "poster-oppenheimer.jpg", desc: "История жизни американского физика-теоретика Роберта Оппенгеймера, руководителя Манхэттенского проекта." },
		{ id: 15, title: "Бегущий по лезвию 2049", year: 2017, epoch: "2010-е", rating: 8.0, ratingTier: "8.0+", genre: "Фантастика, Триллер", mainGenre: "Фантастика", file: "poster-blade-runner.jpg", desc: "Офицер полиции Кей случайно натыкается на секрет, способный погрузить остатки цивилизации в хаос." },
		{ id: 16, title: "Престиж", year: 2006, epoch: "2000-е", rating: 8.5, ratingTier: "8.5+", genre: "Драма, Фантастика", mainGenre: "Драма", file: "poster-prestige.jpg", desc: "Два фокусника-иллюзиониста в Лондоне ведут смертельную борьбу за секреты непревзойденного мастерства." },
		{ id: 17, title: "1+1 (Неприкасаемые)", year: 2011, epoch: "2010-е", rating: 8.8, ratingTier: "8.5+", genre: "Комедия, Драма", mainGenre: "Комедия", file: "poster-intouchables.jpg", desc: "Богатый аристократ в инвалидном кресле нанимает в качестве сиделки парня с уличным криминальным прошлым." },
		{ id: 18, title: "Аватар: Путь воды", year: 2022, epoch: "2020-е", rating: 7.6, ratingTier: "До 8.0", genre: "Фантастика, Боевик", mainGenre: "Фантастика", file: "poster-avatar-2.jpg", desc: "Джейк Салли и Нейтири борются за выживание своей семьи на прекрасной и опасной планете Пандора." },
		{ id: 19, title: "Игра престолов", year: 2011, epoch: "2010-е", rating: 9.2, ratingTier: "9.0+", genre: "Фэнтези, Драма", mainGenre: "Драма", file: "poster-game-of-thrones.jpg", desc: "Несколько могущественных домов Вестероса плетут смертельные заговоры за право обладания Железным троном." },
		{ id: 20, title: "Мстители: Финал", year: 2019, epoch: "2010-е", rating: 8.4, ratingTier: "8.0+", genre: "Фантастика, Боевик", mainGenre: "Фантастика", file: "poster-avengers-endgame.jpg", desc: "Оставшиеся в живых члены команды Мстителей разрабатывают план отмены катастрофических действий Таноса." }
	];

	// =========================================================================
	// 1. КОНТРОЛЬНЫЙ ЭЛЕМЕНТ №1: ВЕРСИЯ ДЛЯ ПЕЧАТИ (Print Mode)
	// =========================================================================
	const togglePrintBtn = document.getElementById("toggle-print-btn");
	const exitPrintBtn = document.getElementById("exit-print-btn");

	function setPrintMode(enable) {
		if (enable) {
			document.body.classList.add("print-mode");
		} else {
			document.body.classList.remove("print-mode");
		}
	}

	if (togglePrintBtn) {
		togglePrintBtn.addEventListener("click", function () {
			setPrintMode(true);
		});
	}

	if (exitPrintBtn) {
		exitPrintBtn.addEventListener("click", function () {
			setPrintMode(false);
		});
	}

	// =========================================================================
	// 2. КОНТРОЛЬНЫЙ ЭЛЕМЕНТ №2: УМНЫЙ ФИЛЬТР (Smart Filter с 3 критериями)
	// Критерий 1: Жанр (mainGenre)
	// Критерий 2: Эпоха / Период (epoch: 1990-е, 2000-е, 2010-е, 2020-е)
	// Критерий 3: Рейтинг Кинопоиск (ratingTier: 9.0+, 8.5+, 8.0+, До 8.0)
	// =========================================================================
	const smartFiltersContainer = document.getElementById("smart-filters-container");
	const moviesContainer = document.getElementById("movies-container");

	if (smartFiltersContainer && moviesContainer) {
		const filterStructure = {
			mainGenre: {
				title: "Жанр кино",
				options: ["Фантастика", "Боевик", "Драма", "Криминал", "Комедия"]
			},
			epoch: {
				title: "Эпоха / Годы",
				options: ["1990-е", "2000-е", "2010-е", "2020-е"]
			},
			ratingTier: {
				title: "Рейтинг Kinobase",
				options: ["9.0+", "8.5+", "8.0+", "До 8.0"]
			}
		};

		// Текущее состояние выбранных чекбоксов
		let selectedFilters = {
			mainGenre: [],
			epoch: [],
			ratingTier: []
		};

		let currentSort = "date";
		let searchQuery = new URLSearchParams(window.location.search).get("search") || "";
		let currentPage = 1;
		const pageSize = 5;

		const activeMatchesInfo = document.getElementById("active-matches-info");
		const resetFiltersBtn = document.getElementById("reset-filters-btn");
		const sortDateBtn = document.getElementById("sort-date");
		const sortRatingBtn = document.getElementById("sort-rating");
		const searchInput = document.getElementById("search-input");
		const searchForm = document.getElementById("search-form");

		if (searchInput && searchQuery) {
			searchInput.value = searchQuery;
		}

		// Инициализация структуры фильтра в DOM
		function buildSmartFilterMarkup() {
			let html = "";
			for (const [key, group] of Object.entries(filterStructure)) {
				html += `<div class="filter-group" data-prop="${key}">`;
				html += `<div class="filter-group-title">${group.title}</div>`;
				group.options.forEach(val => {
					html += `
						<label class="filter-checkbox-item" data-prop="${key}" data-val="${val}">
							<input type="checkbox" name="${key}" value="${val}">
							<span class="filter-label-text">${val}</span>
							<span class="filter-count-badge" id="badge-${key}-${val.replace(/[^a-zA-Z0-9а-яА-Я]/g, '_')}">0</span>
						</label>
					`;
				});
				html += `</div>`;
			}
			smartFiltersContainer.innerHTML = html;
		}

		// Умный пересчет доступности и взаимных блокировок опций
		function evaluateSmartFilterAvailability() {
			for (const [propName, group] of Object.entries(filterStructure)) {
				group.options.forEach(val => {
					// Проверяем: сколько фильмов совпадет, ЕСЛИ включить эту опцию при уже выбранных остальных категориях
					const count = moviesData.filter(movie => {
						// 1. Проверяем категорию 'mainGenre'
						if (propName === "mainGenre") {
							if (movie.mainGenre !== val) return false;
						} else if (selectedFilters.mainGenre.length > 0) {
							if (!selectedFilters.mainGenre.includes(movie.mainGenre)) return false;
						}

						// 2. Проверяем категорию 'epoch'
						if (propName === "epoch") {
							if (movie.epoch !== val) return false;
						} else if (selectedFilters.epoch.length > 0) {
							if (!selectedFilters.epoch.includes(movie.epoch)) return false;
						}

						// 3. Проверяем категорию 'ratingTier'
						if (propName === "ratingTier") {
							if (movie.ratingTier !== val) return false;
						} else if (selectedFilters.ratingTier.length > 0) {
							if (!selectedFilters.ratingTier.includes(movie.ratingTier)) return false;
						}

						// Поисковая строка
						if (searchQuery) {
							const text = (movie.title + " " + movie.desc).toLowerCase();
							if (!text.includes(searchQuery.toLowerCase().trim())) return false;
						}

						return true;
					}).length;

					// Находим DOM-элемент данного чекбокса
					const labelEl = smartFiltersContainer.querySelector(`.filter-checkbox-item[data-prop="${propName}"][data-val="${val}"]`);
					const badgeEl = labelEl ? labelEl.querySelector(".filter-count-badge") : null;
					const inputEl = labelEl ? labelEl.querySelector("input") : null;

					if (badgeEl) badgeEl.textContent = count;

					// Умная блокировка: если count === 0 и он не выбран пользователем -> блокируем (disabled)
					if (labelEl && inputEl) {
						if (count === 0 && !inputEl.checked) {
							labelEl.classList.add("disabled");
							inputEl.disabled = true;
						} else {
							labelEl.classList.remove("disabled");
							inputEl.disabled = false;
						}
					}
				});
			}
		}

		// Выборка фильмов по текущим активным чекбоксам
		function getFilteredMovies() {
			return moviesData.filter(movie => {
				if (selectedFilters.mainGenre.length > 0 && !selectedFilters.mainGenre.includes(movie.mainGenre)) return false;
				if (selectedFilters.epoch.length > 0 && !selectedFilters.epoch.includes(movie.epoch)) return false;
				if (selectedFilters.ratingTier.length > 0 && !selectedFilters.ratingTier.includes(movie.ratingTier)) return false;

				if (searchQuery) {
					const text = (movie.title + " " + movie.desc).toLowerCase();
					if (!text.includes(searchQuery.toLowerCase().trim())) return false;
				}
				return true;
			}).sort((a, b) => {
				if (currentSort === "rating") return b.rating - a.rating;
				return b.year - a.year;
			});
		}

		function renderMoviesCatalog() {
			const filtered = getFilteredMovies();
			if (activeMatchesInfo) {
				activeMatchesInfo.textContent = `Найдено: ${filtered.length}`;
			}

			const totalPages = Math.ceil(filtered.length / pageSize) || 1;
			if (currentPage > totalPages) currentPage = 1;

			const start = (currentPage - 1) * pageSize;
			const pageMovies = filtered.slice(start, start + pageSize);

			if (pageMovies.length === 0) {
				moviesContainer.innerHTML = `
					<div class="movie-view-card" style="text-align: center; padding: 40px 20px;">
						<h3>По выбранным фильтрам ничего не найдено</h3>
						<p class="not-found-text">Попробуйте сбросить критерии умного фильтра или изменить условия поиска.</p>
						<button type="button" class="button button-primary" id="btn-empty-reset">Сбросить фильтры</button>
					</div>
				`;
				const btnEmptyReset = document.getElementById("btn-empty-reset");
				if (btnEmptyReset) btnEmptyReset.addEventListener("click", resetAllFilters);
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
							<p class="movie-meta">${movie.year} г. • ${movie.genre} • Период: ${movie.epoch}</p>
							<p class="movie-summary">${movie.desc}</p>
							<div class="movie-actions">
								<a href="movie.html?id=${movie.id}" class="button button-detail">Смотреть онлайн</a>
							</div>
						</div>
					</article>
				`).join("");
			}

			renderPagination(totalPages);
			evaluateSmartFilterAvailability();
		}

		function renderPagination(totalPages) {
			const pagination = document.getElementById("pagination");
			if (!pagination) return;
			let html = "";
			for (let i = 1; i <= totalPages; i++) {
				html += `<li class="page-item"><button type="button" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button></li>`;
			}
			pagination.innerHTML = html;

			pagination.querySelectorAll(".page-link").forEach(btn => {
				btn.addEventListener("click", function () {
					currentPage = Number(this.dataset.page);
					renderMoviesCatalog();
					window.scrollTo({ top: 150, behavior: "smooth" });
				});
			});
		}

		function resetAllFilters() {
			selectedFilters = {
				mainGenre: [],
				epoch: [],
				ratingTier: []
			};
			smartFiltersContainer.querySelectorAll("input[type='checkbox']").forEach(ch => {
				ch.checked = false;
				ch.disabled = false;
			});
			smartFiltersContainer.querySelectorAll(".filter-checkbox-item").forEach(item => {
				item.classList.remove("disabled");
			});
			currentPage = 1;
			renderMoviesCatalog();
		}

		// Событие смены чекбоксов Умного фильтра
		smartFiltersContainer.addEventListener("change", function (e) {
			if (e.target.matches("input[type='checkbox']")) {
				const prop = e.target.name;
				const checkedBoxes = Array.from(smartFiltersContainer.querySelectorAll(`input[name="${prop}"]:checked`)).map(i => i.value);
				selectedFilters[prop] = checkedBoxes;
				currentPage = 1;
				renderMoviesCatalog();
			}
		});

		if (resetFiltersBtn) {
			resetFiltersBtn.addEventListener("click", resetAllFilters);
		}

		if (sortDateBtn && sortRatingBtn) {
			sortDateBtn.addEventListener("click", function (e) {
				e.preventDefault();
				sortRatingBtn.classList.remove("active");
				this.classList.add("active");
				currentSort = "date";
				renderMoviesCatalog();
			});

			sortRatingBtn.addEventListener("click", function (e) {
				e.preventDefault();
				sortDateBtn.classList.remove("active");
				this.classList.add("active");
				currentSort = "rating";
				renderMoviesCatalog();
			});
		}

		if (searchInput) {
			searchInput.addEventListener("input", function () {
				searchQuery = this.value.toLowerCase().trim();
				currentPage = 1;
				renderMoviesCatalog();
			});
		}

		if (searchForm) {
			searchForm.addEventListener("submit", function (e) {
				e.preventDefault();
				searchQuery = searchInput.value.toLowerCase().trim();
				currentPage = 1;
				renderMoviesCatalog();
			});
		}

		// Рендер сайдбара популярных
		const topList = document.getElementById("top-movies-list");
		if (topList) {
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

		// Инициализация
		buildSmartFilterMarkup();
		renderMoviesCatalog();
	}

	// =========================================================================
	// 3. СТРАНИЦА ОТДЕЛЬНОГО ФИЛЬМА (movie.html)
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
					<p class="not-found-text">Запрашиваемый фильм отсутствует в базе данных.</p>
					<a href="movies.html" class="button button-primary">Вернуться в каталог</a>
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
							<div class="movie-view-rating">★ Рейтинг: ${movie.rating} / 10 (${movie.ratingTier})</div>
							<div class="movie-view-meta">
								<span>Год выпуска:</span> <strong>${movie.year} (${movie.epoch})</strong><br>
								<span>Жанр:</span> <strong>${movie.genre}</strong>
							</div>
							<p class="movie-view-desc">${movie.desc}</p>
							<div>
								<button type="button" class="button button-primary" onclick="document.getElementById('video-player').scrollIntoView({behavior: 'smooth'})">Смотреть онлайн</button>
								<a href="movies.html" class="button button-detail button-inline">В каталог</a>
							</div>
						</div>
					</div>

					<section class="player-section" id="video-player">
						<h3 class="widget-title">Онлайн плеер Kinobase</h3>
						<div class="player-box">
							<div class="player-icon" onclick="alert('Воспроизведение фильма: ${movie.title}')"></div>
							<p class="player-caption">Нажмите для запуска официального видеоплеера Full HD 1080p</p>
						</div>
					</section>
				</article>
			`;

			const similarList = document.getElementById("similar-movies-list");
			if (similarList) {
				const similar = moviesData
					.filter(m => m.id !== movie.id && m.mainGenre === movie.mainGenre)
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
	// 4. МОДАЛЬНОЕ ОКНО И ФОРМЫ
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