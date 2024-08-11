const FarmBusiness = require("../business/FarmBusiness");
const FarmBaseDatabase = require("../data/FarmBaseDatabase")
class FarmController {
    constructor() {
        this.farmBusiness = new FarmBusiness(new FarmBaseDatabase);
    }
    async createFarm(req, res) {
        try {
            const farm = await this.farmBusiness.registerFarm(req.body);
            res.status(201).send(farm);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async getFarm(req, res) {
        const farm = await this.farmBusiness.getFarm(req.body);
        const userToken = req.headers.authorization
        
        if (!farm) {
            return res.status(404).send({ error: "Farm not found" });
        }
        try {
            res.status(200).send(farm);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
}

module.exports = FarmController;