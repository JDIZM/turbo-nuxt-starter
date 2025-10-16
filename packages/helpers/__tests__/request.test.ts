import { describe, it, expect, vi } from "vitest"
import {
  getIpFromRequest,
  asyncHandler,
  type RequestLike,
  type Request,
  type Response,
  type NextFunction
} from "../src/request"

describe("Request Helpers", () => {
  describe("getIpFromRequest", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const req = {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1"
        },
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("192.168.1.1")
    })

    it("should extract IP from x-real-ip header", () => {
      const req = {
        headers: {
          "x-real-ip": "192.168.1.2"
        },
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("192.168.1.2")
    })

    it("should fall back to req.ip if no proxy headers", () => {
      const req = {
        headers: {},
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("127.0.0.1")
    })

    it("should return empty string if no IP found", () => {
      const req = {
        headers: {}
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("")
    })

    it("should prefer x-real-ip over x-forwarded-for (order matters)", () => {
      const req = {
        headers: {
          "x-forwarded-for": "192.168.1.1",
          "x-real-ip": "192.168.1.2"
        },
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("192.168.1.2")
    })

    it("should handle x-forwarded-for with single IP", () => {
      const req = {
        headers: {
          "x-forwarded-for": "192.168.1.1"
        },
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("192.168.1.1")
    })
  })

  describe("asyncHandler", () => {
    it("should execute async function successfully", async () => {
      const mockStatus = vi.fn().mockReturnThis()
      const mockJson = vi.fn()
      const mockRes = {
        status: mockStatus,
        json: mockJson
      }

      const asyncFn = vi.fn(async (_req: Request, res: Response, _next: NextFunction) => {
        res.status(200).json({ success: true })
      })

      const req = {} as Request
      const res = mockRes as unknown as Response
      const next = vi.fn() as NextFunction

      const handler = asyncHandler(asyncFn)
      await handler(req, res, next)

      expect(asyncFn).toHaveBeenCalledWith(req, res, next)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({ success: true })
      expect(next).not.toHaveBeenCalled()
    })

    it("should catch errors and pass to next", async () => {
      const error = new Error("Test error")
      const asyncFn = vi.fn(async (_req: Request, _res: Response, _next: NextFunction) => {
        throw error
      })

      const req = {} as Request
      const res = {} as Response
      const next = vi.fn() as NextFunction

      const handler = asyncHandler(asyncFn)
      await handler(req, res, next)

      expect(asyncFn).toHaveBeenCalledWith(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })

    it("should handle Promise rejection", async () => {
      const error = new Error("Rejected")
      const asyncFn = vi.fn(() => Promise.reject(error))

      const req = {} as Request
      const res = {} as Response
      const next = vi.fn() as NextFunction

      const handler = asyncHandler(asyncFn)
      await handler(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })

    it("should preserve request and response context", async () => {
      let capturedReq: Request | null = null
      let capturedRes: Response | null = null

      const asyncFn = vi.fn(async (req: Request, res: Response) => {
        capturedReq = req
        capturedRes = res
      })

      const req = { body: { test: "data" } } as Request
      const res = { locals: { user: "test" } } as unknown as Response
      const next = vi.fn() as NextFunction

      const handler = asyncHandler(asyncFn)
      await handler(req, res, next)

      expect(capturedReq).toBe(req)
      expect(capturedRes).toBe(res)
    })
  })

  describe("Express Integration", () => {
    it("should work with Express Request type", async () => {
      // Import Express types dynamically to test compatibility
      const mockExpressReq = {
        headers: {
          "x-forwarded-for": "203.0.113.45"
        },
        ip: "::1"
      } as RequestLike

      const ip = getIpFromRequest(mockExpressReq)
      expect(ip).toBe("203.0.113.45")
    })

    it("should work with cloudflare cf-connecting-ip header", () => {
      const req = {
        headers: {
          "cf-connecting-ip": "198.51.100.22"
        },
        ip: "127.0.0.1"
      } as RequestLike

      expect(getIpFromRequest(req)).toBe("198.51.100.22")
    })
  })
})
