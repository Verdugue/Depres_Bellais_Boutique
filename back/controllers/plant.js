const db = require('../database');

exports.getPlants = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM plant LIMIT 15');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des plantes' });
    }
};

exports.getPlantById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [results] = await db.query('SELECT * FROM plant WHERE id_plant = ?', [id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Plante non trouvée' });
        } else {
            res.status(200).json(results[0]);
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la plante' });
    }
};