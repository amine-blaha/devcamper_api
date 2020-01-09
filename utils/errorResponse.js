class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    console.log("inside ErrorResponse contructor".blue);
  }
}

module.exports = ErrorResponse;
