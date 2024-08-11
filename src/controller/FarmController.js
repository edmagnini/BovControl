const FarmBusiness = require("../business/FarmBusiness");
const FarmBaseDatabase = require("../data/FarmBaseDatabase")
const Authenticator = require("../utils/Authenticator")
const FarmerBaseDatabase = require("../data/FarmerBaseDatabase")
const CustomError = require("../utils/CustomError")
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
        try {
            const farm = await this.farmBusiness.getFarm(req.body);
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(200).send(farm);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
}

module.exports = FarmController;