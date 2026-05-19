//Hämta paket
const express = require('express');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//SQL-queries
const menuAll = require('../queries/menuAll');
const menuSpecific = require('../queries/menuSpecific');
const menuDelete = require('../queries/menuDelete');
const menuCreate = require('../queries/menuCreate');

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
router.post('/', async (req, res) => {
    let {
        title,
        description,
        price,
        category,
        allergy
    } = req.body;

    //varibel för felmeddelande
    let errors = {
        message: "",
        detail: "",
        https_res: {

        }
    };

    //Kontroll inga tomma fält
    if (!title || !description || !price || !category || !allergy) {
        //Felmeddelande
        errors.message = "All params are not included";
        errors.detail = "Must include title, description, price, category, allergy in JSON"
        //Felkods-status
        errors.https_res.message = "Bad request";
        errors.https_res.code = 400;

        res.status(400).json(errors);

        return;
    }

    let meal = {
        title: title,
        description: description,
        price: price,
        category: category,
        allergy: allergy,
    }
   //SQL-fråga lägga till i databas
    try {
        const result = menuCreate(title, description, price, category, allergy);
        //Meddelande vid OK
        res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    } catch (error) {
        //Felmeddelande
        res.status(500).json({ message: "Error occured: " + error });
    }
});

//Ta bort specifik
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