const db = require('../db/db');

const userExists = (email) => {
    const query = `
    SELECT * FROM user_cred WHERE email = $1`
    return db.query(query, [email]);
}

module.exports = userExists;