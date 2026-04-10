const API_URL = 'https://api-me-m.vercel.app';

// AUTENTICAÇÃO
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

// CANTOR
export async function registrarCantorNaApi(user) {
  const headers = await getAuthHeader(user);

  console.log('API_URL:', API_URL);
  console.log('Chamando:', `${API_URL}/cantor/login`);

  try {
    const response = await fetch(`${API_URL}/cantor/login`, {
      method: 'POST',
      headers,
    });

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
      throw new Error(data.error || 'Erro ao registrar cantor');
    }

    return data;
  } catch (error) {
    console.log('Erro registrarCantorNaApi:', error);
    throw error;
  }
}

export async function listarPedidos(user) {
  const headers = await getAuthHeader(user);

  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'GET',
      headers,
    });

    const text = await response.text();
    console.log('Status pedidos:', response.status);
    console.log('Resposta pedidos:', text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar pedidos');
    }

    return data;
  } catch (error) {
    console.log('Erro listarPedidos:', error);
    throw error;
  }
}

// CLIENTE
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

    const text = await response.text();
    console.log('Status cliente login:', response.status);
    console.log('Resposta cliente login:', text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao entrar como cliente');
    }

    return data;
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

    const text = await response.text();
    console.log('Status criar pedido:', response.status);
    console.log('Resposta criar pedido:', text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar pedido');
    }

    return data;
  } catch (error) {
    console.log('Erro criarPedidoCliente:', error);
    throw error;
  }
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

export async function listarPedidosCliente(id_cliente) {
  const response = await fetch(`${API_URL}/pedidos/cliente/${id_cliente}`, {
    method: 'GET',
  });

  return await parseResponse(response);
}