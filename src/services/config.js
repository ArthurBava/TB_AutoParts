// Endereço do API Gateway dos microsserviços (porta 8765).
//
// O HOST é descoberto AUTOMATICAMENTE a partir do servidor Metro/Expo:
// como o app (Expo Go / emulador / web) carrega o bundle da SUA MÁQUINA,
// o IP dela vem embutido na URL do bundle. Assim, ao trocar de Wi-Fi/hotspot
// (ou quando o IP muda), o app acompanha sozinho — sem editar este arquivo.
//
// A detecção tenta várias fontes do Expo, em ordem, porque cada versão/modo
// (Expo Go, dev-client, emulador, web) expõe o host em um lugar diferente:
//   1. Constants.expoConfig.hostUri        (SDK 49+, fonte canônica)
//   2. Constants.expoGoConfig.debuggerHost (Expo Go)
//   3. Constants.manifest*/debuggerHost    (versões antigas)
//   4. NativeModules.SourceCode.scriptURL  (URL do bundle Metro)
//
// Casos cobertos automaticamente:
//   - Expo Go (celular físico) -> IP da máquina na Wi-Fi/hotspot
//   - Emulador Android         -> 10.0.2.2
//   - Web / iOS Simulator      -> localhost
//
// FALLBACK_HOST só é usado se TODAS as fontes falharem (ex.: build de produção
// standalone, sem Metro). Para Expo Go, na prática nunca é usado.
import { NativeModules } from "react-native";
import Constants from "expo-constants";

const FALLBACK_HOST = "localhost";

// Extrai só o host (IP/hostname) de uma string como:
//   "http://192.168.1.100:8081/index.bundle?..."  -> "192.168.1.100"
//   "192.168.1.100:8081"                           -> "192.168.1.100"
//   "192.168.1.100"                                -> "192.168.1.100"
function extractHost(value) {
  if (!value || typeof value !== "string") return null;
  const url = value.match(/^https?:\/\/([^/:]+)/);
  if (url && url[1]) return url[1];
  const hostPort = value.match(/^([^/:]+)(?::\d+)?$/);
  if (hostPort && hostPort[1]) return hostPort[1];
  return null;
}

// Percorre todas as fontes conhecidas do Expo e devolve o 1º host válido.
function detectDevHost() {
  const candidates = [
    Constants?.expoConfig?.hostUri,
    Constants?.expoGoConfig?.debuggerHost,
    Constants?.expoGoConfig?.hostUri,
    Constants?.manifest2?.extra?.expoGo?.debuggerHost,
    Constants?.manifest?.debuggerHost,
    Constants?.manifest?.hostUri,
    NativeModules?.SourceCode?.scriptURL,
  ];
  for (const candidate of candidates) {
    const host = extractHost(candidate);
    if (host) return host;
  }
  return null;
}

const HOST = detectDevHost() || FALLBACK_HOST;

export const API_BASE_URL = `http://${HOST}:8765`;

// Moeda que pedimos ao backend (precisa do currency-service no ar p/ converter).
export const TARGET_CURRENCY = "BRL";
