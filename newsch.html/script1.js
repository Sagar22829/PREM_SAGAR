const API_KEY = "93ba388a36b3432194e2480042a3697e";
const BASE_URL = "https://newsapi.org/v2/everything";

window.addEventListener("load", () => fetchNEWS("India"));

function reload() {
  window.location.reload();
}

async function fetchNEWS(query) {
  try {
    const url = `${BASE_URL}?q=${query}&apiKey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      alert("No news found.");
      return;
    }
    bindData(data.articles);
  } catch (error) {
    console.error("Fetch Error:", error);
    alert("Something went wrong while fetching the news.");
  }
}

function bindData(articles) {
  const cardContainer = document.getElementById("card-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardContainer.innerHTML = ""; // Clear previous content

  articles.forEach((article) => {
    if (!article.urlToImage || !article.title || !article.description) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let currentSelectedNav = null;

function onNavItemClick(id) {
  fetchNEWS(id);
  const navItem = document.getElementById(id);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = navItem;
  currentSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNEWS(query);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = null;
});
