// Endereço do API Gateway dos microsserviços (porta 8765).
//
// O HOST é descoberto AUTOMATICAMENTE a partir do servidor Metro/Expo:
// como o app (Expo Go / emulador / web) carrega o bundle da SUA MÁQUINA,
// o IP dela vem embutido na URL do bundle (scriptURL). Assim, quando o IP
// da Wi-Fi muda, o app acompanha sozinho — sem precisar editar este arquivo.
//
// Casos cobertos automaticamente:
//   - Expo Go (celular físico) -> IP da máquina na Wi-Fi
//   - Emulador Android         -> 10.0.2.2
//   - Web / iOS Simulator      -> localhost
//
// FALLBACK_HOST só é usado se a detecção falhar (ex.: build de produção
// standalone, sem Metro). Nesse caso, ajuste manualmente abaixo.
import { NativeModules } from "react-native";

const FALLBACK_HOST = "192.168.1.105";

// Extrai o host (IP/hostname) da URL do bundle servido pelo Metro.
// Ex.: "http://192.168.1.105:8081/index.bundle?platform=android" -> "192.168.1.105"
function detectDevHost() {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/^https?:\/\/([^/:]+)/);
      if (match && match[1]) return match[1];
    }
  } catch (e) {
    // ignora e cai no fallback
  }
  return null;
}

const HOST = detectDevHost() || FALLBACK_HOST;

export const API_BASE_URL = `http://${HOST}:8765`;

// Moeda que pedimos ao backend (precisa do currency-service no ar p/ converter).
export const TARGET_CURRENCY = "BRL";
