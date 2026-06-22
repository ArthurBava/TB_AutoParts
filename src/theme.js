// Design system AutoParts — "Industrial Premium"
// Navy profundo + laranja-âmbar de sinalização como acento de marca.
// Tudo centralizado aqui para manter coerência entre as telas.

export const colors = {
  // superfícies (do mais profundo ao mais claro)
  bgDeep: "#0A1422",
  bg: "#0D1B2E",
  surface: "#112240",
  surfaceAlt: "#16263F",
  surfaceHi: "#1C3050",

  // linhas / contornos
  border: "#24364F",
  borderStrong: "#35506E",

  // texto
  text: "#F4F8FC",
  textSecondary: "#9DB2C9",
  textMuted: "#62788F",

  // marca + estados
  brand: "#FF7A1A",
  brandDim: "#C85E12",
  brandSoft: "rgba(255,122,26,0.14)",
  success: "#34D399",
  successSoft: "rgba(52,211,153,0.14)",
  danger: "#FF5A5A",
  dangerSoft: "rgba(255,90,90,0.15)",
  star: "#FFC24B",

  white: "#FFFFFF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

// hierarquia tipográfica — pesos fortes + tracking para dar caráter
export const type = {
  display: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5, color: colors.text },
  title: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3, color: colors.text },
  heading: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { fontSize: 15, fontWeight: "400", color: colors.text },
  bodyMuted: { fontSize: 15, fontWeight: "400", color: colors.textSecondary },
  small: { fontSize: 13, fontWeight: "400", color: colors.textSecondary },
  // rótulos / CTAs — uppercase com espaçamento (cara de "automotivo / sinalização")
  label: { fontSize: 13, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  brand: {
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
};

// símbolos de moeda suportados (backend pode devolver BRL ou USD)
const simbolosMoeda = { BRL: "R$", USD: "US$", EUR: "€" };

// formata valor + moeda de forma robusta no Hermes (sem depender de Intl):
// formatMoney(1234.9, "BRL") -> "R$ 1.234,90"
export const formatMoney = (valor, moeda = "BRL") => {
  const simbolo = simbolosMoeda[moeda] || `${moeda} `;
  const n = Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${simbolo} ${n}`;
};

// retrocompatível: formata em reais
export const formatBRL = (valor) => formatMoney(valor, "BRL");

// aceita tanto require() local quanto URL ("http...") vinda do backend
export const imgSource = (img) =>
  typeof img === "string" ? { uri: img } : img || null;

export default { colors, spacing, radius, type, shadow, formatBRL, formatMoney, imgSource };
