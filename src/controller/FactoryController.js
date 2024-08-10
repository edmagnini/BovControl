const FactoryBusiness = require("../business/FactoryBusiness");
const FactoryBaseDatabase = require("../data/FactoryBaseDatabase")

class FactoryController {
    constructor() {
        this.factoryBusiness = new FactoryBusiness(new FactoryBaseDatabase);
    }

    async createFactory(req, res) {
        try {
            const factory = await this.factoryBusiness.registerFactory(req.body);
            res.status(201).send(factory);
        } catch (error) {
            console.log(error)
            res.status(400).send({ error: error.message });
        }
    }

    async getFactory(req, res) {
        try {
            const factory = await this.factoryBusiness.getFactory(req.params.id);
            if (!factory) {
                return res.status(404).send({ error: "factory not found" });
            }
            res.status(200).send(factory);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

module.exports = FactoryController;