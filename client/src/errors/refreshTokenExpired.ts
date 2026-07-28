// errors/RefreshTokenExpiredError.ts

export class RefreshTokenExpiredError extends Error {
  constructor(message = "Refresh token expired") {
    super(message);
    this.name = "RefreshTokenExpiredError";
  }
}
