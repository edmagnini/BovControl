class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;  // Armazena o código de status na instância
    }
}

module.exports = CustomError