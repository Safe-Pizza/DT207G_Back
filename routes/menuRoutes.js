//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//SQL-queries
const menuAll = require('../queries/menuAll');

const router = express.Router();

//Hämta middleware för att verifiera token
const authToken = require('../authJwt/authToken');

//Hämta alla

router.get('/', async (req, res) => {
    try {
        let result = await menuAll(); //Query för alla användare

        //kontroll om databas saknar data
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No meals found" });
        } else {
            return res.json(result.rows); //returnera response med alla användare
        }
    } catch (error) {
        return res.status(500).json(error); // felmeddelande
    }
});

//Hämta specifik
router.get('/:id', (req, res) => {
    res.json({ message: `Menu specific` });
});

//Lägg till
router.post('/', (req, res) => {
    res.json({ message: `Menu post` });
});

//Ta bort specifik
router.delete('/:id', authToken, async (req, res) => {
    res.json({ message: `Delete menu specific`});
});

module.exports = router;