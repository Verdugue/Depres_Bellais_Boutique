const db = require('../database');

exports.getOthers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM other LIMIT 15');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des autres' });
    }
};

exports.getOtherById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [results] = await db.query('SELECT * FROM other WHERE id_other = ?', [id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Élément non trouvé' });
        } else {
            res.status(200).json(results[0]);
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'élément' });
    }
};