const db = require('../database');

exports.getPoissons = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM animals LIMIT 15');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des poissons' });
    }
};

exports.getPoisson = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [results] = await db.query('SELECT * FROM animals WHERE id_animals = ?', [id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Poisson non trouvé' });
        } else {
            res.status(200).json(results[0]);
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération du poisson' });
    }
};
