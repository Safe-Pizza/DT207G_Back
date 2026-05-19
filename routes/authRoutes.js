//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

//Hämta middleware för att verifiera token
const authToken = require('../authJwt/authToken');

//Test route
router.get('/', (req, res) => {
    res.json({ message: `Hannas API` });
});

//skyddad route som listar användare, kräver giltig token
router.get('/users', authToken, async (req, res) => {
    res.json({ message: `Route all users` });
});

//skyddad route som tar bort användare, kräver giltig token
router.delete('/users/:username', authToken, async (req, res) => {
    res.json({ message: `Route delete user` });
});

//Skapa användarkonto
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //Validera data
        const errors = [];
        if (!name) {
            errors.push('Invalid input: Name is required');
        }
        if (!email) {
            errors.push('Invalid input: Email is required');
        }
        if (!password) {
            errors.push('Invalid input: Password is required');
        }
        if (errors.length > 0) {
            return res.status(400).json({ message: errors });
        } else {
            //skapa användare
            
            res.status(201).json({ message: `User ${email} created successfully` });
        }

    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
});

//Logga in
router.post('/login', async (req, res) => {
    res.json({ message: `Route login user` });
});

module.exports = router;