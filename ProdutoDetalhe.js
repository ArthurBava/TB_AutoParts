import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProdutoDetalhe({ route }) {
  const { produto } = route.params;
  const navigation = useNavigation();




  return (
    
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>
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
      <Text style={styles.tituloSecao}>
        Especificações
      </Text>

      <Text style={styles.info}>
        • Marca: Motorcraft
      </Text>

      <Text style={styles.info}>
        • Garantia: 12 meses
      </Text>

      <Text style={styles.info}>
        • Compatibilidade: Diversos veículos
      </Text>

      <Text style={styles.tituloSecao}>
        Comentários
      </Text>

      <View style={styles.comentarioBox}>
        <Text style={styles.comentario}>
          ⭐⭐⭐⭐⭐ Excelente produto!
        </Text>
      </View>

      <View style={styles.comentarioBox}>
        <Text style={styles.comentario}>
          ⭐⭐⭐⭐ Chegou rápido e bem embalado.
        </Text>
      </View>

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
  height: 300,
  borderRadius: 15,
  resizeMode: "contain",
  backgroundColor: "#fff",
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
  voltar: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  tituloSecao: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },

  info: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 5,
  },

  comentarioBox: {
    backgroundColor: "#1a2a3a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  comentario: {
    color: "#fff",
    fontSize: 15,
  },
});