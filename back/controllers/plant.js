const db = require('../database');

exports.getPlants = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM plant');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des plantes' });
    }
};
