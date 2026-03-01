export interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface Guest {
  Name?: string;
  name?: string;
  [key: string]: any;
}
