const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const dbUser = process.env.DATABASE_USER || 'postgres';
const dbPassword = process.env.DATABASE_PASSWORD || 'supersecurepassword';
const dbName = process.env.MONGO_DATABASE || 'lista';
const dbPort = process.env.MONGO_PORT || 27017;
const dbHost = process.env.DATABASE_HOST || 'localhost';


const mongoURI = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

app.use(cors({
    origin: 'http://localhost',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));

const collectionName = 'tareas'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/', express.static(path.join(__dirname, 'public')))


app.get('/api/listas', async (req, res) => {
    const response = await findAll();
    res.send(response);
});

app.post('/api/listas', async (req, res) => {
    await save(req.body.nueva);
    res.redirect(`${req.protocol}://${req.hostname}`);
});

app.delete('/api/listas/:id', async (req, res) => {
    await deleteOne(req.params.id);
    res.status(204).send();
});

app.put('/api/listas/:id', async (req, res) => {
    await updateDone(req.params.id, req.body.isDone);
    res.status(204).send();
});

async function findAll() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        return await collection.find({}).toArray();

    } finally {
        await client.close();
    }
}

async function save(nombre, isDone = false) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);


        const resultado = await collection.insertOne({ nombre, isDone});

        console.log('Resultado de la consulta:', resultado);
    } finally {
        await client.close();
    }
}

async function deleteOne(id) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const idObj = new ObjectId(id);

        const resultado = await collection.deleteOne({ _id: idObj });

        console.log('Resultado de la consulta:', resultado);
    } finally {
        await client.close();
    }
}

async function updateDone(id, isDone) {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const idObj = new ObjectId(id);

        const resultado = await collection.updateOne({ _id: idObj }, { $set: { isDone } });

        console.log('Resultado de la consulta:', resultado);
    } finally {
        await client.close();
    }
}










app.listen(port, () => console.log('Server started on port 4000'));