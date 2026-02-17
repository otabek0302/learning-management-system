import type { IUser, IUserAvatar } from "./user.interface";

export interface UserDTO {
  _id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: IUserAvatar;
  role: string;
  age?: number;
  gender?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  is_two_factor_enabled?: boolean;
  online?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

type UserSource = IUser | (Record<string, unknown> & { _id: unknown; email: string; profile?: Record<string, unknown>; security?: Record<string, unknown>; preferences?: Record<string, unknown> });

/**
 * Maps Mongoose user document to User DTO (excludes password, formats for API response)
 */
export const toUserDTO = (user: UserSource | null): UserDTO | null => {
  if (!user) return null;

  const doc = typeof (user as IUser).toObject === "function" ? (user as IUser).toObject() : user;
  const { password: _p, ...rest } = doc as Record<string, unknown>;

  const profile = (rest.profile as Record<string, unknown>) || {};
  const security = (rest.security as Record<string, unknown>) || {};
  const preferences = (rest.preferences as Record<string, unknown>) || {};

  return {
    _id: String(rest._id),
    first_name: (profile.first_name as string) ?? "",
    last_name: profile.last_name as string | undefined,
    email: rest.email as string | undefined,
    phone: rest.phone as string | undefined,
    avatar: profile.avatar as UserDTO["avatar"],
    role: rest.role as string,
    age: profile.age as number | undefined,
    gender: profile.gender as string | undefined,
    is_email_verified: security.is_email_verified as boolean,
    is_phone_verified: security.is_phone_verified as boolean,
    is_two_factor_enabled: preferences.two_factor_authentication_enabled as boolean,
    online: rest.online as boolean,
    status: rest.status as string | undefined,
    created_at: rest.created_at ? new Date(rest.created_at as Date).toISOString() : undefined,
    updated_at: rest.updated_at ? new Date(rest.updated_at as Date).toISOString() : undefined,
  };
};
