export type UserType = 'agent' | 'administrator' | 'bot';

export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  name: string;
  last_name: string;
  display_name: string;
  avatar: string | null;
  email: string;
  type: UserType;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  last_name: string;
  display_name?: string;
  email: string;
  password: string;
  type: UserType;
  avatar?: string;
}

export interface CreateBotRequest {
  name: string;
  last_name: string;
  display_name?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
  password?: string;
  type?: UserType;
  avatar?: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UsersListParams {
  page?: number;
  page_size?: number;
  search?: string;
  type?: UserType;
  status?: UserStatus;
}
