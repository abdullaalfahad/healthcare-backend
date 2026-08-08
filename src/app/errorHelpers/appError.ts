class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
