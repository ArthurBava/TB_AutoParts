import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { colors } from "./theme";

import Home from "./screens/auth/Home";
import Login from "./screens/auth/Login";
import NewAccount from "./screens/auth/NewAccount";
import Confirmacao from "./screens/auth/Confirmacao";
import EsqueciSenha from "./screens/auth/EsqueciSenha";
import AutoPart from "./screens/catalog/AutoPart";
import Busca from "./screens/catalog/Busca";
import ProdutoDetalhe from "./screens/catalog/ProdutoDetalhe";
import Carrinho from "./screens/checkout/Carrinho";
import Verificacao from "./screens/checkout/Verificacao";
import Checkout from "./screens/checkout/Checkout";
import PedidoConfirmado from "./screens/checkout/PedidoConfirmado";
import Historico from "./screens/orders/Historico";
import CadastroProduto from "./screens/admin/CadastroProduto";
import Configuracoes from "./screens/account/Configuracoes";
import MeuPerfil from "./screens/account/MeuPerfil";
import MeusEnderecos from "./screens/account/MeusEnderecos";
import CadastroEndereco from "./screens/account/CadastroEndereco";
import Menu from "./screens/account/Menu";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="NewAccount" component={NewAccount} />
            <Stack.Screen name="Confirmacao" component={Confirmacao} />
            <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
            <Stack.Screen name="AutoPart" component={AutoPart} />
            <Stack.Screen name="Busca" component={Busca} />
            <Stack.Screen name="ProdutoDetalhe" component={ProdutoDetalhe} />
            <Stack.Screen name="Carrinho" component={Carrinho} />
            <Stack.Screen name="Verificacao" component={Verificacao} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="PedidoConfirmado" component={PedidoConfirmado} />
            <Stack.Screen name="Historico" component={Historico} />
            <Stack.Screen name="CadastroProduto" component={CadastroProduto} />
            <Stack.Screen name="Configuracoes" component={Configuracoes} />
            <Stack.Screen name="MeuPerfil" component={MeuPerfil} />
            <Stack.Screen name="MeusEnderecos" component={MeusEnderecos} />
            <Stack.Screen name="CadastroEndereco" component={CadastroEndereco} />
            <Stack.Screen name="Menu" component={Menu} />
          </Stack.Navigator>
        </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
