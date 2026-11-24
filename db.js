require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = process.env.DB_NAME || 'todoApp';
let db;

async function connectDB() {
    // If already connected, reuse the existing connection (Crucial for Vercel Serverless)
    if (db) return db;

    try {
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');
        db = client.db(dbName);
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
}

function getCollection(collectionName = 'todos') {
    if (!db) return null;
    return db.collection(collectionName);
}

module.exports = { connectDB, getCollection };
