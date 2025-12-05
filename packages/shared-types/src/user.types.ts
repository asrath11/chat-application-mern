export interface IUser {
  userName: string;
  email: string;
  password?: string; // Optional because it's not always returned
  avatar?: string;
  refreshToken?: string;
  isOnline: boolean;
  lastSeen: Date | string; // Date in backend, string in frontend JSON
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User extends IUser {
  id: string; // Frontend often uses 'id' instead of '_id'
  _id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
  accessToken?: string;
}
