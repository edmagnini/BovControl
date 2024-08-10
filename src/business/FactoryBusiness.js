const FactoryBaseDatabase = require("../data/FactoryBaseDatabase");
const Factory = require("../model/Factory");


class FactoryBusiness {
    constructor() {
        this.factoryBaseDatabase = new FactoryBaseDatabase();
    }

    async registerFactory(factoryData) {
        const factory = new Factory(
            factoryData.name,
            factoryData.address,
            factoryData.latitude,
            factoryData.longitude,
        );

        if (!factory.name || !factory.address || !factory.latitude  || !factory.longitude) {
            throw new Error("Invalid factory data");
        }

        return this.factoryBaseDatabase.createFactory(factory);
    }

    async getFactory(id) {
        return this.factoryBaseDatabase.getFactoryById(id);
    }
}

module.exports = FactoryBusiness;