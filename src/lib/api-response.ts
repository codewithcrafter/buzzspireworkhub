import { NextResponse } from "next/server";
import { logger } from "./logger";
import crypto from "crypto";

export class ApiResponse {
  /**
   * Generates or retrieves request correlation ID
   */
  static getRequestId(req?: Request): string {
    if (req) {
      const existing = req.headers.get("x-request-id");
      if (existing) return existing;
    }
    return crypto.randomUUID();
  }

  /**
   * Standardize success responses
   */
  static success(data: any, status: number = 200, message: string = "Success", req?: Request) {
    const requestId = this.getRequestId(req);
    const response = NextResponse.json({ success: true, message, requestId, ...data }, { status });
    response.headers.set("X-Request-ID", requestId);
    return response;
  }

  /**
   * Standardize error responses. 
   * NEVER expose internal stack traces to the client.
   */
  static error(message: string, status: number = 500, errorCode?: string, req?: Request) {
    const requestId = this.getRequestId(req);
    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode || 'INTERNAL_ERROR',
          message: message,
          requestId: requestId,
        }
      },
      { status }
    );
    response.headers.set("X-Request-ID", requestId);
    return response;
  }

  /**
   * Log and return a sanitized 500 error
   */
  static serverError(contextMessage: string, error: any, req?: Request) {
    const requestId = this.getRequestId(req);
    logger.error(`[RequestId: ${requestId}] ${contextMessage}`, error);
    return this.error("An internal server error occurred. Please try again later.", 500, "SERVER_ERROR", req);
  }

  /**
   * Standardize 400 Bad Request
   */
  static badRequest(message: string = "Invalid request parameters", req?: Request) {
    return this.error(message, 400, "BAD_REQUEST", req);
  }

  /**
   * Standardize 401 Unauthorized
   */
  static unauthorized(message: string = "Unauthorized access", req?: Request) {
    return this.error(message, 401, "UNAUTHORIZED", req);
  }

  /**
   * Standardize 403 Forbidden
   */
  static forbidden(message: string = "Access forbidden", req?: Request) {
    return this.error(message, 403, "FORBIDDEN", req);
  }

  /**
   * Standardize 404 Not Found
   */
  static notFound(message: string = "Resource not found", req?: Request) {
    return this.error(message, 404, "NOT_FOUND", req);
  }
}
