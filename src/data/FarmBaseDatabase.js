const { connect } = require("./index");
const { ObjectId } = require("mongodb")

class FarmBaseDatabase {
    async createFarm(farm) {
        const db = await connect();
        return db.collection("farm").insertOne(farm);
    }

    async getFarmById(id) {

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const db = await connect();
        return db.collection("farm").findOne({ _id: new ObjectId(id) })
    }
}

module.exports = FarmBaseDatabase;
