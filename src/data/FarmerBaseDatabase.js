// src/data/FarmerBaseDatabase.js
const { connect } = require("./index");
const { ObjectId } = require("mongodb")

class FarmerBaseDatabase {
    async createFarmer(farmer) {
        const db = await connect();
        return db.collection("farmer").insertOne(farmer);
    }

    async getFarmerById(id) {

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const db = await connect();
        return db.collection("farmer").findOne({ _id: new ObjectId(id) })
    }
}

module.exports = FarmerBaseDatabase;
