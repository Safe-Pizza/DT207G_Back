const db = require('../db/db');

const menuCreate = (title, description, price, category, allergy,  image) => {
    const query = `
    INSERT INTO menu
    (title, description, price, category, allergy, image)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`
    return db.query(query, [title, description, price, category, allergy, image])
}

module.exports = menuCreate;