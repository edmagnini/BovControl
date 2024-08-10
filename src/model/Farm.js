class Farm {
    constructor(
        name,
        farmCode,
        farmer,
        addres,
        latitude,
        longitude
    ) {
        this.name = name;
        this.farmCode = farmCode;
        this.farmer = farmer;
        this.addres = addres
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = Farm