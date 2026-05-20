const db = require('../db/db');

const menuAll = () => {
    const query = `
    SELECT * FROM menu ORDER BY id ASC`
    return db.query(query);
}

module.exports = menuAll;