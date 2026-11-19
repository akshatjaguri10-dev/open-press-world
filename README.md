# Open Press | Stories That Matter

Open Press is a news website designed to bring news from different categories together in one place. It provides a clean and responsive interface where users can explore the latest news, read articles from different publishers, and browse topics such as sports, opinion, and culture.

The project explores two different approaches to retrieving and delivering news:

1. **Python + Flask + RSS Feeds** — Fetching and processing news through RSS feeds.
2. **Cloudflare Workers + NewsData.io API** — Retrieving news through an external news API using a Cloudflare Worker as a backend proxy.

Both approaches are preserved in the project to demonstrate different backend integration methods. The Cloudflare API approach is currently used to load news on the website.

---

## 1. Features

- Clean and responsive news website interface.
- Latest news section.
- Separate sections for opinion, sports, and culture.
- News cards containing article titles, descriptions, publishers, images, and timestamps.
- Direct links to original news articles.
- Mobile navigation menu.
- Newsletter subscription interface.
- Dynamic copyright year.
- API-based news retrieval.
- Backend API integration through Cloudflare Workers.
- Rate limiting and API key protection.
- Alternative RSS-based news retrieval using Python and Flask.

---

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, layout, and responsive design |
| JavaScript | Frontend functionality and API requests |
| Python | Original RSS-based backend |
| Flask | Python backend framework |
| RSS Feeds | Original news data source |
| Cloudflare Workers | Serverless API backend |
| NewsData.io | External news data provider |
| Wrangler | Local development and deployment of Cloudflare Workers |
| Git & GitHub | Version control and project hosting |

---

## 3. Project Structure

The project is organized into separate frontend and backend components.

```text
Open_Press/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── cloudflare/
│   ├── src/
│   │   └── index.js
│   ├── .dev.vars
│   ├── wrangler.toml
│   └── package.json
│
├── [Original Python/Flask backend]
│
└── .gitignore
```

*Note: The Python backend folder and its filenames should be updated here to match their actual names in your project.*

### Frontend

- **index.html:** Contains the website structure, navigation, news sections, and subscription interface.
- **style.css:** Handles the visual design, layouts, colors, typography, and responsive styling.
- **script.js:** Controls frontend interactions, generates news cards, and communicates with the backend.

### Cloudflare Backend

- **src/index.js:** Contains the Cloudflare Worker logic, API requests, section handling, and response processing.
- **.dev.vars:** Stores local development secrets, including the NewsData.io API key.
- **wrangler.toml:** Contains Cloudflare Worker configuration and bindings.
- **package.json:** Contains project metadata and development scripts.

---

## 4. Two Backend Methods

### Method 1 — Python + Flask + RSS Feeds

The first implementation uses Python and Flask to retrieve news from RSS feeds.

**How it works:**

1. Python retrieves news from configured RSS feeds.
2. The RSS data is parsed into usable article information.
3. Article information is organized into categories.
4. Flask provides API endpoints that return the processed articles as JSON.
5. JavaScript requests the articles from Flask.
6. The frontend generates news cards and displays them.

**Technology flow:**

```text
RSS Feeds
    ↓
Python RSS Processing
    ↓
Flask Backend
    ↓
JSON Response
    ↓
JavaScript
    ↓
News Cards
```

**Frontend functions used for this method:**

#### `loadArticles()`

- Requests the general article collection from the Flask backend.
- Receives the articles in JSON format.
- Filters articles into categories such as Sports, World, and Technology.
- Creates a homepage news mix.
- Displays the selected articles inside the main news grid.

#### `loadCategoryNews(category, gridId)`

- Accepts a news category and the target HTML container ID.
- Requests articles belonging to the selected category.
- Processes the JSON response.
- Displays the articles in the appropriate section.

**Purpose of preserving Method 1:**

This implementation demonstrates how news can be collected directly from RSS feeds, processed using Python, and served through a Flask application without relying on a dedicated news API provider.

The function definitions are retained in the JavaScript project, but their automatic calls are currently disabled so they do not interfere with the active API implementation.

---

### Method 2 — Cloudflare Workers + NewsData.io API

The second implementation uses NewsData.io to retrieve news articles and Cloudflare Workers to handle API requests.

Instead of making requests directly to the news provider from the browser, the frontend communicates with a Cloudflare Worker.

**How it works:**

1. The frontend sends a request to the Cloudflare Worker.
2. The Worker receives the requested news section.
3. The Worker retrieves the NewsData.io API key from its environment variables.
4. It sends a request to the NewsData.io API.
5. The API returns news data.
6. The Worker processes and normalizes the response.
7. The Worker sends the resulting JSON data to the frontend.
8. JavaScript generates and displays the news cards.

**Technology flow:**

```text
Frontend (JavaScript)
        ↓
Cloudflare Worker
        ↓
NewsData.io API
        ↓
News Articles
        ↓
Cloudflare Worker
        ↓
JSON Response
        ↓
Frontend News Cards
```

#### Why Cloudflare Workers?

Cloudflare Workers act as a serverless backend between the frontend and the external news API.

They help with:

- Keeping the external API key out of frontend JavaScript.
- Handling API requests.
- Processing and formatting API responses.
- Applying rate limiting.
- Supporting caching where configured.
- Allowing the frontend to communicate with a dedicated backend endpoint.

#### API endpoint

The frontend uses the following endpoint pattern:

```text
/api/news?section=news
/api/news?section=opinion
/api/news?section=sports
/api/news?section=culture
```

The `section` parameter determines which type of news the Worker should request.

#### Frontend function: `loadSection(section, containerId)`

This function is responsible for loading news through the Cloudflare API method.

**Its responsibilities:**

