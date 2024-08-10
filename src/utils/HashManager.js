import bcrypt from "bcryptjs/dist/bcrypt";

export class HashManager {

    hash = async (
        plainText
    ) => {
        const rounds = Number(process.env.BCRYPT_COST);
        const salt = await bcrypt.genSalt(rounds);
        return bcrypt.hash(plainText, salt)
    }
    compare = async (
        plainText, cypherText
    ) => {
        return bcrypt.compare(plainText, cypherText)
    }
}