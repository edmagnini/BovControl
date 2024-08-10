const { connect } = require("./index");
const { ObjectId } = require("mongodb")

class FactoryBaseDatabase {
    async createFactory(factory) {
        const db = await connect();
        return db.collection("factory").insertOne(factory);
    }

    async getFactoryById(id) {

        if (typeof id !== 'string' || !ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const db = await connect();
        return db.collection("factory").findOne({ _id: new ObjectId(id) })
    }
}

module.exports = FactoryBaseDatabase;
