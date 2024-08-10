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
            console.log(error)
            res.status(400).send({ error: error.message })
        }
    }

    async SetMilkDelivery(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.deliverProduction(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            console.log(error)
            res.status(400).send({error: error.message})
        }
    }

    async getDailyNMonthlyProduction(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.getDailyNMonthlyProduction(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            console.log(error)
            res.status(400).send({error: error.message})
        }
    }

    async getMilkProductionMonthlyPrice(req, res) {
        try {
            const milkProduction = await this.milkProductionBusiness.getMilkProductionMonthlyPrice(req.body)
            res.status(201).send(milkProduction)
        } catch (error) {
            console.log(error)
            res.status(400).send({error: error.message})
        }
    }
    async getPriceForMonth (req, res) {
        try {
            const result = await this.milkProductionBusiness.calculateMilkPrice(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error calculating price', error });
        }
    };
}

module.exports = MilkProductionController