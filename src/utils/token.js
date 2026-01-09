export async function getDirectLineToken() {
  const tokenEndpoint = import.meta.env.VITE_TOKEN_ENDPOINT;

  if (!tokenEndpoint) {
    throw new Error('VITE_TOKEN_ENDPOINT environment variable is not set');
  }

  const res = await fetch(tokenEndpoint);

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.status}`);
  }

  const data = await res.json();
  return data.token;
}
