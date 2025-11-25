import type { RequestUser } from "./common.types";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};

