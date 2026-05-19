//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const createUser = require('../queries/userCreate');
const userExists = require('../queries/userExists');
const bcrypt = require('bcrypt');
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

            //kontroll finns användare
            const user = await userExists(email);

            if (user.rowCount !== 0) {
                return res.status(400).json({ message: `User already exists` });
            }
            //hash lösenord
            const hashPassword = await bcrypt.hash(password, 10);

            //lägg till användare
            const result = await createUser(name, email, hashPassword);

            res.status(201).json({ message: `User ${email} created successfully` });
        }

    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
});

//Logga in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validera input
        if (!email || !password) {
            return res.status(400).json({ message: `Invalid input: Email and password are required` });
        }

        //kontrollera användare finns
        const user = await userExists(email);

        if (user.rowCount === 0) {
            //användare finns ej
            return res.status(401).json({ message: `Incorrect email or password` });
        } else {
            //användare finns
            const passwordIsMatch = await bcrypt.compare(password, user.rows[0].password);

            if(!passwordIsMatch) {
                res.status(401).json ({ message: `Incorrect email or password`})
            } else {
                //Match lösenord
                res.status(200).json({ message: `Valid login`})
            }
        }
    } catch (err) {
        res.status(500).json({ message: `Error occurred: ${error}` });
    }

});

module.exports = router;