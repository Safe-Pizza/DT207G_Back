const { Client } = require("pg");
require("dotenv").config();

//anslutning till databas
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect((err) => {
    if(err) {
        console.log("Conntection error: " + err);
    } else {
        console.log("Connected to database");
        createTables();
    }
})

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
        await client.end()
    }
}