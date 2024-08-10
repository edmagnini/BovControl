// src/data/index.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let singleton;

async function connect() {
    if (singleton) return singleton;
    
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    
    singleton = client.db(process.env.MONGO_DATABASE);
    return singleton;
}

module.exports = { connect };
