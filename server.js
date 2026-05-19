//Hämta paket
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoutes');
const menuRoute = require('./routes/menuRoutes');
const cors = require('cors');
require('dotenv').config();

//Varibel för express
const app = express();

//Formulärdata
app.use(bodyParser.json());

//cross-origin
app.use(cors());

//Parse JSON
app.use(express.json());

//Variabel för port
const port = process.env.PORT || 3000;

//Routes
app.use(`/api`, authRoute);
app.use(`/api/menu`, menuRoute);

//starta servern
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})