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
            console.log(error)
            res.status(400).send({ error: error.message });
        }
    }

    async getFarm(req, res) {
        try {
            const farm = await this.farmBusiness.getFarm(req.params.id);
            if (!farm) {
                return res.status(404).send({ error: "Farm not found" });
            }
            res.status(200).send(farm);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

module.exports = FarmController;