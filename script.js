const apiUrl = 'https://hacker-news.firebaseio.com/v0/';     // Adres API Hacker News
const maxNewsPerPage = 30;    // Maksymalna liczba newsów na stronie
let currentPage = 1;    // Numer aktualnej strony

async function fetchNews(page) {    // Funkcja do pobierania newsów z danej strony
    const response = await fetch(`${apiUrl}newstories.json`);    // Pobranie listy ID najnowszych newsów
    const data = await response.json();
    
    const startIndex = (page - 1) * maxNewsPerPage;// Obliczenie zakresu indeksów dla danej strony
    const endIndex = startIndex + maxNewsPerPage;

    const newsIds = data.slice(startIndex, endIndex);    // Wybranie ID newsów dla danej strony

    
    const newsPromises = newsIds.map(newsId => fetch(`${apiUrl}item/${newsId}.json`).then(response => response.json()));   // Pobranie szczegółowych danych dla każdego ID newsa
    const newsList = await Promise.all(newsPromises);

    return newsList;
}


function displayNews(newsList) {   // Funkcja do wyświetlania newsów na stronie
    const newsListContainer = document.getElementById('news-list');
    
    newsListContainer.innerHTML = '';   // Wyczyszczenie aktualnej listy

    // Dodanie każdego newsa do listy
    newsList.forEach(news => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${news.url}" target="_blank">${news.title}</a>`;
        newsListContainer.appendChild(listItem);
    });
}

// Funkcja do ładowania kolejnych newsów
async function loadMoreNews() {
    currentPage++;    // Zwiększenie numeru strony
    const moreNews = await fetchNews(currentPage);    // Pobranie kolejnych newsów
    displayNews(moreNews);    // Wyświetlenie nowych newsów
}

// Inicjalizacja strony
async function init() {
    const initialNews = await fetchNews(currentPage);   // Pobranie i wyświetlenie początkowych newsów
    displayNews(initialNews);

    // Dodanie obsługi kliknięcia przycisku "Load More"
    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', loadMoreNews);
}

// Wywołanie inicjalizacji po załadowaniu strony
init();
