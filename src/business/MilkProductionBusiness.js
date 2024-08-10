const FactoryBaseDatabase = require("../data/FactoryBaseDatabase");
const FarmBaseDatabase = require("../data/FarmBaseDatabase");
const MilkProductionBaseDatabase = require("../data/MilkProductionBaseDatabase")
const MilkProduction = require("../model/MilkProduction")
const calculateDistance = require('../utils/CalculateDistance');

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

        if (!milkProduction.farm || !milkProduction.quantity || !milkProduction.date) {
            throw new Error("Invalid milk production data");
        }

        return this.milkProductionDatabase.createDailyProduction(milkProduction)
    }

    async deliverProduction(milkDeliveryData) {
        const { milkProductionId, factoryId } = milkDeliveryData

        if (!milkProductionId || !factoryId) {
            throw new Error("Invalid milk deliver data");
        }

        return this.milkProductionDatabase.deliverProduction(milkProductionId, factoryId)
    }

    async getDailyNMonthlyProduction(monthlyPayload) {
        const { farmId, month } = monthlyPayload
        if (!farmId || !month) {
            throw new Error("Invalid data parameter")
        }

        return this.milkProductionDatabase.getFarmerDailyNMonthlyProduction(farmId, month)
    }

    async getMilkProductionMonthlyPrice(monthlyPricePayload) {
        const { farmId, month } = monthlyPricePayload
        if (!farmId || !month) {
            throw new Error("Invalid data parameter")
        }

        return this.milkProductionDatabase.getMilkPrice(farmId, month)
    }

    async calculateMilkPrice(monthPricePayload) {
        const { farmId, month } = monthPricePayload;
    
        if (!farmId || !month) {
            throw new Error("Invalid data parameter");
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
    
            let bonus = 0;
            if (production.quantity > 10000) {
                bonus = 0.01 * production.quantity;
            }
    
            const price = (production.quantity * basePrice) - distanceCost + bonus;
    
            totalVolume += production.quantity;
            totalAmount += price;

            console.log("total leite " + totalVolume)
            console.log("preço pago amontuado " + totalAmount)
        }
    
        const averagePrice = totalVolume > 0 ? totalAmount / totalVolume : 0;
    
        const priceBR = averagePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const priceEN = averagePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
        return { priceBR, priceEN };
    }
}

module.exports = MilkProductionBusiness