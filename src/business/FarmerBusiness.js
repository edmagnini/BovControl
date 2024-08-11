const FarmerBaseDatabase = require("../data/FarmerBaseDatabase");
const Farmer = require("../model/Farmer");
const HashManager = require("../utils/HashManager")
const CustomError = require("../utils/CustomError")
const Authenticator = require("../utils/Authenticator")


class FarmerBusiness {
    HashManager
    constructor() {
        this.farmerBaseDatabase = new FarmerBaseDatabase();
        this.hashManager = new HashManager()
    }
    async registerFarmer(farmerData) {
        const { password } = farmerData
        const hashedPassword = await this.hashManager.hash(password)
        const farmer = new Farmer(
            farmerData.name,
            farmerData.email,
            hashedPassword
        );
        if (!farmer.name || !farmer.email || !password) {
            throw new CustomError(422, "Invalid farmer data");
        }
        if (!farmer.email.indexOf("@") === -1) {
            throw new CustomError(422, "Invalid email")
        }
        const checkEmail = await this.farmerBaseDatabase.getFarmerByEmail(farmerData.email)
        if (checkEmail) {
            throw new CustomError(404, "Email already exists")
        }
        return this.farmerBaseDatabase.createFarmer(farmer);
    }
    async loginFarmer(credentials) {
        const { email, password } = credentials
        if (!email || !password) {
            throw new CustomError(422, "Invalid farmer data");
        }
        if (!email.indexOf("@") === -1) {
            throw new CustomError(422, "Invalid email")
        }
        const checkEmail = await this.farmerBaseDatabase.getFarmerByEmail(email)
        if (!checkEmail) {
            throw new CustomError(404, "Invalid credentials")
        }
        const cypherPass = await this.hashManager.compare(password, checkEmail.password)
        if (cypherPass) {
            throw new CustomError(404, "Invalid credentials")
        }
        const token = new Authenticator().generateToken({ id: checkEmail._id.toHexString() })
        return { jwtToken: `Bearer ${token}` }
    }
    async getFarmer(poyload) {
        const { id } = poyload
        if (typeof id !== 'string') {
            throw new CustomError(422, 'Invalid ID format');
        }
        return this.farmerBaseDatabase.getFarmerById(id);
    }
}

module.exports = FarmerBusiness;