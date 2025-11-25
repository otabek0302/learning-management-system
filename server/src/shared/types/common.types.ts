/** User object shape for Express Request.user */
export interface RequestUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  isVerified?: boolean;
  [key: string]: any;
}

