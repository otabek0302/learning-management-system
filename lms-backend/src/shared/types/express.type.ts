interface IAuthenticatedRequest {
  _id: string;
  email?: string;
  phone?: string;
  role: string;
}

export type RequestUser = IAuthenticatedRequest;
