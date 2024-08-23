export type User = {
  id: number;
  document: string;
  name: string;
  email: string;
  password: string;
  rolId: number;
  rolName: string;
  createdAt: Date;
  updatedAt: Date;
}