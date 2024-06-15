const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./database');  // Assurez-vous d'importer la connexion à la base de données
const poissonRoutes = require('./routes/poisson');
const plantRoutes = require('./routes/plant');
const otherRoutes = require('./routes/other');
const filterRoutes = require('./routes/filter');

app.use(cors());
app.use(express.json());

app.use('/api/filter', filterRoutes);
app.use('/api/poissons', poissonRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/others', otherRoutes);

app.get('/random-animals', (req, res) => {
    console.log("Exécution de la requête SQL pour obtenir des animaux aléatoires.");
    const query = 'SELECT * FROM animals ORDER BY RAND() LIMIT 12';
    db.query(query)
        .then(([results]) => {
            console.log('Résultats obtenus:', results);
            res.json(results);
        })
        .catch(err => {
            console.error('Erreur lors de la requête SQL:', err);
            res.status(500).send('Erreur lors de la récupération des animaux');
        });
});

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
