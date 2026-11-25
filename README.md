# Dozy — Todo List App (MongoDB Atlas + EJS + Cloudflare Workers & Vercel)

A full-stack Todo List web application built with **Node.js**, **EJS**, and **MongoDB Atlas**, configured for serverless deployment on **Cloudflare Workers** (with Workers Static Assets) and **Vercel**.

**Live Demo:** [https://dozylist.sujalkathait.workers.dev/](https://dozylist.sujalkathait.workers.dev/)
  live demo:https://dozylist.vercel.app

---

## Features

- **Full CRUD Support**:
  - **Create**: Add tasks with a title and optional notes/description.
  - **Read**: View tasks sorted newest-first with timestamps and open/done counts.
  - **Toggle Complete**: Mark tasks done or open with a single click (`/toggle/:id`).
  - **Update**: Edit existing task titles and notes.
  - **Delete**: Remove tasks with confirmation.
- **Cloudflare Workers Ready**: Precompiled EJS templates (`scripts/build-views.js`), per-request `MongoClient` handling (`src/db.js`), and edge static asset delivery (`public/style.css`).
- **Vercel Ready**: Express 5 server (`index.js` + `routes/todoRoutes.js`) configured with `vercel.json`.
- **Clean UI / UX**: Monochrome neutral palette, inline SVG icons, accessible focus states, and mobile-friendly layout.
- **Secret Management**: Local `.env` / `.dev.vars` excluded via `.gitignore`.

---

## Tech Stack

- **Runtime / Edge**: [Cloudflare Workers](https://workers.cloudflare.com/) (`wrangler`) & [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (Node/Vercel) & Native Fetch Worker (`src/worker.js`)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (`mongodb` v7)
- **Templating**: [EJS](https://ejs.co/)
- **Styling**: Pure CSS3 (`public/style.css`)

---

## Project Structure

```text
todo-list/
├── src/
│   ├── worker.js         # Cloudflare Workers entry point (fetch handler)
│   ├── db.js             # Per-request MongoDB Atlas helper for Workers
│   └── compiledViews.js  # Auto-generated precompiled EJS templates
├── scripts/
│   └── build-views.js    # Compiles views/*.ejs into src/compiledViews.js
├── routes/
│   └── todoRoutes.js     # Express CRUD routes (Node.js / Vercel)
├── views/
│   ├── navbar.ejs        # Navigation bar partial
│   ├── list.ejs          # Task list view
│   ├── add.ejs           # New task form
│   └── update.ejs        # Edit task form
├── public/
│   └── style.css         # Global stylesheet
├── index.js              # Express entry point (Node.js / Vercel)
├── db.js                 # Express MongoDB helper (Node.js / Vercel)
├── wrangler.jsonc        # Cloudflare Workers + Static Assets config
├── vercel.json           # Vercel serverless config
├── .dev.vars.example     # Cloudflare local env template
├── .env.example          # Node.js local env template
├── .gitignore            # Excludes secrets, node_modules, .wrangler, dist
└── package.json          # Scripts & dependencies
```

---

## Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 2. Clone & Install
```bash
git clone https://github.com/Sujalkathait/todo-list-using-mongodb.git
cd todo-list-using-mongodb
npm install
```

### 3. Run Locally with Cloudflare Wrangler
Copy `.dev.vars.example` to `.dev.vars` and add your MongoDB Atlas URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo_database?retryWrites=true&w=majority
DATABASE_NAME=todo_database
NODE_ENV=development
```
Start the local Worker:
```bash
npm run cf:dev
```
Open **[http://127.0.0.1:8787](http://127.0.0.1:8787)**.

### 4. Run Locally with Express (Node.js)
Copy `.env.example` to `.env` and add your MongoDB Atlas URI:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todoApp?retryWrites=true&w=majority
DB_NAME=todoApp
```
Start the Express server:
```bash
npm run dev
```
Open **[http://localhost:8000](http://localhost:8000)**.

---

## Routes & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Lists all tasks from MongoDB |
| `GET` | `/add` | Renders the new task form |
| `POST` | `/add` | Creates a new task |
| `GET` | `/toggle/:id` | Toggles task completion status |
| `GET` | `/update/:id` | Renders the edit form for a task |
| `POST` | `/update/:id` | Updates a task by ID |
| `GET` | `/delete/:id` | Deletes a task by ID |

---

## Deployment

### Option 1: Deploy to Cloudflare Workers

1. **Authenticate Wrangler**:
   ```bash
   npx wrangler login
   ```
2. **Set your MongoDB secret in Cloudflare**:
   ```bash
   npx wrangler secret put MONGODB_URI
   ```
   *(Paste your `mongodb+srv://...` connection string when prompted.)*
3. **Build views & deploy**:
   ```bash
   npm run cf:deploy
   ```
4. **Optional — Connect a custom domain**:
   ```bash
   npx wrangler domains add todo.yourdomain.com
   ```

---

### Option 2: Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import `todo-list-using-mongodb`.
3. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `DB_NAME`: `todoApp`
4. Click **Deploy** (Vercel uses `vercel.json` to route requests to `index.js`).

---

## Author

- **Sujal Kathait** — [@Sujalkathait](https://github.com/Sujalkathait)

## License

ISC License
