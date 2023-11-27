const apiUrl = 'https://hacker-news.firebaseio.com/v0/';// Adres API Hacker News
const maxNewsPerPage = 30;// Maksymalna liczba newsów na stronie
let currentPage = 1;// Numer aktualnej strony

async function fetchNews(page) {// Funkcja asynchroniczna do pobierania newsów z danej strony
    const response = await fetch(`${apiUrl}newstories.json`);// Pobranie listy ID najnowszych newsów
    const data = await response.json();    
    const startIndex = (page - 1) * maxNewsPerPage;// Obliczenie zakresu indeksów dla danej strony
    const endIndex = startIndex + maxNewsPerPage;   
    const newsIds = data.slice(startIndex, endIndex);// Wybranie ID newsów dla danej strony    
    const newsPromises = newsIds.map(newsId => fetch(`${apiUrl}item/${newsId}.json`).then(response => response.json()));// Pobranie szczegółowych danych dla każdego ID newsa    
    const newsList = await Promise.all(newsPromises);// Oczekiwanie na zakończenie wszystkich żądań
    return newsList;
}
function displayNews(newsList) {// Funkcja do wyświetlania newsów na stronie
    const newsListContainer = document.getElementById('news-list');
    newsListContainer.innerHTML = '';// Wyczyszczenie aktualnej listy przed dodaniem nowych newsów
    newsList.forEach((news, index) => {
        const newsItem = document.createElement('li');
        newsItem.classList.add('news-item');

        const voteButton = document.createElement('span');// Przycisk do głosowania
        voteButton.classList.add('vote-up');
        voteButton.innerHTML = `<span>${index + 1}</span> ▲`;
        voteButton.addEventListener('click', () => voteUp(index + 1));

        const hideButton = document.createElement('span');// Przycisk do ukrywania newsa
        hideButton.classList.add('hide-button');
        hideButton.innerHTML = 'Hide';
        hideButton.addEventListener('click', () => hideNews(newsItem));

        const newsTitle = document.createElement('div');// Tytuł i link do newsa
        newsTitle.classList.add('news-title');
        const newsLink = document.createElement('a');
        newsLink.classList.add('news-link');
        newsLink.href = news.url;
        newsLink.target = '_blank';
        newsLink.innerHTML = news.title;
        newsTitle.appendChild(voteButton);
        newsTitle.appendChild(newsLink);

        const newsMeta = document.createElement('div');// Meta informacje o newsie (punkty, autor, liczba komentarzy)
        newsMeta.classList.add('news-meta');
        const newsMetaSpan = document.createElement('span');
        newsMetaSpan.innerHTML = `Score: ${news.score} | Author: ${news.by} | Comments: ${news.descendants} | `;
        newsMeta.appendChild(newsMetaSpan);
        newsMeta.appendChild(hideButton);

        newsItem.appendChild(newsTitle); // Dodanie elementów do struktury HTML
        newsItem.appendChild(newsMeta);
        newsListContainer.appendChild(newsItem);
    });
}
async function loadMoreNews() {// Funkcja asynchroniczna do ładowania kolejnych newsów
    currentPage++;
    const moreNews = await fetchNews(currentPage);
    displayNews(moreNews);
}
function voteUp(index) {// Funkcja do obsługi głosowania
    console.log(`Voted up for news ${index}`);
}
function hideNews(newsItem) {// Funkcja do ukrywania newsa (Komentarz wygenerowany przez chatGPT)
    newsItem.hidden = true;
}
async function init() {// Inicjalizacja strony
    const initialNews = await fetchNews(currentPage);
    displayNews(initialNews);

    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', loadMoreNews);
}
init();// Wywołanie inicjalizacji po załadowaniu strony
