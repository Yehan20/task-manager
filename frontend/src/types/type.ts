export type status = 'idle' | 'pending' | 'success' | 'error';


export interface UserInfo {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}


export interface NewTask {
  title: string;
  description: string;
  priority: string;
  deadline: Date;
}


export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed_at: string | null;
  deadline: string;
  created_at: string;
  status: string;
}


export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  links?: PaginationLink[];
}


interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}