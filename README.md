<div align="center">

# 🔧 AutoParts — App Mobile

**Marketplace de peças automotivas** · React Native · Expo

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-7-6B52AE?logo=react&logoColor=white)](https://reactnavigation.org)

</div>

---

## 📱 Sobre

App mobile do **AutoParts**: um marketplace de peças e produtos automotivos (FuelTech, turbinas, pistões, freios, suspensão…). O usuário navega no catálogo, busca peças, avalia produtos, monta o carrinho, escolhe endereço e fecha o pedido. Admins cadastram e editam produtos.

O app consome o [backend de microsserviços](../microservices-java%20-%20Copia/) via um **API Gateway** (Spring Cloud).

> 💡 **Design "Industrial Premium":** fundo navy profundo + laranja-âmbar (`#FF7A1A`) como cor de marca/CTA. Tudo vem do design system em `src/theme.js`.

---

## 🚀 Como rodar

Fluxo testado: **backend no Docker** + **app no Expo Go** (celular físico).

### Pré-requisitos
- [Node.js](https://nodejs.org) (LTS) + npm
- [Expo Go](https://expo.dev/go) instalado no celular
- Backend rodando (veja o [README do backend](../microservices-java%20-%20Copia/README.md))
- **PC e celular na mesma rede Wi-Fi**

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Subir o Metro/Expo
npx expo start
```

3. Escaneie o **QR Code** com o app Expo Go.

> 📶 **Mesma rede é obrigatório.** Wi-Fi de faculdade/empresa pode ter *isolamento de cliente* e bloquear a conexão. Nesse caso, ligue o **hotspot do celular** e conecte o PC nele.

### 🌐 Endereço do backend (detecção automática)

Você **não precisa** configurar IP manualmente. O `src/services/config.js` descobre o host automaticamente a partir do servidor Metro/Expo:

| Ambiente | Host detectado |
|---|---|
| Expo Go (celular físico) | IP da máquina na Wi-Fi/hotspot |
| Emulador Android | `10.0.2.2` |
| Web / iOS Simulator | `localhost` |

Ao trocar de rede, o app acompanha sozinho. O gateway é acessado na porta **`8765`**.

> ✅ **Teste de rede rápido** (no navegador do *celular*, antes do app):
> `http://<IP-DA-MÁQUINA>:8765/products?targetCurrency=BRL` → deve retornar JSON.

---

## 🔑 Login e papéis

| Papel | Acesso | Como obter |
|---|---|---|
| **Conta comum** | Compra e avalia produtos | Cadastro (signup) pelo próprio app |
| **Admin** | Cadastra/edita produtos | `admin@admin.dev` / `admin123` (seed) |

> ⚠️ A **sessão não persiste**: fechar o app desloga (o token JWT fica só em memória).

---

## 🗂️ Estrutura

```
src/
├── App.js                      Navegação (NavigationContainer) + providers (Auth, Cart)
├── theme.js                    Design system (cores, spacing, radius, tipografia, helpers)
│
├── services/
│   ├── config.js               API_BASE_URL (detecção automática do host) + TARGET_CURRENCY
│   ├── api.js                  Wrapper fetch (get/post/put/del) — injeta o Bearer token
│   └── adapters.js             adaptProduct(): ProductDTO do backend → shape do app
│
├── context/
│   ├── AuthContext.js          user/token, signin/signup/logout, isAdmin
│   └── CartContext.js          carrinho em memória; finalizarPedido() → POST /ws/orders
│
├── components/
│   ├── PrimaryButton.js        botão (variant primary/secondary/ghost) + loading
│   ├── Field.js                input estilizado (ícone, senha, foco)
│   ├── BottomNav.js            barra inferior (navega + badge do carrinho)
│   ├── ScreenHeader.js         header com voltar + título
│   └── ProductCard.js          card de produto (catálogo/busca)
│
└── screens/
    ├── auth/                   Home · Login · NewAccount · Confirmacao · EsqueciSenha
    ├── catalog/                AutoPart (catálogo) · Busca · ProdutoDetalhe
    ├── checkout/               Carrinho · Verificacao · Checkout · PedidoConfirmado
    ├── orders/                 Historico
    ├── admin/                  CadastroProduto
    └── account/                MeuPerfil · MeusEnderecos · CadastroEndereco · Configuracoes · Menu
```

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Expo SDK 54, React Native 0.81, React 19.1 |
| Navegação | React Navigation 7 (native-stack) |
| HTTP | `fetch` nativo (sem libs externas) |
| Ícones | `@expo/vector-icons` |
| Estado | Context API (Auth + Cart) |

---

## 🎨 Design system

Tudo centralizado em `src/theme.js`: `colors`, `spacing`, `radius`, `type`, `shadow`.

Helpers úteis:
- `formatMoney(valor, moeda)` → ex. `R$ 1.234,90` (robusto no Hermes, sem `Intl`).
- `imgSource(img)` → aceita `require()` local **ou** URL string (`{ uri }`).

> 🧩 **Convenção:** ao criar uma tela nova, **reuse** os componentes e tokens — não duplique `StyleSheet` de cores/medidas.

---

## 🔌 Integração com a API

- Sempre via `src/services/api.js`. Rotas protegidas: passar `{ auth: true }`.
- Produtos passam por `adaptProduct()` antes de chegar aos componentes.
- Preço/moeda: usa `convertedPrice` (se o `currency-service` converteu), senão cai pro preço/moeda original.
- Telas com carregamento exibem `ActivityIndicator` + estado de erro com retry.
- **Exceção ViaCEP:** `CadastroEndereco` chama `https://viacep.com.br/ws/{cep}/json/` **direto** (não via gateway) para autopreencher endereço.

---

## 🐛 Troubleshooting

| Sintoma | Causa provável / solução |
|---|---|
| App não conecta ao backend | PC e celular em redes diferentes → use o hotspot do celular |
| Conecta no Wi-Fi mas sem resposta | Isolamento de cliente do Wi-Fi → hotspot |
| Bundle falha em `index.js` | Falta `babel.config.js` (preset `babel-preset-expo`) |
| Histórico de pedidos quebra | `currency-service` fora do ar (esse endpoint não tem fallback) |
| Deslogou sozinho | Normal — sessão não persiste (token em memória) |

---

<div align="center">
<sub>Trabalho de faculdade · AutoParts 🔧</sub>
</div>
