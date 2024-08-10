const express = require("express");
const FarmController = require("../controller/FarmController");

const farmRouter = express.Router();
const farmController = new FarmController();

farmRouter.post("/create", (req, res) => farmController.createFarm(req, res));

farmRouter.get("/:id", (req, res) => farmController.getFarm(req, res));

module.exports = farmRouter;
