import type { RequestUser } from "@shared/types/express.type";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
