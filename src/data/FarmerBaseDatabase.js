// src/data/FarmerBaseDatabase.js
const { connect } = require("./index");
const { ObjectId } = require("mongodb")

class FarmerBaseDatabase {
    async createFarmer(farmer) {
        try {
            const db = await connect();
            return db.collection("farmer").insertOne(farmer);
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getFarmerById(id) {
        try {
            const db = await connect();
            return db.collection("farmer").findOne({ _id: new ObjectId(id) })
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getFarmerByEmail(email) {
        try {
            const db = await connect();
            return db.collection("farmer").findOne({ email })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = FarmerBaseDatabase;
