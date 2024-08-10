const express = require("express");
const FactoryController = require("../controller/FactoryController");

const factoryRouter = express.Router();
const factoryController = new FactoryController();

factoryRouter.post("/create", (req, res) => factoryController.createFactory(req, res));

factoryRouter.get("/:id", (req, res) => factoryController.getFactory(req, res));

module.exports = factoryRouter;