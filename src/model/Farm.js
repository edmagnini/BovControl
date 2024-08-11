class Farm {
    constructor(
        name,
        farmCode,
        farmer,
        address,
        latitude,
        longitude
    ) {
        this.name = name;
        this.farmCode = farmCode;
        this.farmer = farmer;
        this.address = address
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = Farm