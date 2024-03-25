export interface Users {
  id: string;
  email: string;
  password: string;
  privileges: number[];
}

export interface DBResponse {
  message: string;
}
