const { connect } = require("./index");
const { ObjectId } = require("mongodb")

class FarmBaseDatabase {
    async createFarm(farm) {
        try {
            const db = await connect();
            return db.collection("farm").insertOne(farm);
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getFarmById(id) {
        try {
            const db = await connect();
            return db.collection("farm").findOne({ _id: new ObjectId(id) })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = FarmBaseDatabase;
