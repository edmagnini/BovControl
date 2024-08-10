const express = require("express");
const cors = require("cors");
require('dotenv').config();
const swaggerUI = require("swagger-ui-express")


const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup())

const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address();
        console.log(`Server is running in http://localhost:${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
});

module.exports = { app };
