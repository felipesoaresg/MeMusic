import axios from 'axios';

const clientId = '38f716182f0049cb95eb35e92c4cb8b8';
const clientSecret = '3691d3bbad3e42138b276039953338ae';

export async function getAccessToken(): Promise<string> {
  // 👇 Usa btoa() para gerar a string base64
  const authString = btoa(`${clientId}:${clientSecret}`);

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}
