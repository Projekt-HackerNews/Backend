//dane z api
const apiUrl = 'https://hacker-news.firebaseio.com/v0/';
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const allNews = data; 
    const olderNews = allNews.filter(news => isBeforeToday(new Date(news.publishDate)));

    //założenie że to tablica
    const newsList = document.getElementById('news-list');
    //wypisnie wyniku
    olderNews.forEach(news => {
      const listItem = document.createElement('li');
      listItem.textContent = news.title; 
      newsList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error:', error));

//sprawdzenie czy data jest starsza niż dzisiejsza
const isBeforeToday = (date) => {
  const today = new Date();
  return date < today;
};
//głodny jestem 
//co polecacie na studiach na szybko do jedznia 