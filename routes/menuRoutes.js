//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();

//Temp lagring med multer innan sharp
const upload = multer({ storage: multer.memoryStorage() });

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
        let result = await menuAll();

        if (result.rows.length === 0) {
            res.status(404).json({ message: "No meals found" });
        } else {
            return res.json(result.rows);
        }
    } catch (error) {
        return res.status(500).json(error);
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
        return res.status(400).json({ message: `Error-message: ${error}` });
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

    const errors = [];
    if (!title) errors.push('Invalid input: Title is required');
    if (!description) errors.push('Invalid input: Description is required');
    if (!price) errors.push('Invalid input: Price is required');
    if (!category) errors.push('Invalid input: Category is required');

    if (allergy === "") allergy = null;
    if (typeof price !== 'number') price = parseInt(price);

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    try {
        const outputFilename = `${Date.now()}.jpg`;
        let image = null; // FIX: deklarera med let

        if (req.file) {
            await sharp(req.file.buffer)
                .resize(300, 300, { fit: "cover" })
                .jpeg({ quality: 90 })
                .toFile(`uploads/${outputFilename}`);

            image = `http://localhost:5000/uploads/${outputFilename}`;
        }

        // FIX: await tillagt
        await menuCreate(title, description, price, category, allergy, image);

        res.status(201).json({ ...req.body });
    } catch (error) {
        res.status(500).json({ message: "Error occured: " + error });
    }
});

//Ändra rätt
router.put('/:id', upload.single('image'), authToken, async (req, res) => {
    let {
        title,
        description,
        price,
        category,
        allergy,
        image
    } = req.body;

    const errors = [];
    if (!title) errors.push('Invalid input: Title is required');
    if (!description) errors.push('Invalid input: Description is required');
    if (!price) errors.push('Invalid input: Price is required');
    if (!category) errors.push('Invalid input: Category is required');

    if (allergy === "") allergy = null;
    if (typeof price !== 'number') price = parseInt(price);

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    try {
        const outputFilename = `${Date.now()}.jpg`;

        if (!req.file) {
            // FIX: hämta befintlig bild från databasen om ingen ny skickas
            const existing = await menuSpecific(req.params.id);
            image = existing.rows[0].image;
        } else {
            await sharp(req.file.buffer)
                .resize(300, 300, { fit: "cover" })
                .jpeg({ quality: 90 })
                .toFile(`uploads/${outputFilename}`);

            image = `http://localhost:5000/uploads/${outputFilename}`;
        }

        // FIX: await tillagt + req.body borttaget från template literal
        await menuChange(title, description, price, category, allergy, image, req.params.id);

        res.status(201).json({ message: `${req.params.id} is changed` });
    } catch (error) {
        res.status(500).json({ message: "Error occured: " + error });
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
        return res.status(400).json({ message: `Error-message: ${error}` });
    }
});

module.exports = router;