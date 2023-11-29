const apiUrl = 'https://hacker-news.firebaseio.com/v0/';
const maxNewsPerPage = 30;
let currentPage = 1;

    const fetchNews = async (page) => {
        const response = await fetch(`${apiUrl}newstories.json`);
        const data = await response.json();
        const startIndex = (page - 1) * maxNewsPerPage;
        const endIndex = startIndex + maxNewsPerPage;
        const newsIds = data.slice(startIndex, endIndex);
        const newsPromises = newsIds.map(newsId =>
            fetch(`${apiUrl}item/${newsId}.json`).then(response => response.json())
        );
        const newsList = await Promise.all(newsPromises);
        return newsList;
    };
    const displayNews = (newsList) => {
        const newsListContainer = document.getElementById('news-list');
        newsListContainer.innerHTML = '';

        newsList.forEach((news, index) => {
            const newsItem = document.createElement('li');
            newsItem.classList.add('news-item');

            const voteButton = document.createElement('span');
            voteButton.classList.add('vote-up');
            voteButton.innerHTML = `${index + 1} ▲`;
            voteButton.addEventListener('click', () => {
                voteUp(index + 1);
                highlightVoteButton(voteButton);
            });

            const hideButton = document.createElement('span');
            hideButton.classList.add('hide-button');
            hideButton.innerHTML = 'Hide';
            hideButton.addEventListener('click', () => hideNews(newsItem));

            const newsTitle = document.createElement('div');
            newsTitle.classList.add('news-title');

            const newsLink = document.createElement('a');
            newsLink.classList.add('news-link');
            newsLink.href = news.url;
            newsLink.target = '_blank';
            newsLink.innerHTML = news.title;
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
    const loadMoreNews = async () => {
        currentPage++;
        const moreNews = await fetchNews(currentPage);
        displayNews(moreNews);
    };
    const voteUp = (index) => {
        console.log(`Voted up for news ${index}`);
    };
    const hideNews = (newsItem) => {
        newsItem.hidden = true;
    };
    const init = async () => {
        const initialNews = await fetchNews(currentPage);
        displayNews(initialNews);

        const loadMoreButton = document.getElementById('load-more');
        loadMoreButton.addEventListener('click', loadMoreNews);
    };
const highlightVoteButton = (voteButton) => {
    if(document.getElementsByClassName("vote-up").style.color == 'black') {
        document.getElementsByClassName("vote-up").style.color = 'green';
    } 
    else if(document.getElementsByClassName("vote-up").style.color == 'green') {
        document.getElementsByClassName("vote-up").style.color = 'black';
    }
};
init();
