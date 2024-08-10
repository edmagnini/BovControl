const { connect } = require("./index");
const { ObjectId } = require("mongodb");

class MilkProductionDatabase {
    async createDailyProduction(milkProduction) {
        const db = await connect();

        if (typeof milkProduction.date === 'string') {
            milkProduction.date = new Date(milkProduction.date);
        }
        return db.collection("milkProduction").insertOne(milkProduction);
    }

    async getFarmerDailyNMonthlyProduction(farmId, month) {
        if (typeof farmId !== 'string') {
            throw new Error('Invalid farmId format');
        }

        const monthRegex = /^(0[1-9]|1[0-2])$/;
        if (typeof month !== 'string' || !monthRegex.test(month)) {
            throw new Error('Invalid month format, use "MM"');
        }

        const db = await connect();

        const year = new Date().getFullYear();
        const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        console.log(`Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

        const result = await db.collection("milkProduction").aggregate([
            {
                $match: {
                    farm: farmId,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { day: { $dayOfMonth: "$date" } },
                    totalLiters: { $sum: "$quantity" }
                }
            },
            {
                $group: {
                    _id: null,
                    dailyProduction: { $push: { day: "$_id.day", liters: "$totalLiters" } },
                    monthlyAverage: { $avg: "$totalLiters" }
                }
            },
            {
                $project: {
                    _id: 0,
                    dailyProduction: 1,
                    monthlyAverage: 1
                }
            }
        ]).toArray();

        console.log("Query result:", result);

        return result.length ? result[0] : { dailyProduction: [], monthlyAverage: 0 };
    }

    async deliverProduction(milkProductionId, factoryId) {
        const db = await connect();


        try {
            const result = await db.collection('milkProduction').updateOne(
                { _id: new ObjectId(milkProductionId) },
                {
                    $set: {
                        factory: factoryId
                    }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`Successfully updated production with id ${milkProductionId} and added factory ${factoryId}`);
            } else {
                console.log(`No production found with id ${milkProductionId}`);
            }
        } catch (error) {
            console.error('Error updating production:', error);
            throw error;
        }
    }

    async getMilkPrice(farmId, month) {
        const db = await connect();

        const monthRegex = /^(0[1-9]|1[0-2])$/;
        if (typeof month !== 'string' || !monthRegex.test(month)) {
            throw new Error('Invalid month format, use "MM"');
        }

        const year = new Date().getFullYear();
        const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const productions = await db.collection("milkProduction").find({
            farm: farmId,
            date: { $gte: startDate, $lt: endDate }
        }).toArray();

        const totalVolume = productions.reduce((acc, prod) => acc + prod.quantity, 0);

        const priceBaseFirstHalf = 1.80;
        const priceBaseSecondHalf = 1.95;
        const costPerKmUpTo50 = 0.05;
        const costPerKmAbove50 = 0.06;
        const bonusAbove10000 = 0.01;

        const isFirstHalf = month >= '01' && month <= '06';
        const priceBase = isFirstHalf ? priceBaseFirstHalf : priceBaseSecondHalf;
        const distance = 50;

        const priceUpTo50km = (totalVolume * priceBase) - (costPerKmUpTo50 * distance) + (bonusAbove10000 * (totalVolume > 10000 ? totalVolume : 0));
        const priceAbove50km = (totalVolume * priceBase) - (costPerKmAbove50 * distance) + (bonusAbove10000 * (totalVolume > 10000 ? totalVolume : 0));

        const formatCurrencyBR = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formatCurrencyUS = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        return {
            priceUpTo50km: {
                BRL: formatCurrencyBR(priceUpTo50km),
                USD: formatCurrencyUS(priceUpTo50km)
            },
            priceAbove50km: {
                BRL: formatCurrencyBR(priceAbove50km),
                USD: formatCurrencyUS(priceAbove50km)
            }
        };
    }

    async getMilkPriceMonthly(farmId, month) {
        const db = await connect();
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
    
        const productions = await db.collection('milkProduction').find({
            farm: (farmId),
            date: { $gte: startDate, $lt: endDate }
        }).toArray();
    
    
        return productions;
    }

}


module.exports = MilkProductionDatabase;