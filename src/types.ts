export interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface Guest {
  id?: number;
  name?: string;
  Name?: string;
  code?: string;
  [key: string]: any;
}
