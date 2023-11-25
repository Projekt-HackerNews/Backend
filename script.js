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
    
    newsList.forEach(news => {// Dodanie każdego newsa do listy
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${news.url}" target="_blank">${news.title}</a>`;
        newsListContainer.appendChild(listItem);
    });
}
async function loadMoreNews() {// Funkcja do ładowania kolejnych newsów
    currentPage++;    // Zwiększenie numeru strony
    const moreNews = await fetchNews(currentPage);    // Pobranie kolejnych newsów
    displayNews(moreNews);    // Wyświetlenie nowych newsów
}
async function init() {// Inicjalizacja strony
    const initialNews = await fetchNews(currentPage);// Pobranie i wyświetlenie początkowych newsów
    displayNews(initialNews);

    const loadMoreButton = document.getElementById('load-more');// Dodanie obsługi kliknięcia przycisku "Load More"
    loadMoreButton.addEventListener('click', loadMoreNews);
}
function displayNews(newsList) {   // Funkcja do wyświetlania newsów na stronie
    const newsListContainer = document.getElementById('news-list');
    newsListContainer.innerHTML = '';   // Wyczyszczenie aktualnej listy
    
    newsList.forEach((news, index) => {// Dodanie każdego newsa do listy
        const newsItem = document.createElement('div');
        newsItem.innerHTML = `<span>${index + 1}</span>. <a href="${news.url}" target="_blank">${news.title}</a>`;
        newsListContainer.appendChild(newsItem);
    });
}
init();// Wywołanie inicjalizacji po załadowaniu strony
