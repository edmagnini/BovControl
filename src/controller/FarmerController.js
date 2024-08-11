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
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }

    async getFarmer(req, res) {
        try {
            const farmer = await this.farmerBusiness.getFarmer(req.body);
            res.status(200).send(farmer);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async loginFarmer(req, res) {
        try {
            const farmer = await this.farmerBusiness.loginFarmer(req.body);
            res.status(200).send(farmer);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
}

module.exports = FarmerController;