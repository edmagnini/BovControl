const MilkProductionBusiness = require("../business/MilkProductionBusiness")
const MilkProductionBaseDatabase = require("../data/MilkProductionBaseDatabase")
const CustomError = require("../utils/CustomError")
const Authenticator = require("../utils/Authenticator")
const FarmerBaseDatabase = require("../data/FarmerBaseDatabase")
class MilkProductionController {
    constructor() {
        this.milkProductionBusiness = new MilkProductionBusiness(new MilkProductionBaseDatabase)
    }
    async createDailyMilkProduction(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.registerDailyProduction(req.body)
            if (!req.headers.authorization) {
                throw new CustomError(401, "Unauthorized");
            }
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async SetMilkDelivery(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.deliverProduction(req.body)
            if (!req.headers.authorization) {
                throw new CustomError(401, "Unauthorized");
            }
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async getDailyNMonthlyProduction(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.getDailyNMonthlyProduction(req.body)
            if (!req.headers.authorization) {
                throw new CustomError(401, "Unauthorized");
            }
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async getPriceForMonth(req, res) {
        try {
            const result = await this.milkProductionBusiness.calculateMilkPrice(req.body);
            if (!req.headers.authorization) {
                throw new CustomError(401, "Unauthorized");
            }
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(200).json(result);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    };
    async getPriceForYear(req, res) {
        try {
            const result = await this.milkProductionBusiness.calculateMilkYearPrice(req.body);
            if (!req.headers.authorization) {
                throw new CustomError(401, "Unauthorized");
            }
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = new Authenticator().getTokenData(token);
            if (!tokenData) {
                throw new CustomError(401, "Unauthorized");
            }
            const farmer = await new FarmerBaseDatabase().getFarmerById(tokenData.id)
            if (!farmer) {
                throw new CustomError(404, "Farmer not found")
            }
            res.status(200).json(result);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    };
}

module.exports = MilkProductionController