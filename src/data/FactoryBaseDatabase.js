const { connect } = require("./index");
const { ObjectId } = require("mongodb")
class FactoryBaseDatabase {
    async createFactory(factory) {
        try {
            const db = await connect();
            return db.collection("factory").insertOne(factory);
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getFactoryById(id) {
        try {
            const db = await connect();
            return db.collection("factory").findOne({ _id: new ObjectId(id) })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = FactoryBaseDatabase;
