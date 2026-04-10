export type Cliente = {
  id_cliente: number;
  nm_cliente: string;
};

export type ClienteResponse = {
  status: string;
  cliente: Cliente;
};