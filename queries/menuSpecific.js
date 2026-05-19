const db = require('../db/db');

const menuSpecific = (id) => {
    const query = `
    SELECT * FROM menu WHERE id = $1`
    return db.query(query, [id]);
}

module.exports = menuSpecific;