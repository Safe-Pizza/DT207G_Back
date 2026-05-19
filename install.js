const db = require('./db/db');
require("dotenv").config();

async function createTables() {
    try {
        const res = await client.query(`
            CREATE TABLE IF NOT EXISTS user_cred (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
            `)
            console.log(res)
    } catch (err) {
        console.log(err)
    } finally {
        await db.end()
    }
}