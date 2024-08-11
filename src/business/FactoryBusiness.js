const FactoryBaseDatabase = require("../data/FactoryBaseDatabase");
const Factory = require("../model/Factory");
const CustomError = require("../utils/CustomError")


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
        if (!factory.name || !factory.address || !factory.latitude || !factory.longitude) {
            throw new CustomError(422, "Invalid factory data");
        }
        return this.factoryBaseDatabase.createFactory(factory);
    }
    async getFactory(id) {
        if (typeof id !== 'string') {
            throw new CustomError(422, 'Invalid ID format');
        }
        return this.factoryBaseDatabase.getFactoryById(id);
    }
}

module.exports = FactoryBusiness;