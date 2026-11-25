import { MongoClient } from 'mongodb';

/**
 * Opens a per-request MongoDB connection so no sockets or SDAM monitors
 * are shared across Cloudflare Workers request contexts (prevents Error 1101).
 */
export async function withDatabase(env, ctx, fn) {
    const uri = (env.MONGODB_URI || '').trim();
    const dbName = (env.DATABASE_NAME || env.DB_NAME || 'todo_database').trim();

    if (!uri) {
        throw new Error('MONGODB_URI is not configured in environment/secrets.');
    }

    const client = new MongoClient(uri, {
        maxPoolSize: 1,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        return await fn(db);
    } finally {
        const closePromise = client.close().catch(() => {});
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(closePromise);
        } else {
            await closePromise;
        }
    }
}
