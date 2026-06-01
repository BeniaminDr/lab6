const SUPABASE_URL = "https://eoalaelupbcbhnxsdwlg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWxhZWx1cGJjYmhueHNkd2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTYwMjgsImV4cCI6MjA5NTg5MjAyOH0.HDRoeiSWe_VuCzZr2T3qWwBZxofEEZ2dOiBBRx_2vdQ";

const API_URL = `${SUPABASE_URL}/rest/v1/article`;

const articlesContainer = document.getElementById("articles");
const form = document.getElementById("articleForm");

async function getArticles() {
  const response = await fetch(`${API_URL}?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  const articles = await response.json();

  articlesContainer.innerHTML = "";

  articles.forEach(function(article) {
    const articleElement = document.createElement("article");

    articleElement.className = "bg-white p-6 rounded shadow";

    articleElement.innerHTML = `
      <h2 class="text-xl font-bold">${article.title}</h2>
      <h3 class="text-gray-600">${article.subtitle}</h3>
      <p class="text-sm text-gray-500 mt-2">
        Autor: ${article.author}
      </p>
      <p class="text-sm text-gray-500">
        Data: ${article.created_at}
      </p>
      <p class="mt-4">
        ${article.content}
      </p>
    `;

    articlesContainer.appendChild(articleElement);
  });
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const newArticle = {
    title: document.getElementById("title").value,
    subtitle: document.getElementById("subtitle").value,
    author: document.getElementById("author").value,
    content: document.getElementById("content").value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(newArticle)
  });

  form.reset();
  getArticles();
});

getArticles();