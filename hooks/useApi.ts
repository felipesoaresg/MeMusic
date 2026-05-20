import {
    atualizarPedidoCliente,
    buscarClientePorId,
    criarAvaliacao,
    criarPedidoCliente,
    deletarPedidoCliente,
    deletarPedidoMusico,
    listarAvaliacoes,
    listarPedidos,
    listarPedidosCliente,
    loginCliente,
    registrarCantorNaApi,
    validarPedidoNoApex,
} from '@/services/api';
import { useCallback, useState } from 'react';

// ========================================
// TIPOS
// ========================================
interface PedidoPayload {
  titulo: string;
  artista: string;
  genero: string;
}

interface CriarPedidoPayload extends PedidoPayload {
  id_cliente: number;
}

interface AvaliacaoPayload {
  nota: number;
  id_musica: number;
  id_cliente: number;
}

// ========================================
// HOOK PRINCIPAL
// ========================================
export function useApi(user?: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------
  // CANTOR
  // ----------------------------------------
  const registrarCantor = useCallback(
    () => execute(() => registrarCantorNaApi(user)),
    [execute, user]
  );

  const getPedidos = useCallback(
    () => execute(() => listarPedidos(user)),
    [execute, user]
  );

  const getAvaliacoes = useCallback(
    () => execute(() => listarAvaliacoes(user)),
    [execute, user]
  );

  const deletarPedidoDoMusico = useCallback(
    (id_pedido: number) => execute(() => deletarPedidoMusico(id_pedido)),
    [execute]
  );

  // ----------------------------------------
  // CLIENTE
  // ----------------------------------------
  const fazerLoginCliente = useCallback(
    (nome_cliente: string) => execute(() => loginCliente(nome_cliente)),
    [execute]
  );

  const getClientePorId = useCallback(
    (id_cliente: number) => execute(() => buscarClientePorId(id_cliente)),
    [execute]
  );

  const criarPedido = useCallback(
    (dados: CriarPedidoPayload) => execute(() => criarPedidoCliente(dados)),
    [execute]
  );

  const getPedidosCliente = useCallback(
    (id_cliente: number) => execute(() => listarPedidosCliente(id_cliente)),
    [execute]
  );

  const atualizarPedido = useCallback(
    (id_pedido: number, dados: PedidoPayload) =>
      execute(() => atualizarPedidoCliente(id_pedido, dados)),
    [execute]
  );

  const deletarPedido = useCallback(
    (id_pedido: number) => execute(() => deletarPedidoCliente(id_pedido)),
    [execute]
  );

  const avaliar = useCallback(
    (dados: AvaliacaoPayload) => execute(() => criarAvaliacao(dados)),
    [execute]
  );

  // ----------------------------------------
  // APEX
  // ----------------------------------------
  const validarLimiteCliente = useCallback(
    (id_cliente: number) => execute(() => validarPedidoNoApex(id_cliente)),
    [execute]
  );

  return {
    loading,
    error,
    // Cantor
    registrarCantor,
    getPedidos,
    getAvaliacoes,
    deletarPedidoDoMusico,
    // Cliente
    fazerLoginCliente,
    getClientePorId,
    criarPedido,
    getPedidosCliente,
    atualizarPedido,
    deletarPedido,
    avaliar,
    // Apex
    validarLimiteCliente,
  };
}

// ========================================
// HOOKS ESPECIALIZADOS
// ========================================
export function useCantorApi(user: any) {
  const { loading, error, registrarCantor, getPedidos, getAvaliacoes, deletarPedidoDoMusico } =
    useApi(user);

  return { loading, error, registrarCantor, getPedidos, getAvaliacoes, deletarPedidoDoMusico };
}

export function useClienteApi() {
  const {
    loading,
    error,
    fazerLoginCliente,
    getClientePorId,
    criarPedido,
    getPedidosCliente,
    atualizarPedido,
    deletarPedido,
    avaliar,
    validarLimiteCliente,
  } = useApi();

  return {
    loading,
    error,
    fazerLoginCliente,
    getClientePorId,
    criarPedido,
    getPedidosCliente,
    atualizarPedido,
    deletarPedido,
    avaliar,
    validarLimiteCliente,
  };
}