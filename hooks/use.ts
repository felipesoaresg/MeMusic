import {
    atualizarPedidoCliente,
    criarAvaliacao,
    criarPedidoCliente,
    deletarPedidoCliente,
    deletarPedidoMusico,
    listarAvaliacoes,
    listarPedidos,
    listarPedidosCliente,
} from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ── MÚSICO ──────────────────────────────────────────

export function usePedidosMusico(user: any) {
  return useQuery({
    queryKey: ['pedidos', 'musico'],
    queryFn: () => listarPedidos(user),
    enabled: !!user,
  });
}

export function useAvaliacoes(user: any) {
  return useQuery({
    queryKey: ['avaliacoes'],
    queryFn: () => listarAvaliacoes(user),
    enabled: !!user,
  });
}

export function useDeletarPedidoMusico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id_pedido: number) => deletarPedidoMusico(id_pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'musico'] });
    },
  });
}

// ── CLIENTE ─────────────────────────────────────────

export function usePedidosCliente(id_cliente: number | null) {
  return useQuery({
    queryKey: ['pedidos', 'cliente', id_cliente],
    queryFn: () => listarPedidosCliente(id_cliente!),
    enabled: !!id_cliente,
  });
}

export function useCriarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarPedidoCliente,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'cliente', variables.id_cliente] });
    },
  });
}

export function useAtualizarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_pedido, ...dados }: { id_pedido: number; titulo: string; artista: string; genero: string }) =>
      atualizarPedidoCliente(id_pedido, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useDeletarPedidoCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id_pedido: number) => deletarPedidoCliente(id_pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useCriarAvaliacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarAvaliacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });
}