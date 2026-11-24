const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

// Helper to safely get the MongoDB collection
const getTodos = () => getCollection('todos');

// 1. Home page - List all tasks
router.get('/', async (req, res) => {
    try {
        const todosCollection = getTodos();
        const tasks = todosCollection 
            ? await todosCollection.find().sort({ createdAt: -1 }).toArray() 
            : [];
            
        res.render('list', { tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.render('list', { tasks: [] });
    }
});

// 2. Add task page
router.get('/add', (req, res) => {
    res.render('add');
});

// 3. Create a new task
router.post('/add', async (req, res) => {
    try {
        const { task, description } = req.body;
        const todosCollection = getTodos();

        if (todosCollection && task && task.trim() !== '') {
            await todosCollection.insertOne({
                task: task.trim(),
                description: (description || '').trim(),
                completed: false,
                createdAt: new Date()
            });
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error creating task:', err);
        res.redirect('/');
    }
});

// 4. Toggle task completed status
router.get('/toggle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todosCollection = getTodos();

        if (todosCollection && ObjectId.isValid(id)) {
            const current = await todosCollection.findOne({ _id: new ObjectId(id) });
            if (current) {
                await todosCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { completed: !current.completed } }
                );
            }
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error toggling status:', err);
        res.redirect('/');
    }
});

// 5. Edit task page
router.get('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todosCollection = getTodos();

        if (!todosCollection || !ObjectId.isValid(id)) {
            return res.redirect('/');
        }

        const task = await todosCollection.findOne({ _id: new ObjectId(id) });
        if (!task) {
            return res.redirect('/');
        }

        res.render('update', { task });
    } catch (err) {
        console.error('Error loading task for edit:', err);
        res.redirect('/');
    }
});

// 6. Save task updates
router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task, description } = req.body;
        const todosCollection = getTodos();

        if (todosCollection && ObjectId.isValid(id) && task && task.trim() !== '') {
            await todosCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        task: task.trim(),
                        description: (description || '').trim(),
                        updatedAt: new Date()
                    }
                }
            );
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error updating task:', err);
        res.redirect('/');
    }
});

// 7. Delete a task
router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todosCollection = getTodos();

        if (todosCollection && ObjectId.isValid(id)) {
            await todosCollection.deleteOne({ _id: new ObjectId(id) });
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting task:', err);
        res.redirect('/');
    }
});

module.exports = router;
