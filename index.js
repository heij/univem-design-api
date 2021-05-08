const express = require('express');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

const dbPath = 'pokemon.json';
const db = {
    pokemon: require('./pokemon.json/pokedex.json'),
    moves: require('./pokemon.json/moves.json'),
    items: require('./pokemon.json/items.json')
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/pokemon/:id', (req, res) => {
    const pokemon = db.pokemon[req.params.id - 1];

    pokemon.image = {
        id: req.params.id,
        url: `${apiUrl}/image/${req.params.id}`
    };
    pokemon.sprite = {
        id: req.params.id,
        url: `${apiUrl}/sprite/${req.params.id}`
    };

    return res.status(200).json(pokemon);
});

app.get('/move/:id', (req, res) => {
    const move = db.moves[req.params.id - 1];

    return res.status(200).json(move);
});

app.get('/image/:id', (req, res) => {
    const imageId = req.params.id.padStart(3, '0');
    const imageName = `${imageId}.png`

    return res.sendFile(path.join(__dirname, dbPath, 'images', imageName));
});

app.get('/sprite/:id', (req, res) => {
    const spriteId = req.params.id.padStart(3, '0');
    const spriteName = `${spriteId}MS.png`;

    return res.sendFile(path.join(__dirname, dbPath, 'sprites', spriteName));
});

app.get('/type/:type/pokemon', (req, res) => {
    const type = req.params.type[0].toUpperCase() + req.params.type.slice(1); 
    const pokemonsData = db.pokemon.filter(p => p.type.includes(type));
    const pokemons = pokemonsData.map(p => ({
        id: p.id,
        url: `${apiUrl}/pokemon/${p.id}`
    }));

    return res.status(200).json(pokemons);
});

app.get('/type/:type/moves', (req, res) => {
    const type = req.params.type[0].toUpperCase() + req.params.type.slice(1); 
    const movesData = db.moves.filter(p => p.type.includes(type));
    const moves = movesData.map(p => ({
        id: p.id,
        url: `${apiUrl}/move/${p.id}`
    }));

    return res.status(200).json(moves);
});

let apiUrl;
const server = app.listen(port, (err) => {
	console.log("Listening in port " + port);

    let address = server.address();
    if (address.address == '::') address.address = 'localhost';
    apiUrl = `http://${address.address}:${address.port}`;
});