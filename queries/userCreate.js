const db = require('../db/db');

const userCreate = (name, email, password) => {
    const query = `
    INSERT INTO user_cred
    (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *`
    return db.once(query, [name, email, password])
}

module.exports = userCreate;