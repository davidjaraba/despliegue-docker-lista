const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();


const port = 4000;
const username = 'appAdmin';
const password = 'supersecure';
const dbName = 'funkos';
const url = `mongodb://${username}:${password}@localhost:27017/${dbName}`;
const collectionName = 'listas'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')))


app.get('/api/listas', async (req, res) => {
    const response = await findAll();
    res.send(response);
});

app.post('/api/listas', async (req, res) => {
    await save(req.body.nueva);
    res.redirect('/');
});



async function findAll() {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        return await collection.find({}).toArray();

    } finally {
        await client.close();
    }
}

async function save(nombre) {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const resultado = await collection.insertOne({ nombre});

        console.log('Resultado de la consulta:', resultado);
    } finally {
        await client.close();
    }
}














app.listen(port, () => console.log('Server started on port 4000'));