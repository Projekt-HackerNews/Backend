const apiUrl = 'https://hacker-news.firebaseio.com/v0/';
const bestStoriesUrl = `${apiUrl}beststories.json`;
const fetchBestStories = async () => {
    const response = await fetch(bestStoriesUrl);
    const bestStoryIds = await response.json();
    const bestStoryPromises = bestStoryIds.slice(0, 30).map(storyId =>
        fetch(`${apiUrl}item/${storyId}.json`).then(response => response.json())
    );
    const bestStories = await Promise.all(bestStoryPromises);
    return bestStories;
};
    const displayBestStories = (bestStories) => {
    const newsListContainer = document.getElementById('news-list');
    newsListContainer.innerHTML = '';

        bestStories.forEach((story, index )=> {
        const voteButton = document.createElement('span');
        voteButton.classList.add('vote-up');
        voteButton.innerHTML = `${index + 1} ▲`;
        voteButton.addEventListener('click', () => {
            voteUp(index + 1);
            highlightVoteButton(voteButton);
        });
        const newsItem = document.createElement('li');
        newsItem.classList.add('news-item');

        const newsTitle = document.createElement('div');
        newsTitle.setAttribute('id', 'news-title');
        newsTitle.innerHTML = `<span>${index + 1}</span>. <a href="${story.url}" target="_blank">${story.title}</a>`;

        const newsMeta = document.createElement('div');
        newsMeta.setAttribute('id', 'news-meta');
        newsMeta.innerHTML = `Score: ${story.score} | Author: ${story.by} | Comments: ${story.descendants}`;

        newsItem.appendChild(newsTitle);
        newsItem.appendChild(newsMeta);
        newsListContainer.appendChild(newsItem);
    });
};
    const init = async () => {
    const bestStories = await fetchBestStories();
    displayBestStories(bestStories);
};
init();