const db = require('../db/db');

const menuChange = (title, description, price, category, allergy, image, id) => {
    const query = `
    UPDATE menu
    SET title = $1,
    description = $2,
    price = $3,
    category = $4,
    allergy = $5,
    image = $6
    WHERE id = $7
    `
    return db.query(query, [title, description, price, category, allergy, image, id])
}

module.exports = menuChange;