// ✅ Custom error class for handling operational (expected) errors in your app
// Example usage: throw new AppError("User not found", 404);

class AppError extends Error {
    public readonly statusCode: number;
    // Flag to indicate this is an expected error (not a code bug)
    public readonly isOperational: boolean;

    /**
    * @param message - Error message shown to the user or logged
    * @param statusCode - HTTP status code (defaults to 500 for server errors)
    */
    constructor(message: string, status = 500) {
        // Call the parent Error constructor to set the message
        super(message);
        // 🔧 Fix the prototype chain (important when extending built-in classes like Error)
        // Without this line, "instanceof AppError" may fail in some environments
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = status;
        // Mark the error as "operational" — i.e., it's a known, handled error
        // (not caused by a programming bug)
        this.isOperational = true;
        // 🧩 Captures the stack trace for easier debugging
        // Omits the constructor itself from the trace, so logs are cleaner
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;