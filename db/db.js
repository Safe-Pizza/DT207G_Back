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
    }
})

module.exports = client;
