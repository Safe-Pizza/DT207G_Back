//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

//config för multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/`)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
})

const upload = multer({storage});

//SQL-queries
const menuAll = require('../queries/menuAll');
const menuSpecific = require('../queries/menuSpecific');
const menuDelete = require('../queries/menuDelete');
const menuCreate = require('../queries/menuCreate');
const menuChange = require('../queries/menuChange');

const router = express.Router();

//Hämta middleware för att verifiera token
const authToken = require('../authJwt/authToken');

//Hämta alla rätter i meny
router.get('/', async (req, res) => {
    try {
        let result = await menuAll(); //Query för alla rätter

        //kontroll om databas saknar data
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No meals found" });
        } else {
            return res.json(result.rows); //returnera response med alla rätter
        }
    } catch (error) {
        return res.status(500).json(error); // felmeddelande
    }
});

//Hämta specifik rätt
router.get('/:id', async (req, res) => {
    try {
        let result = await menuSpecific(req.params.id);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `No meal with id: ${req.params.id}` });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(400).json({ message: `Error-message: ${error}` }); // felmeddelande
    }
});

//Lägg till rätt
router.post('/', upload.single('image'), authToken, async (req, res) => {
    let {
        title,
        description,
        price,
        category,
        allergy
    } = req.body;

    //Validera data
    const errors = [];
    if (!title) {
        errors.push('Invalid input: Title is required');
    }
    if (!description) {
        errors.push('Invalid input: Description is required');
    }
    if (!price) {
        errors.push('Invalid input: Price is required');
    }
    if (!category) {
        errors.push('Invalid input: Category is required');
    }
    if (allergy === "") {
        allergy = null;
    }
    if (!req.file) {
        image = null;
    } else {
        image = `http://localhost:5000/${req.file.destination}${req.file.filename}`;
    }
    if (typeof(price) !== 'number') {
        price = parseInt(price);
    }
    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    } else {

        console.log(req.file.path);

        let meal = {
            title: title,
            description: description,
            price: price,
            category: category,
            allergy: allergy,
            image: image
        }
        //SQL-fråga lägga till i databas
        try {
            const result = menuCreate(title, description, price, category, allergy, image);

            //Meddelande vid OK
            res.status(201).json({ ...req.body });
        } catch (error) {
            //Felmeddelande
            res.status(500).json({ message: "Error occured: " + error });
        }
    }
});

//Lägg till rätt
router.put('/:id', upload.single('image'), async (req, res) => {
    let {
        title,
        description,
        price,
        category,
        allergy
    } = req.body;

    //Validera data
    const errors = [];
    if (!title) {
        errors.push('Invalid input: Title is required');
    }
    if (!description) {
        errors.push('Invalid input: Description is required');
    }
    if (!price) {
        errors.push('Invalid input: Price is required');
    }
    if (!category) {
        errors.push('Invalid input: Category is required');
    }
    if (allergy === "") {
        allergy = null;
    }
    if (!req.file) {
        image = null;
    } else {
        image = `http://localhost:5000/${req.file.destination}${req.file.filename}`;
    }
    if (typeof(price) !== 'number') {
        price = parseInt(price);
    }
    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    } else {

        let meal = {
            title: title,
            description: description,
            price: price,
            category: category,
            allergy: allergy,
            image: image
        }
        //SQL-fråga lägga till i databas
        try {
            const result = menuChange(title, description, price, category, allergy, image, req.params.id);

            //Meddelande vid OK
            res.status(201).json({ message: `${req.params.id} is changed ${req.body}` });
        } catch (error) {
            //Felmeddelande
            res.status(500).json({ message: "Error occured: " + error });
        }
    }
});

//Ta bort specifik rätt
router.delete('/:id', authToken, async (req, res) => {
    try {
        let result = await menuDelete(req.params.id);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `No meal found with ID: ${req.params.id}` });
        }
        return res.json({ message: `Success! Meal with ID: ${req.params.id} is deleted.` });
    } catch (error) {
        return res.status(400).json({ message: `Error-message: ${error}` }); // felmeddelande
    }
});

module.exports = router;