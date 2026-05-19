const db = require('./db/db');
require("dotenv").config();

createTables();

async function createTables() {
    try {
        const res = await db.query(`
            CREATE TABLE IF NOT EXISTS user_cred (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS menu (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price INT NOT NULL,
            category TEXT NOT NULL,
            allergy TEXT)
            `)
            console.log(res)
    } catch (err) {
        console.log(err)
    } finally {
        await db.end()
    }
}