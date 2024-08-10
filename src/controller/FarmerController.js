const FarmerBusiness = require("../business/FarmerBusiness");
const FarmerBaseDatabase = require("../data/FarmerBaseDatabase")

class FarmerController {
    constructor() {
        this.farmerBusiness = new FarmerBusiness(new FarmerBaseDatabase);
    }

    async createFarmer(req, res) {
        try {
            const farmer = await this.farmerBusiness.registerFarmer(req.body);
            res.status(201).send(farmer);
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: error.message });
        }
    }

    async getFarmer(req, res) {
        try {
            const farmer = await this.farmerBusiness.getFarmer(req.params.id);
            if (!farmer) {
                return res.status(404).send({ error: "Farmer not found" });
            }
            res.status(200).send(farmer);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

module.exports = FarmerController;