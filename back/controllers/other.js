const db = require('../database');

exports.getOthers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM other');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
};
