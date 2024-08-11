const FactoryBaseDatabase = require("../data/FactoryBaseDatabase");
const FarmBaseDatabase = require("../data/FarmBaseDatabase");
const MilkProductionBaseDatabase = require("../data/MilkProductionBaseDatabase")
const MilkProduction = require("../model/MilkProduction")
const calculateDistance = require('../utils/CalculateDistance');
const CustomError = require("../utils/CustomError")

class MilkProductionBusiness {
    constructor() {
        this.milkProductionDatabase = new MilkProductionBaseDatabase()
    }
    async registerDailyProduction(milkProductionData) {
        const milkProduction = new MilkProduction(
            milkProductionData.farm,
            milkProductionData.quantity,
            milkProductionData.date
        )
        if (typeof milkProduction.date === 'string') {
            milkProduction.date = new Date(milkProduction.date);
        }
        if (!milkProduction.farm || !milkProduction.quantity || milkProduction.quantity <= 0 || !milkProduction.date || typeof milkProduction.date === 'string') {
            throw new CustomError(422, "Invalid milk production data");
        }
        const checkFarm = await new FarmBaseDatabase().getFarmById(milkProduction.farm)
        if (!checkFarm) {
            throw new CustomError(422, "Farm not found")
        }
        const parsedDate = new Date(milkProduction.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsedDate > today) {
            throw new CustomError(422, "Date can not be greater than today");
        }
        return this.milkProductionDatabase.createDailyProduction(milkProduction)
    }
    async deliverProduction(milkDeliveryData) {
        const { milkProductionId, factoryId } = milkDeliveryData
        if (!milkProductionId || !factoryId) {
            throw new CustomError(422, "Invalid milk deliver data");
        }
        const checkMilkProd = await this.milkProductionDatabase.getMilkProductionById(milkProductionId)
        if (!checkMilkProd) {
            throw new CustomError(422, "Production milk not found");
        }
        const checkFactory = await new FactoryBaseDatabase().getFactoryById(factoryId)
        if (!checkFactory) {
            throw new CustomError(422, "Factory not found not found");
        }
        return this.milkProductionDatabase.deliverProduction(milkProductionId, factoryId)
    }
    async getDailyNMonthlyProduction(monthlyPayload) {
        const { farmId, month } = monthlyPayload;
        if (!farmId || !month) {
            throw new CustomError(422, "Invalid data parameter");
        }
        const checkFarm = await new FarmBaseDatabase().getFarmById(farmId)
        if (!checkFarm) {
            throw new CustomError(422, "Farm not found")
        }
        const currentMonth = new Date().getMonth() + 1;
        const inputMonth = parseInt(month, 10);
        if (inputMonth > currentMonth) {
            throw new CustomError(422, "Date can not be greater than today");
        }
        const dailyProduction = await this.milkProductionDatabase.getFarmerDailyNMonthlyProduction(farmId, month);
        if (!dailyProduction.length) {
            return { dailyProduction: [], monthlyAverage: 0 };
        }
        const totalQuantity = dailyProduction.reduce((sum, day) => sum + day.quantity, 0);
        const daysInMonth = new Date(new Date().getFullYear(), parseInt(month, 10), 0).getDate();
        const monthlyAverage = totalQuantity / daysInMonth;
        return {
            dailyProduction,
            monthlyAverage
        };
    }
    async calculateMilkPrice(monthPricePayload) {
        const { farmId, month } = monthPricePayload;
        if (!farmId || !month) {
            throw new CustomError(422, "Invalid data parameter");
        }
        const checkFarm = await new FarmBaseDatabase().getFarmById(farmId)
        if (!checkFarm) {
            throw new CustomError(422, "Farm not found")
        }
        const currentMonth = new Date().getMonth() + 1;
        const inputMonth = parseInt(month, 10);
        if (inputMonth > currentMonth) {
            throw new CustomError(422, "Date can not be greater than today");
        }
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        const productions = await this.milkProductionDatabase.getMilkPriceMonthly(farmId, month);
        let totalVolume = 0;
        let totalAmount = 0;
        for (const production of productions) {
            if (!production.factory) {
                continue;
            }
            let basePrice;
            if (startDate.getMonth() < 6) {
                basePrice = 1.80;
            } else {
                basePrice = 1.95;
            }
            const farm = await new FarmBaseDatabase().getFarmById(farmId);
            if (!farm) {
                throw new Error("Farm not found");
            }
            const currentMonth = new Date().getMonth() + 1;
            const inputMonth = parseInt(month, 10);
            if (inputMonth > currentMonth) {
                throw new CustomError(422, "Date can not be greater than today");
            }
            const factory = await new FactoryBaseDatabase().getFactoryById(production.factory);
            if (!factory) {
                throw new Error("Invalid factory");
            }
            const distance = calculateDistance(
                farm.latitude,
                farm.longitude,
                factory.latitude,
                factory.longitude
            );
            let costPerKm = distance >= 50 ? 0.05 : 0.06;
            const distanceCost = costPerKm * distance;
            let bonus = 0;
            if (production.quantity > 10000 && startDate.getMonth() < 6) {
                bonus = 0.01 * production.quantity;
            }
            const price = (production.quantity * basePrice) - distanceCost + bonus;
            totalVolume += production.quantity;
            totalAmount += price;
        }
        const averagePrice = totalVolume > 0 ? totalAmount / totalVolume : 0;
        const priceBR = averagePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const priceEN = averagePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        return { priceBR, priceEN };
    }
    async calculateMilkYearPrice(yearlyPricePayload) {
        const { year, farmId } = yearlyPricePayload;
        if (!farmId || !year) {
            throw new CustomError(422, "Invalid data parameter");
        }
        const farm = await new FarmBaseDatabase().getFarmById(farmId);
        if (!farm) {
            throw new Error("Farm not found");
        }
        const today = new Date();
        const currentYear = today.getFullYear();
        if (year > currentYear) {
            throw new CustomError(422, "Year can not be greater than actual year")
        }
        const months = [
            { month: "01", name: "Jan" },
            { month: "02", name: "Feb" },
            { month: "03", name: "Mar" },
            { month: "04", name: "Apr" },
            { month: "05", name: "May" },
            { month: "06", name: "Jun" },
            { month: "07", name: "Jul" },
            { month: "08", name: "Aug" },
            { month: "09", name: "Sep" },
            { month: "10", name: "Oct" },
            { month: "11", name: "Nov" },
            { month: "12", name: "Dec" }
        ];
        const results = [];
        for (const { month, name } of months) {
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            const productions = await this.milkProductionDatabase.getMilkPriceYearly(farmId, year);
            let totalVolume = 0;
            let totalAmount = 0;
            for (const production of productions) {
                if (production.date >= startDate && production.date < endDate && production.factory) {
                    let basePrice = startDate.getMonth() < 6 ? 1.80 : 1.95;
                    const farm = await new FarmBaseDatabase().getFarmById(farmId);
                    if (!farm) {
                        throw new Error("Invalid farm");
                    }
                    const factory = await new FactoryBaseDatabase().getFactoryById(production.factory);
                    if (!factory) {
                        throw new Error("Invalid factory");
                    }
                    const distance = calculateDistance(
                        farm.latitude,
                        farm.longitude,
                        factory.latitude,
                        factory.longitude
                    );
                    let costPerKm = distance >= 50 ? 0.05 : 0.06;
                    const distanceCost = costPerKm * distance;
                    let bonus = production.quantity > 10000 ? 0.01 * production.quantity : 0;
                    const price = (production.quantity * basePrice) - distanceCost + bonus;
                    totalVolume += production.quantity;
                    totalAmount += price;
                }
            }
            const averagePrice = totalVolume > 0 ? totalAmount / totalVolume : 0;
            const priceBR = averagePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const priceEN = averagePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            results.push({
                month: name,
                priceBR,
                priceEN
            });
        }
        return results;
    }
}

module.exports = MilkProductionBusiness