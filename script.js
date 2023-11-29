const apiUrl = 'https://hacker-news.firebaseio.com/v0/';// Adres API Hacker News
const maxNewsPerPage = 30;// Maksymalna liczba newsów na stronie
let currentPage = 1;// Numer aktualnej strony
let isVoteButtonGreen = false;// Zmienna do śledzenia stanu przycisku


const fetchNews = async (page) => {// Funkcja asynchroniczna do pobierania newsów z danej strony
 
    const response = await fetch(`${apiUrl}newstories.json`);   // Pobranie listy ID najnowszych newsów
    const data = await response.json();
    const startIndex = (page - 1) * maxNewsPerPage;   // Obliczenie zakresu indeksów dla danej strony
    const endIndex = startIndex + maxNewsPerPage;
    const newsIds = data.slice(startIndex, endIndex);// Wybranie ID newsów dla danej strony
    const newsPromises = newsIds.map(newsId => fetch(`${apiUrl}item/${newsId}.json`).then(response => response.json()));// Pobranie szczegółowych danych dla każdego ID newsa
    const newsList = await Promise.all(newsPromises);
    return newsList;
};


const displayNews = (newsList) => {// Funkcja do wyświetlania newsów na stronie
    const newsListContainer = document.getElementById('news-list');
    newsListContainer.innerHTML = '';// Wyczyszczenie aktualnej listy przed dodaniem nowych newsów
    
    newsList.forEach((news, index) => {
        const newsItem = document.createElement('li');
        newsItem.classList.add('news-item');
        const voteButton = document.createElement('span');
        voteButton.classList.add('vote-up');
        
        voteButton.style.color = isVoteButtonGreen ? 'green' : 'black';// Ustawienie koloru trójkąta na zielony lub czarny w zależności od stanu
        voteButton.innerHTML = ` ▲`;

        // Obsługa głosowania i zmiana koloru trójkąta po naciśnięciu
        voteButton.addEventListener('click', () => {
            voteUp(index + 1);
            isVoteButtonGreen = !isVoteButtonGreen;// Zmiana stanu przycisku po naciśnięciu
            voteButton.style.color = isVoteButtonGreen ? 'green' : 'black';// Aktualizacja koloru trójkąta
        });

        const hideButton = document.createElement('span');
        hideButton.classList.add('hide-button');
        hideButton.innerHTML = 'Hide';
        hideButton.addEventListener('click', () => hideNews(newsItem));// Ukrywanie newsa po naciśnięciu przycisku "Hide"

        const newsTitle = document.createElement('div');
        newsTitle.classList.add('news-title');
        const newsLink = document.createElement('a');
        newsLink.classList.add('news-link');
        newsLink.href = news.url;
        newsLink.target = '_blank';
        newsLink.innerHTML = `<span>${index + 1} </span>` + news.title;
        newsTitle.appendChild(voteButton);
        newsTitle.appendChild(newsLink);

        const newsMeta = document.createElement('div');
        newsMeta.classList.add('news-meta');
        const newsMetaSpan = document.createElement('span');
        newsMetaSpan.innerHTML = `Score: ${news.score} | Author: ${news.by} | Comments: ${news.descendants} | `;
        newsMeta.appendChild(newsMetaSpan);
        newsMeta.appendChild(hideButton);

        newsItem.appendChild(newsTitle);
        newsItem.appendChild(newsMeta);
        newsListContainer.appendChild(newsItem);
    });
};

// Funkcja asynchroniczna do ładowania kolejnych newsów
const loadMoreNews = async () => {
    currentPage++;
    const moreNews = await fetchNews(currentPage);
    displayNews(moreNews);
};

// Funkcja do obsługi głosowania
const voteUp = (index) => {
    console.log(`Voted up for news ${index}`);
};

// Funkcja do ukrywania newsa
const hideNews = (newsItem) => {
    newsItem.hidden = true;
};

// Inicjalizacja strony
const init = async () => {
    const initialNews = await fetchNews(currentPage);
    displayNews(initialNews);

    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', loadMoreNews);
};

// Wywołanie inicjalizacji po załadowaniu strony
init();
