const express = require('express');
const path = require('path');
const { connectDB } = require('./db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false }));

// Ensure DB is connected for serverless function requests (Vercel)
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount Todo Routes
app.use('/', todoRoutes);

// Local development server listener
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });
}

// Export for Vercel Serverless
module.exports = app;
