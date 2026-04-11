const API_URL = 'https://api-me-m.vercel.app';
const APEX_API_URL =
  'https://g85330368fb2b3b-memusicas.adb.sa-saopaulo-1.oraclecloudapps.com/ords/musicas_ws';

// ========================================
// HELPERS
// ========================================
async function getAuthHeader(user) {
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse(response) {
  const text = await response.text();

  console.log('Status:', response.status);
  console.log('Resposta:', text);

  let data = {};

  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }

  if (!response.ok) {
    throw new Error(data.error || 'Erro na API');
  }

  return data;
}

// ========================================
// CANTOR
// ========================================
export async function registrarCantorNaApi(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/cantor/login`);

  try {
    const response = await fetch(`${API_URL}/cantor/login`, {
      method: 'POST',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro registrarCantorNaApi:', error);
    throw error;
  }
}

export async function listarPedidos(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/pedidos`);

  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarPedidos:', error);
    throw error;
  }
}

export async function listarAvaliacoes(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/avaliacoes`);

  try {
    const response = await fetch(`${API_URL}/avaliacoes`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarAvaliacoes:', error);
    throw error;
  }
}

export async function deletarPedidoMusico(id_pedido) {
  console.log('Chamando:', `${API_URL}/pedido/musico/${id_pedido}`);

  try {
    const response = await fetch(`${API_URL}/pedido/musico/${id_pedido}`, {
      method: 'DELETE',
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarPedidoMusico:', error);
    throw error;
  }
}

// ========================================
// CLIENTE
// ========================================
export async function loginCliente(nome_cliente) {
  console.log('Chamando:', `${API_URL}/cliente/login`);

  try {
    const response = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome_cliente }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro loginCliente:', error);
    throw error;
  }
}

export async function criarPedidoCliente({
  id_cliente,
  titulo,
  artista,
  genero,
}) {
  console.log('Chamando:', `${API_URL}/pedido/cliente`);

  try {
    const response = await fetch(`${API_URL}/pedido/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_cliente,
        titulo,
        artista,
        genero,
      }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarPedidoCliente:', error);
    throw error;
  }
}

export async function listarPedidosCliente(id_cliente) {
  console.log('Chamando:', `${API_URL}/pedidos/cliente/${id_cliente}`);

  try {
    const response = await fetch(`${API_URL}/pedidos/cliente/${id_cliente}`, {
      method: 'GET',
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarPedidosCliente:', error);
    throw error;
  }
}

export async function atualizarPedidoCliente(
  id_pedido,
  { titulo, artista, genero }
) {
  console.log('Chamando:', `${API_URL}/pedido/${id_pedido}`);

  try {
    const response = await fetch(`${API_URL}/pedido/${id_pedido}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo,
        artista,
        genero,
      }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro atualizarPedidoCliente:', error);
    throw error;
  }
}

export async function deletarPedidoCliente(id_pedido) {
  console.log('Chamando:', `${API_URL}/pedido/cliente/${id_pedido}`);

  try {
    const response = await fetch(`${API_URL}/pedido/cliente/${id_pedido}`, {
      method: 'DELETE',
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarPedidoCliente:', error);
    throw error;
  }
}

export async function criarAvaliacao({
  nota,
  id_musica,
  id_cliente,
}) {
  console.log('Chamando:', `${API_URL}/avaliacao`);

  try {
    const response = await fetch(`${API_URL}/avaliacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nota,
        id_musica,
        id_cliente,
      }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarAvaliacao:', error);
    throw error;
  }
}

// ========================================
// APEX
// ========================================
export async function validarPedidoNoApex(id_cliente) {
  console.log('Chamando APEX:', `${APEX_API_URL}/limite/check`);

  try {
    const response = await fetch(`${APEX_API_URL}/limite/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_cliente }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro validarPedidoNoApex:', error);
    throw error;
  }
}