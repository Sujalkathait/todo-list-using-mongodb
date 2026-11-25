import { ObjectId } from 'mongodb';
import { withDatabase } from './db.js';
import { views } from './compiledViews.js';

function renderView(name, data = {}) {
    const renderer = views[name];
    if (!renderer) {
        return new Response(`View not found: ${name}`, { status: 500 });
    }
    const html = renderer(data);
    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
        },
    });
}

function redirectHome(request) {
    return Response.redirect(new URL('/', request.url).toString(), 303);
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const { pathname } = url;
        const method = request.method.toUpperCase();

        try {
            // 1. Home page - List all tasks
            if (method === 'GET' && pathname === '/') {
                let tasks = [];
                try {
                    tasks = await withDatabase(env, ctx, async (db) => {
                        return db.collection('todos').find().sort({ createdAt: -1 }).toArray();
                    });
                } catch (err) {
                    console.error('Error fetching tasks:', err.message);
                }
                return renderView('list', { tasks });
            }

            // 2. Add task page
            if (method === 'GET' && pathname === '/add') {
                return renderView('add');
            }

            // 3. Create a new task
            if (method === 'POST' && pathname === '/add') {
                const formData = await request.formData();
                const task = (formData.get('task') || '').toString().trim();
                const description = (formData.get('description') || '').toString().trim();

                if (task !== '') {
                    await withDatabase(env, ctx, async (db) => {
                        await db.collection('todos').insertOne({
                            task,
                            description,
                            completed: false,
                            createdAt: new Date(),
                        });
                    });
                }
                return redirectHome(request);
            }

            // 4. Toggle task completed status
            const toggleMatch = pathname.match(/^\/toggle\/([^/]+)$/);
            if (method === 'GET' && toggleMatch) {
                const id = toggleMatch[1];
                if (ObjectId.isValid(id)) {
                    await withDatabase(env, ctx, async (db) => {
                        const todos = db.collection('todos');
                        const current = await todos.findOne({ _id: new ObjectId(id) });
                        if (current) {
                            await todos.updateOne(
                                { _id: new ObjectId(id) },
                                { $set: { completed: !current.completed } }
                            );
                        }
                    });
                }
                return redirectHome(request);
            }

            // 5 & 6. Edit / Update task routes
            const updateMatch = pathname.match(/^\/update\/([^/]+)$/);
            if (updateMatch) {
                const id = updateMatch[1];
                if (!ObjectId.isValid(id)) {
                    return redirectHome(request);
                }

                if (method === 'GET') {
                    const task = await withDatabase(env, ctx, async (db) => {
                        return db.collection('todos').findOne({ _id: new ObjectId(id) });
                    });
                    if (!task) {
                        return redirectHome(request);
                    }
                    return renderView('update', { task });
                }

                if (method === 'POST') {
                    const formData = await request.formData();
                    const task = (formData.get('task') || '').toString().trim();
                    const description = (formData.get('description') || '').toString().trim();

                    if (task !== '') {
                        await withDatabase(env, ctx, async (db) => {
                            await db.collection('todos').updateOne(
                                { _id: new ObjectId(id) },
                                {
                                    $set: {
                                        task,
                                        description,
                                        updatedAt: new Date(),
                                    },
                                }
                            );
                        });
                    }
                    return redirectHome(request);
                }
            }

            // 7. Delete a task
            const deleteMatch = pathname.match(/^\/delete\/([^/]+)$/);
            if (method === 'GET' && deleteMatch) {
                const id = deleteMatch[1];
                if (ObjectId.isValid(id)) {
                    await withDatabase(env, ctx, async (db) => {
                        await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
                    });
                }
                return redirectHome(request);
            }

            return new Response('Not Found', { status: 404 });
        } catch (err) {
            console.error('Worker request error:', err);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
};
