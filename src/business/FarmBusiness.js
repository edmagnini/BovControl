const FarmBaseDatabase = require("../data/FarmBaseDatabase");
const FarmerBaseDatabase = require("../data/FarmerBaseDatabase");
const Farm = require("../model/Farm");
const CustomError = require("../utils/CustomError")
class FarmBusiness {
    constructor() {
        this.farmBaseDatabase = new FarmBaseDatabase();
    }
    async registerFarm(farmData) {

        const farm = new Farm(
            farmData.name,
            farmData.farmCode,
            farmData.farmer,
            farmData.address,
            farmData.latitude,
            farmData.longitude,
        );
        if (!farm.name || !farm.farmCode || !farm.farmer || !farm.address || !farm.latitude || !farm.longitude) {
            throw new CustomError(422,"Invalid farm data");
        }
        const checkFarmer = await new FarmerBaseDatabase().getFarmerById(!farm.farmer)
        if (!checkFarmer) {
            throw new CustomError(422, "Farmer not found")
        }
        return this.farmBaseDatabase.createFarm(farm);
    }
    async getFarm(poyload) {
        const { id } = poyload
        if (typeof id !== 'string') {
            throw new CustomError(422, 'Invalid ID format');
        }
        return this.farmBaseDatabase.getFarmById(id);
    }
}

module.exports = FarmBusiness;