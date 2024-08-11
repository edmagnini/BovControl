// src/router/farmerRouter.js
const express = require("express");
const FarmerController = require("../controller/FarmerController");

const farmerRouter = express.Router();
const farmerController = new FarmerController();

farmerRouter.post("/create", (req, res) => farmerController.createFarmer(req, res));

farmerRouter.get("/", (req, res) => farmerController.getFarmer(req, res));
farmerRouter.post("/login", (req, res) => farmerController.loginFarmer(req, res));

module.exports = farmerRouter;
