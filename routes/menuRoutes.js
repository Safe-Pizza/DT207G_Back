//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

//Hämta middleware för att verifiera token
const authToken = require('../authJwt/authToken');

//Hämta alla
router.get('/', (req, res) => {
    res.json({ message: `Menu all` });
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