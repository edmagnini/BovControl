const MilkProductionBusiness = require("../business/MilkProductionBusiness")
const MilkProductionBaseDatabase = require("../data/MilkProductionBaseDatabase")
class MilkProductionController {
    constructor() {
        this.milkProductionBusiness = new MilkProductionBusiness(new MilkProductionBaseDatabase)
    }
    async createDailyMilkProduction(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.registerDailyProduction(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async SetMilkDelivery(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.deliverProduction(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async getDailyNMonthlyProduction(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.getDailyNMonthlyProduction(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    }
    async getPriceForMonth(req, res) {
        try {
            const result = await this.milkProductionBusiness.calculateMilkPrice(req.body);
            res.status(200).json(result);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    };
    async getPriceForYear(req, res) {
        try {
            const result = await this.milkProductionBusiness.calculateMilkYearPrice(req.body);
            res.status(200).json(result);
        } catch (error) {
            const { statusCode, message } = error
            res.status(statusCode || 400).send({ message })
        }
    };
}

module.exports = MilkProductionController