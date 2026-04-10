export type Pedido = {
  id_pedido: number;
  id_cliente: number;
  id_musica: number;
  nome_cliente: string;
  titulo: string;
  artista: string;
  genero: string;
};

export type CriarPedidoResponse = {
  status: string;
  pedido: Pedido;
};

export type PedidoFila = {
  id: number;
  cliente: string;
  musica: string;
  artista: string;
  genero: string;
};

export type ListarPedidosResponse = {
  usuario_logado: string;
  quantidade: number;
  pedidos: PedidoFila[];
};

export type ListarPedidosClienteResponse = {
  id_cliente: number;
  quantidade: number;
  pedidos: PedidoFila[];
};