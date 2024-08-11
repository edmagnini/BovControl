const express = require("express")
const MilkProductionController = require("../controller/MilkProductionController")

const milkProductionRouter = express.Router()
const milkProductionController = new MilkProductionController()

milkProductionRouter.post("/createDailyProd", (req, res) => milkProductionController.createDailyMilkProduction(req, res))
milkProductionRouter.get("/getMonthProd", (req, res) => milkProductionController.getDailyNMonthlyProduction(req, res))
milkProductionRouter.patch("/setMilkerDelivery", (req, res) => milkProductionController.SetMilkDelivery(req, res))
milkProductionRouter.get("/getMilkPriceMonthly", (req, res) => milkProductionController.getPriceForMonth(req, res))
milkProductionRouter.get("/getMilkPriceYearly", (req, res) => milkProductionController.getPriceForYear(req, res))

module.exports = milkProductionRouter