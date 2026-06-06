const SUPABASE_URL = "https://eoalaelupbcbhnxsdwlg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYWxhZWx1cGJjYmhueHNkd2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTYwMjgsImV4cCI6MjA5NTg5MjAyOH0.HDRoeiSWe_VuCzZr2T3qWwBZxofEEZ2dOiBBRx_2vdQ";
const API_URL = `${SUPABASE_URL}/rest/v1/article`;

const articlesContainer = document.getElementById("articles");
const form = document.getElementById("articleForm");
const sortSelect = document.getElementById("sort");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "text-sm text-red-600" : "text-sm text-green-600";
}

function createArticleElement(article) {
  const articleElement = document.createElement("article");
  articleElement.className = "bg-white p-6 rounded shadow";

  const title = document.createElement("h2");
  title.className = "text-xl font-bold";
  title.textContent = article.title;

  const subtitle = document.createElement("h3");
  subtitle.className = "text-gray-600";
  subtitle.textContent = article.subtitle;

  const author = document.createElement("address");
  author.className = "text-sm text-gray-500 mt-2 not-italic";
  author.textContent = `Autor: ${article.author}`;

  const date = document.createElement("time");
  date.className = "block text-sm text-gray-500";
  date.dateTime = article.created_at;
  date.textContent = `Data: ${dayjs(article.created_at).format("DD-MM-YYYY")}`;

  const content = document.createElement("p");
  content.className = "mt-4";
  content.textContent = article.content;

  articleElement.append(title, subtitle, author, date, content);

  return articleElement;
}

async function getArticles() {
  try {
    const order = sortSelect.value;

    const response = await fetch(`${API_URL}?select=*&order=${order}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const articles = await response.json();

    articlesContainer.innerHTML = "";

    articles.forEach(function(article) {
      articlesContainer.appendChild(createArticleElement(article));
    });
  } catch (error) {
    articlesContainer.innerHTML = "";
    setMessage("Nie udało się pobrać artykułów. Sprawdź Supabase i konsolę przeglądarki.", true);
    console.error(error);
  }
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const createdAt = document.getElementById("created_at").value;

  const newArticle = {
    title: document.getElementById("title").value,
    subtitle: document.getElementById("subtitle").value,
    author: document.getElementById("author").value,
    content: document.getElementById("content").value
  };

  if (createdAt) {
    newArticle.created_at = createdAt;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Dodawanie...";
    setMessage("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(newArticle)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    form.reset();
    setMessage("Artykuł został dodany.");
    await getArticles();
  } catch (error) {
    setMessage("Nie udało się dodać artykułu. Sprawdź polityki RLS w Supabase i konsolę przeglądarki.", true);
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Dodaj artykuł";
  }
});

sortSelect.addEventListener("change", getArticles);

getArticles();

