declare global {
  namespace Express {
    interface User {
      _id: string;
      role?: string;
      email?: string;
      phone?: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
