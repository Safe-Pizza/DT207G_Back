const db = require('../db/db');

const menuAll = () => {
    const query = `
    SELECT * FROM menu`
    return db.query(query);
}

module.exports = menuAll;