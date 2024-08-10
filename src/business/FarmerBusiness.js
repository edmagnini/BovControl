const FarmerBaseDatabase = require("../data/FarmerBaseDatabase");
const Farmer = require("../model/Farmer");


class FarmerBusiness {
    constructor() {
        this.farmerBaseDatabase = new FarmerBaseDatabase();
    }

    async registerFarmer(farmerData) {
        const farmer = new Farmer(
            farmerData.name,
            farmerData.email,
            farmerData.password
        );

        if (!farmer.name || !farmer.email || !farmer.password) {
            throw new Error("Invalid farmer data");
        }

        

        return this.farmerBaseDatabase.createFarmer(farmer);
    }

    async getFarmer(id) {
        return this.farmerBaseDatabase.getFarmerById(id);
    }
}

module.exports = FarmerBusiness;