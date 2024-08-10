const { app } = require("./app");
const factoryRouter = require("./router/factoryRouter");
const farmerRouter = require("./router/farmerRouter")
const farmRouter = require("./router/farmRouter");
const milkProductionRouter = require("./router/milkProductionRouter");

app.use("/farmer", farmerRouter)
app.use("/farm", farmRouter)
app.use("/milkProd", milkProductionRouter)
app.use("/factory", factoryRouter)

