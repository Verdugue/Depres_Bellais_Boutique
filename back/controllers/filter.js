const db = require('../database');

exports.getSpecies = async (req, res) => {
    const { category } = req.query;
    console.log(`getSpecies called with category: ${category}`);
    try {
        let query = '';
        if (category === 'poisson') {
            query = 'SELECT species FROM animals';
        } else if (category === 'plant') {
            query = 'SELECT DISTINCT plant_name as species FROM plant';
        } else if (category === 'other') {
            query = 'SELECT DISTINCT species FROM other';
        } else {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }
        
        console.log("Query poisson : " + query)
        const [results] = await db.query(query);
        console.log(results)
        const species = results.map(row => row.species);
        console.log(`Fetched species: ${species}`);
        res.status(200).json(species);
    } catch (err) {
        console.error('Erreur lors de la récupération des espèces:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des espèces' });
    }
};

exports.getLocations = async (req, res) => {
    const { category } = req.query;
    console.log(`getLocations called with category: ${category}`);
    try {
        let query = '';
        if (category === 'animals') {
            query = 'SELECT DISTINCT location FROM animals';
        } else if (category === 'plant') {
            query = 'SELECT DISTINCT location FROM plant';
        } else if (category === 'other') {
            query = 'SELECT DISTINCT location FROM other';
        } else {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }

        const [results] = await db.query(query);
        const locations = results.map(row => row.location);
        console.log(`Fetched locations: ${locations}`);
        res.status(200).json(locations);
    } catch (err) {
        console.error('Erreur lors de la récupération des emplacements:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des emplacements' });
    }
};

exports.getColors = async (req, res) => {
    const { category } = req.query;
    console.log(`getColors called with category: ${category}`);
    try {
        let query = '';
        if (category === 'poisson') {
            query = 'SELECT DISTINCT colors FROM animals';
        } else if (category === 'plant') {
            query = 'SELECT DISTINCT color as colors FROM plant';
        } else if (category === 'other') {
            query = 'SELECT DISTINCT colors FROM other';
        } else {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }

        const [results] = await db.query(query);
        const colors = results.map(row => row.colors);
        console.log(`Fetched colors: ${colors}`);
        res.status(200).json(colors);
    } catch (err) {
        console.error('Erreur lors de la récupération des couleurs:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des couleurs' });
    }
};

exports.getResults = async (req, res) => {
    const { category, species, location, color, minPrice, maxPrice } = req.query;
    console.log(`getResults called with params: category=${category}, species=${species}, location=${location}, color=${color}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    try {
        let query = '';
        let queryParams = [];

        if (category === 'poisson') {
            query = 'SELECT * FROM animals WHERE 1=1';
            if (species) {
                query += ' AND species = ?';
                queryParams.push(species);
            }
            if (location) {
                query += ' AND location = ?';
                queryParams.push(location);
            }
            if (color) {
                query += ' AND colors = ?';
                queryParams.push(color);
            }
            if (minPrice) {
                query += ' AND price >= ?';
                queryParams.push(minPrice);
            }
            if (maxPrice) {
                query += ' AND price <= ?';
                queryParams.push(maxPrice);
            }
        } else if (category === 'plant') {
            query = 'SELECT * FROM plant WHERE 1=1';
            if (species) {
                query += ' AND plant_name = ?';
                queryParams.push(species);
            }
            if (location) {
                query += ' AND location = ?';
                queryParams.push(location);
            }
            if (color) {
                query += ' AND color = ?';
                queryParams.push(color);
            }
            if (minPrice) {
                query += ' AND price >= ?';
                queryParams.push(minPrice);
            }
            if (maxPrice) {
                query += ' AND price <= ?';
                queryParams.push(maxPrice);
            }
        } else if (category === 'other') {
            query = 'SELECT * FROM other WHERE 1=1';
            if (species) {
                query += ' AND species = ?';
                queryParams.push(species);
            }
            if (location) {
                query += ' AND location = ?';
                queryParams.push(location);
            }
            if (color) {
                query += ' AND colors = ?';
                queryParams.push(color);
            }
            if (minPrice) {
                query += ' AND price >= ?';
                queryParams.push(minPrice);
            }
            if (maxPrice) {
                query += ' AND price <= ?';
                queryParams.push(maxPrice);
            }
        } else {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }

        console.log(`Query: ${query}`);
        console.log(`Query Params: ${queryParams}`);

        const [results] = await db.query(query, queryParams);
        console.log(`Fetched results: ${results}`);
        res.status(200).json(results);
    } catch (err) {
        console.error('Erreur lors de la récupération des résultats:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des résultats' });
    }
};
