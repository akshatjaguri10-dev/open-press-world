const API_BASE_URL = "https://cloudflare.akshat-openpress.workers.dev";
/* =====================================
   1. MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
});


/* =====================================
   2. CLOSE MENU AFTER CLICKING A LINK
===================================== */

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (item) {
    item.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


/* =====================================
   3. AUTOMATIC COPYRIGHT YEAR
===================================== */

const currentYear = document.getElementById("currentYear");
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =====================================
   4. LOAD LIVE NEWS FROM THE BACKEND
===================================== */

const API_URL = "/api/articles?limit=30";
const newsGrid = document.getElementById("newsGrid");

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function safeLink(url) {
    return /^https?:\/\//i.test(url) ? url : "#";
}

// Builds ONE card (No hideTime logic anymore)
function createCard(article) {
    const letter = escapeHTML(article.source.charAt(0).toUpperCase());

    return `
        <a class="news-card" href="${escapeHTML(safeLink(article.link))}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeHTML(article.image || 'assets/placeholder.jpg')}" alt="${escapeHTML(article.title)}">
            
            <div class="news-publisher">
                <span class="small-icon">${letter}</span>
                <span>${escapeHTML(article.source)}</span>
                <span>•</span>
                <span>${escapeHTML(article.time)}</span>
            </div>

            <h3>${escapeHTML(article.title)}</h3>
            
            <p class="card-description">
                ${escapeHTML(article.description || "Discover more about this story and the latest updates from the world of news.")}
            </p>

            <p class="card-category">${escapeHTML(article.category)}</p>
        </a>
    `;
}


async function loadSection(section, containerId, limit=4) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Section container not found: ${containerId}`);
        return;
    }

    container.innerHTML = "<p>Loading articles...</p>";

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/news?section=${encodeURIComponent(section)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load articles");
        }

        if (!data.results || data.results.length === 0) {
            container.innerHTML = "<p>No articles available right now.</p>";
            return;
        }

        container.innerHTML = data.results
            .slice(0, limit)
            .map(article => createCard(article))
            .join("");

    } catch (error) {
        console.error(`Error loading ${section}:`, error);
        container.innerHTML = "<p>Could not load articles. Please try again later.</p>";
    }
}

/* =====================================
   5. "SEE ALL" BUTTON LOGIC
===================================== */

// Latest News
document.querySelector("#latest-news .see-all").addEventListener("click", function(e) {
    e.preventDefault(); // Stop the page from jumping
    loadSection("news", "newsGrid", 10); // Reload with 10 cards
});

// Opinion
document.querySelector("#opinion-section .see-all").addEventListener("click", function(e) {
    e.preventDefault();
    loadSection("opinion", "opinionGrid", 10);
});

// Sports
document.querySelector("#sports-section .see-all").addEventListener("click", function(e) {
    e.preventDefault();
    loadSection("sports", "sportsGrid", 10);
});

// Culture
document.querySelector("#culture-section .see-all").addEventListener("click", function(e) {
    e.preventDefault();
    loadSection("culture", "cultureGrid", 10);
});

async function loadArticles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Server error");
        const allArticles = await response.json();

        const sports = allArticles.filter(a => a.category === "Sports");
        const world = allArticles.filter(a => a.category === "World");
        const tech = allArticles.filter(a => a.category === "Technology");

        const homepageMix = [
            ...sports.slice(0, 2),
            ...world.slice(0, 1),
            ...tech.slice(0, 1)
        ];

        newsGrid.innerHTML = homepageMix.map(createCard).join("");

    } catch (error) {
        newsGrid.innerHTML = "<p>Could not load news.</p>";
    }
}

async function loadCategoryNews(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(`/api/articles?category=${category}&limit=4`);
        if (!response.ok) throw new Error("Server error");
        const articles = await response.json();

        // Draws cards normally (with time)
        grid.innerHTML = articles.map(createCard).join("");

    } catch (error) {
        grid.innerHTML = "<p>Could not load news.</p>";
    }
}

/** run this to execute site with rss and xml methods
loadArticles();
loadCategoryNews("Business", "opinionGrid");
loadCategoryNews("Sports", "sportsGrid");
loadCategoryNews("Culture", "cultureGrid");
*/

/* =====================================
   5. SIMPLE SUBSCRIBE MODAL LOGIC
===================================== */
// Mobile subscribe button inside the menu
const mobileBtn = document.getElementById("mobileSubscribeBtn");
if (mobileBtn) {
    mobileBtn.addEventListener("click", function(e) {
        e.preventDefault();
        subscribeBox.style.display = "flex";
        // Also close the mobile menu
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
}
const subscribeBox = document.getElementById("subscribeBox");
const navSubscribeBtn = document.getElementById("subscribeBtn");

if (navSubscribeBtn) {
    navSubscribeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        subscribeBox.style.display = "flex";
    });
}

function closeSub() {
    subscribeBox.style.display = "none";
}

function submitSub() {
    const email = document.getElementById("subEmail").value;
    if (email === "") {
        alert("Please enter an email!");
        return;
    }
    alert("Thanks for subscribing, " + email + "!");
    closeSub();
}

document.addEventListener("DOMContentLoaded", () => {

    // Method 2: NewsData.io through Cloudflare Worker

    loadSection("news", "newsGrid");

    loadSection("opinion", "opinionGrid");

    loadSection("sports", "sportsGrid");

    loadSection("culture", "cultureGrid");

});