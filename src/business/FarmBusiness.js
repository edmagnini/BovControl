const FarmBaseDatabase = require("../data/FarmBaseDatabase");
const Farm = require("../model/Farm");


class FarmBusiness {
    constructor() {
        this.farmBaseDatabase = new FarmBaseDatabase();
    }

    async registerFarm(farmData) {
        const farm = new Farm(
            farmData.name,
            farmData.farmCode,
            farmData.farmer,
            farmData.addres,
            farmData.latitude,
            farmData.longitude,
        );

        if (!farm.name || !farm.farmCode || !farm.farmer) {
            throw new Error("Invalid farm data");
        }

        return this.farmBaseDatabase.createFarm(farm);
    }

    async getFarm(id) {
        return this.farmBaseDatabase.getFarmById(id);
    }
}

module.exports = FarmBusiness;