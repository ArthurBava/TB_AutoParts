import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function ProdutoDetalhe({ route }) {
  const { produto } = route.params;
  const produtos = [
  {
    id: 1,
    nome: "Filtro de Óleo",
    preco: "R$ 49,90",
    descricao: "Filtro de óleo",

    descricaoCompleta:
      "Filtro de óleo premium para veículos nacionais e importados.",

    imagem: require("./assets/kitamor.webp"),
  },
];

  return (
    <ScrollView style={styles.container}>

      <Image
        source={produto.imagem}
        style={styles.imagem}
      />

      <Text style={styles.nome}>
        {produto.nome}
      </Text>

      <Text style={styles.preco}>
        {produto.preco}
      </Text>

      <Text style={styles.descricao}>
        {produto.descricaoCompleta}
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2e",
    padding: 20,
  },

  imagem: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },

  nome: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  preco: {
    color: "#4CAF50",
    fontSize: 22,
    marginTop: 10,
  },

  descricao: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
});