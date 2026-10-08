document.addEventListener("DOMContentLoaded", function () {
	// ==========================================
	// 1. Модальное окно "Вход"
	// ==========================================
	const loginBtn = document.getElementById("open-login-btn");
	const loginModal = document.getElementById("login-modal");
	const closeModalBtn = document.getElementById("close-modal-btn");
	const loginForm = document.getElementById("login-form");

	if (loginBtn && loginModal) {
		loginBtn.addEventListener("click", function () {
			loginModal.classList.remove("hidden");
		});

		closeModalBtn.addEventListener("click", function () {
			loginModal.classList.add("hidden");
		});

		loginModal.addEventListener("click", function (event) {
			if (event.target === loginModal) {
				loginModal.classList.add("hidden");
			}
		});

		loginForm.addEventListener("submit", function (e) {
			e.preventDefault();
			const email = document.getElementById("login-email").value;
			alert(`Успешный вход: ${email}`);
			loginModal.classList.add("hidden");
			loginBtn.textContent = email.split("@")[0];
		});
	}

	// ==========================================
	// 2. Переключение верхних вкладок (Меню)
	// ==========================================
	const navLinks = document.querySelectorAll("#nav-tabs .nav-link");
	const catalogTitle = document.getElementById("catalog-title");

	navLinks.forEach(function (link) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			document.querySelectorAll("#nav-tabs .nav-item").forEach(item => item.classList.remove("active"));
			this.parentElement.classList.add("active");

			// Динамически меняем заголовок секции под выбранную вкладку
			if (catalogTitle) {
				catalogTitle.textContent = this.textContent;
			}
		});
	});

	// ==========================================
	// 3. Сортировка фильмов (По дате / По рейтингу)
	// ==========================================
	const sortDateBtn = document.getElementById("sort-date");
	const sortRatingBtn = document.getElementById("sort-rating");
	const moviesContainer = document.getElementById("movies-container");

	function sortCards(type) {
		const cards = Array.from(moviesContainer.querySelectorAll(".movie-card"));
		cards.sort(function (a, b) {
			if (type === "date") {
				return Number(b.dataset.year) - Number(a.dataset.year);
			} else {
				return Number(b.dataset.rating) - Number(a.dataset.rating);
			}
		});

		cards.forEach(card => moviesContainer.appendChild(card));
	}

	if (sortDateBtn && sortRatingBtn) {
		sortDateBtn.addEventListener("click", function (e) {
			e.preventDefault();
			sortRatingBtn.classList.remove("active");
			this.classList.add("active");
			sortCards("date");
		});

		sortRatingBtn.addEventListener("click", function (e) {
			e.preventDefault();
			sortDateBtn.classList.remove("active");
			this.classList.add("active");
			sortCards("rating");
		});
	}

	// ==========================================
	// 4. Фильтрация по жанрам в сайдбаре
	// ==========================================
	const genreLinks = document.querySelectorAll("#genre-filter .genre-link");
	const movieCards = document.querySelectorAll(".movie-card");

	genreLinks.forEach(function (link) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			genreLinks.forEach(l => l.classList.remove("active"));
			this.classList.add("active");

			const chosenGenre = this.dataset.genre;

			movieCards.forEach(function (card) {
				if (chosenGenre === "all" || card.dataset.genres.includes(chosenGenre)) {
					card.style.display = "flex";
				} else {
					card.style.display = "none";
				}
			});
		});
	});

	// ==========================================
	// 5. Живой поиск фильмов
	// ==========================================
	const searchInput = document.getElementById("search-input");
	const searchForm = document.getElementById("search-form");

	function filterMoviesBySearch() {
		const query = searchInput.value.toLowerCase().trim();

		movieCards.forEach(function (card) {
			const title = card.querySelector(".movie-name").textContent.toLowerCase();
			const desc = card.querySelector(".movie-summary").textContent.toLowerCase();

			if (title.includes(query) || desc.includes(query)) {
				card.style.display = "flex";
			} else {
				card.style.display = "none";
			}
		});
	}

	if (searchInput) {
		searchInput.addEventListener("input", filterMoviesBySearch);
	}

	if (searchForm) {
		searchForm.addEventListener("submit", function (e) {
			e.preventDefault();
			filterMoviesBySearch();
		});
	}

	// ==========================================
	// 6. Клик по пагинации
	// ==========================================
	const pageLinks = document.querySelectorAll("#pagination .page-link");
	pageLinks.forEach(function (link) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			pageLinks.forEach(l => l.classList.remove("active"));
			this.classList.add("active");
		});
	});
});