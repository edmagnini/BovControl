// src/router/farmerRouter.js
const express = require("express");
const FarmerController = require("../controller/FarmerController");

const farmerRouter = express.Router();
const farmerController = new FarmerController();

farmerRouter.post("/create", (req, res) => farmerController.createFarmer(req, res));

farmerRouter.get("/:id", (req, res) => farmerController.getFarmer(req, res));

module.exports = farmerRouter;
