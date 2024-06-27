export interface IRespuestaHttpEstandar<T> {
  status: number;
  total: number;
  data: T;
}

export interface IStandardHeaders {
  usuariom: string;
}
