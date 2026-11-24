# 📝 Todo List App (Node.js + Express + EJS + MongoDB Atlas)

A full-stack Todo List web application built with **Node.js**, **Express**, **EJS**, and **MongoDB Atlas**. It provides complete CRUD (Create, Read, Update, Delete) functionality with task titles, descriptions, and automatic creation timestamps.

---

## 🚀 Features

- **Full CRUD Support**:
  - **Create**: Add new tasks with title and optional detailed description.
  - **Read**: View all tasks sorted by newest first, complete with formatted time stamps.
  - **Update**: Edit existing tasks with an intuitive update interface.
  - **Delete**: Remove tasks with single-click confirmation.
- **MongoDB Atlas Cloud Database**: Real-time cloud storage with seamless M0 cluster integration.
- **Modular Architecture**: Separated concerns using `routes/`, `views/`, and `public/`.
- **EJS Templating**: Server-rendered dynamic pages with reusable components (`navbar.ejs`).
- **Clean UI / UX**: Modern, responsive styling with clean cards, badges, and smooth hover effects.
- **Security & Secret Management**: Environment variables managed via `dotenv` and protected with `.gitignore`.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Native MongoDB Driver)
- **View Engine**: [EJS (Embedded JavaScript)](https://ejs.co/)
- **Styling**: Pure CSS3
- **Dev Tools**: [Nodemon](https://nodemon.io/), [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 📂 Project Structure

```text
todo-list/
├── index.js          # Application entry point & server setup
├── db.js             # MongoDB Atlas connection handler
├── .env              # Environment secrets (ignored by Git)
├── .env.example      # Example environment variables template
├── .gitignore        # Files excluded from version control
├── package.json      # Dependencies and execution scripts
├── public/           # Static assets
│   └── style.css     # Global application stylesheet
├── routes/           # Express route modules
│   └── todoRoutes.js # Handles all CRUD routes (/add, /update, /delete)
└── views/            # EJS template views
    ├── navbar.ejs    # Reusable navigation bar partial
    ├── list.ejs      # Homepage displaying all tasks
    ├── add.ejs       # Form to add a new task
    └── update.ejs    # Form to edit and update a task
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account (or a local MongoDB instance)

### 2. Clone the Repository
```bash
git clone https://github.com/Sujalkathait/todo-list-using-mongodb.git
cd todo-list-using-mongodb
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create your `.env` file:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoApp?retryWrites=true&w=majority
DB_NAME=todoApp
```

### 5. Run the Application

**Development Mode (Auto-restart on save):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Visit **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🌐 Routes & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Displays all tasks in the database |
| `GET` | `/add` | Renders the "Add Task" page |
| `POST` | `/add` | Creates a new task in MongoDB |
| `GET` | `/update` | Displays all tasks available for editing |
| `GET` | `/update/:id` | Renders the edit form for a specific task |
| `POST` | `/update` | Saves task changes using ID in form body |
| `POST` | `/update/:id` | Saves task changes using ID in URL parameter |
| `GET` | `/delete/:id` | Deletes a task by its unique ID |

---

## ☁️ Deployment (e.g. Render.com)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy commit"
   git push origin main
   ```
2. Log in to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following build and start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. In **Environment Variables**, add:
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `DB_NAME`: `todoApp`
6. Click **Deploy Web Service**.

---

## 👤 Author

- **Sujal Kathait**
- GitHub: [@Sujalkathait](https://github.com/Sujalkathait)

## 📄 License

This project is licensed under the [ISC License](LICENSE).
