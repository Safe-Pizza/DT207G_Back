const db = require('../db/db');

const usersAll = (email) => {
    const query = `
    SELECT * FROM user_cred`
    return db.query(query);
}

module.exports = usersAll;