import { API_BASE_URL } from "./config";

// Token JWT em memória (setado no login). Some ao fechar o app —
// para manter a sessão seria preciso persistir (ex.: AsyncStorage).
let authToken = null;
export const setAuthToken = (t) => {
  authToken = t;
};
export const getAuthToken = () => authToken;

function buildUrl(path, params) {
  let url = API_BASE_URL + path;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    if (qs) url += (path.includes("?") ? "&" : "?") + qs;
  }
  return url;
}

async function request(path, { method = "GET", body, auth = false, params } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    if (!authToken) throw new Error("Você precisa estar logado.");
    headers.Authorization = "Bearer " + authToken;
  }

  let res;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o backend está no ar e o endereço em services/config.js."
    );
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // backend às vezes responde texto puro (mensagens de erro)
  }

  if (!res.ok) {
    const msg =
      typeof data === "string" && data
        ? data
        : data?.message || `Erro ${res.status}`;
    if (res.status === 401) throw new Error(msg || "Não autorizado.");
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
