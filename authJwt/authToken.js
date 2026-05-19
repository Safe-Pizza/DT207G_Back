//Hämta paket
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Middleware för att verifiera token
function authToken(req, res, next) {
    const authHeader = req.headers[`authorization`];
    const token = authHeader && authHeader.split(' ')[1]; // token

    if (!token) {
        return res.status(401).json({ message: `Access denied. No token provided.` });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) {
            return res.status(403).json({ message: `Invalid token.` });
        }
        req.username = username;
        next();
    });
}

module.exports = authToken;