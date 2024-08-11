const { connect } = require("./index");
const { ObjectId } = require("mongodb");

class MilkProductionDatabase {
    async createDailyProduction(milkProduction) {
        try {
            const db = await connect();
            return db.collection("milkProduction").insertOne(milkProduction);
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async getMilkProductionById(id) {
        try {
            const db = await connect();
            return db.collection("milkProduction").findOne({ _id: new ObjectId(id) })
        } catch (error) { throw new Error(error.message) }
    }
    async getFarmerDailyNMonthlyProduction(farmId, month) {
        try {
            const db = await connect();

            if (typeof farmId !== 'string') {
                throw new Error('Invalid farmId format');
            }

            const monthRegex = /^(0[1-9]|1[0-2])$/;
            if (typeof month !== 'string' || !monthRegex.test(month)) {
                throw new Error('Invalid month format, use "MM"');
            }

            const year = new Date().getFullYear();
            const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
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
                        _id: {
                            day: { $dayOfMonth: "$date" }
                        },
                        quantity: { $sum: "$quantity" }
                    }
                },
                {
                    $sort: { "_id.day": 1 }
                }
            ]).toArray();
            return result.length ? result : [];
        } catch (error) {
            throw new Error(error.message)
        }
    }
    async deliverProduction(milkProductionId, factoryId) {
        try {
            const db = await connect();
            const result = await db.collection('milkProduction').updateOne(
                { _id: new ObjectId(milkProductionId) },
                {
                    $set: {
                        factory: factoryId
                    }
                }
            );
            if (result.modifiedCount > 0) {
                return result
            } else {
                throw new Error(error.message)
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getMilkPriceMonthly(farmId, month) {

        try {
            const db = await connect();
            const startDate = new Date(`2024-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);

            const productions = await db.collection('milkProduction').find({
                farm: (farmId),
                date: { $gte: startDate, $lt: endDate }
            }).toArray();


            return productions;
        } catch (error) {
            throw new Error()
        }
    }
    async getMilkPriceYearly(farmId, year) {
        try {
            const db = await connect();
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);

            const productions = await db.collection('milkProduction').find({
                farm: (farmId),
                date: { $gte: startDate, $lt: endDate }
            }).toArray();


            return productions;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = MilkProductionDatabase;