const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const poissonRoutes = require('./routes/poisson');
const plantRoutes = require('./routes/plant'); // Assure-toi que ce chemin est correct
const otherRoutes = require('./routes/otherRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/poissons', poissonRoutes);
app.use('/api/plants', plantRoutes); // Ajoute cette ligne pour les routes des plantes
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