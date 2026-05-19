const db = require('../db/db');

const userDelete = (email) => {
    const query = `
    DELETE FROM user_cred WHERE email = $1`
    return db.query(query, [email]);
}

module.exports = userDelete;