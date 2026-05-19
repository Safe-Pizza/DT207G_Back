const menuCreate = (title, description, price, category, allergy) => {
    const query = `
    INSERT INTO menu
    (title, description, price, category, allergy)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`
    return db.query(query, [title, description, price, category, allergy])
}

module.exports = menuCreate;