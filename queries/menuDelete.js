const db = require('../db/db');

const menuDelete = (id) => {
    const query = `
    DELETE FROM menu WHERE id = $1`
    return db.query(query, [id]);
}

module.exports = menuDelete;