1. Accepts a section name and an HTML container ID.
2. Sends a request to the Cloudflare Worker.
3. Receives the JSON response.
4. Checks whether the request was successful.
5. Extracts the returned article results.
6. Uses `createCard()` to generate the news cards.
7. Displays the cards inside the selected section.

The function is called for all four news sections:

```javascript
document.addEventListener("DOMContentLoaded", () => {
    loadSection("news", "newsGrid");
    loadSection("opinion", "opinionGrid");
    loadSection("sports", "sportsGrid");
    loadSection("culture", "cultureGrid");
});
```

These calls use the actual HTML container IDs defined in `index.html`.

---

## 5. JavaScript Functions Explained

The following functions handle the main frontend operations.

### `escapeHTML(text)`

Converts text into HTML-safe content before it is inserted into generated HTML.

This helps prevent untrusted article content from being interpreted as HTML.

### `safeLink(url)`

Checks whether an article link uses HTTP or HTTPS.

If the URL does not use either protocol, it returns `#` instead of using the invalid link.

### `createCard(article)`

Generates the HTML structure for an individual news card.

It uses article information such as:

- Article title.
- Publisher/source.
- Publication time.
- Article image.
- Description.
- Category.
- Original article link.

Both backend methods use this shared function to display articles in a consistent design.

### `loadSection(section, containerId)`

Loads articles from the Cloudflare Worker API and displays them in the requested frontend section.

### `loadArticles()`

Loads and organizes articles from the original Flask backend.

### `loadCategoryNews(category, gridId)`

Loads category-specific articles from the original Flask backend.

### `submitSub()`

Handles the newsletter subscription form interaction.

### `closeSub()`

Closes the newsletter subscription interface.

### Mobile navigation event listeners

Handle opening and closing the mobile navigation menu and updating its accessibility state.

### Copyright year

JavaScript updates the displayed copyright year automatically, avoiding the need to change it manually.

---

## 6. API Security and Request Handling

The Cloudflare implementation includes additional backend controls.

### API Key Protection

The NewsData.io API key is stored as an environment variable rather than being written into frontend JavaScript.

For local development, the key is stored in:

```text
cloudflare/.dev.vars
```

For production deployment, Cloudflare secrets are used.

### Rate Limiting

A Cloudflare rate limiter is configured to restrict excessive requests.

The current local configuration displays a limit of 30 requests per 60 seconds.

### CORS

Cross-Origin Resource Sharing (CORS) is configured to control which frontend origins are allowed to communicate with the Worker.

### Caching

Caching is used where configured to reduce repeated requests and improve response efficiency.

---

## 7. Running the Project Locally

### Requirements

- Python 3
- Node.js and npm
- Cloudflare Wrangler
- NewsData.io API key
- Git

### Step 1 — Start Cloudflare Worker

Open a terminal and navigate to the Cloudflare folder:

```bash
cd cloudflare
```

Install dependencies if they have not already been installed:

```bash
npm install
```

Start the local Worker:

```bash
npm run dev
```

The local Worker should be available at:

```text
http://localhost:8787
```

### Step 2 — Start the Frontend

Open another terminal window:

```bash
cd frontend
```

Start the local frontend server:

```bash
python3 -m http.server 5500
```

### Step 3 — Open the Website

Open the following address in your browser:

```text
http://localhost:5500
```

Both terminal processes must remain running while testing locally.

### Step 4 — Test the API

Open:

```text
http://localhost:8787/api/news?section=news
```

The Worker should return a JSON response containing the news results or an error response that can be used for debugging.

---

## 8. Environment Variables

Create a local `.dev.vars` file inside the Cloudflare folder:

```env
NEWSDATA_API_KEY=your_api_key_here
```

Replace the placeholder with your own NewsData.io API key.

**Important:** Never commit `.dev.vars`, API keys, or other secret credentials to GitHub.

For production, configure the secret through Wrangler:

```bash
npx wrangler secret put NEWSDATA_API_KEY
```

---

## 9. Deployment

The Cloudflare Worker can be deployed using:

```bash
npx wrangler deploy
```

After deployment, update the frontend's `API_BASE_URL` in `script.js` to use the deployed Worker URL instead of the local development URL.

The frontend can then be hosted separately using a static hosting provider.

---

## 10. Current Project Implementation

| Component | Current status |
|---|---|
| HTML frontend | Implemented |
| CSS styling | Implemented |
| JavaScript functionality | Implemented |
| Python + Flask RSS method | Preserved |
| Cloudflare Worker method | Active implementation |
| NewsData.io integration | Implemented |
| API key environment variable | Configured |
| Rate limiting | Configured |
| CORS | Configured |
| Local development | Configured |

---

## 11. Learning Outcomes

Through this project, I explored and practiced:

- Building a frontend using HTML, CSS, and JavaScript.
- Working with asynchronous JavaScript and `fetch()`.
- Understanding JSON data and API responses.
- Retrieving and processing RSS feed data using Python.
- Building backend endpoints with Flask.
- Integrating a third-party news API.
- Using Cloudflare Workers as a serverless backend.
- Managing API keys through environment variables.
- Understanding CORS, rate limiting, and caching.
- Organizing frontend and backend code.
- Using Git and GitHub for version control.

---

## 12. Future Improvements

- Add search functionality for news articles.
- Add more news categories and publishers.
- Improve article filtering and sorting.
- Add pagination or infinite scrolling.
- Improve error handling and loading states.
- Implement a functional newsletter subscription backend.
- Add more caching and API usage optimizations.
- Deploy the complete website publicly.

---

**Open Press — Stories That Matter**

A news website project exploring two different approaches to backend news integration: Python and RSS feeds, and Cloudflare Workers with a third-party news API.
