export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  avatar?: {
    asset_id: string;
    public_id: string;
    public_url: string;
    secure_url: string;
    resource_type: string;
    format: string;
    bytes: number;
  };
  phone?: string;
  email: string;
  role: string;
  isVerified: boolean;
  courses: { _id: string; courseId: string }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
