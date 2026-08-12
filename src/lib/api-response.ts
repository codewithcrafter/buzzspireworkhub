import { NextResponse } from "next/server";
import { logger } from "./logger";

export class ApiResponse {
  /**
   * Standardize success responses
   */
  static success(data: any, status: number = 200, message: string = "Success") {
    return NextResponse.json({ success: true, message, ...data }, { status });
  }

  /**
   * Standardize error responses. 
   * NEVER expose internal stack traces to the client.
   */
  static error(message: string, status: number = 500, errorCode?: string) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: message,
          code: errorCode || 'INTERNAL_ERROR'
        }
      },
      { status }
    );
  }

  /**
   * Log and return a sanitized 500 error
   */
  static serverError(contextMessage: string, error: any) {
    logger.error(contextMessage, error);
    return this.error("An internal server error occurred. Please try again later.", 500, "SERVER_ERROR");
  }

  /**
   * Standardize 400 Bad Request
   */
  static badRequest(message: string = "Invalid request parameters") {
    return this.error(message, 400, "BAD_REQUEST");
  }

  /**
   * Standardize 401 Unauthorized
   */
  static unauthorized(message: string = "Unauthorized access") {
    return this.error(message, 401, "UNAUTHORIZED");
  }

  /**
   * Standardize 403 Forbidden
   */
  static forbidden(message: string = "Access forbidden") {
    return this.error(message, 403, "FORBIDDEN");
  }

  /**
   * Standardize 404 Not Found
   */
  static notFound(message: string = "Resource not found") {
    return this.error(message, 404, "NOT_FOUND");
  }
}
