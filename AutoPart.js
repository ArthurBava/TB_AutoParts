import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export default function AutoPart() {
  const [pesquisa, setPesquisa] = useState("");
  const navigation = useNavigation();
  const produtos = [
    {
      id: 1,
      nome: "Kit Amortecedor",
      descricao: "Kit completo de amortecedores",
      descricaoCompleta:
        "Kit completo de amortecedores para veículos nacionais e importados.",
      preco: "R$ 1.120,90",
      imagem: require("./assets/kitamort.webp"),
    },
  ];

 

  return (
    <View style={styles.container}>


      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require("./assets/img_tb_facul.png")}
          style={styles.logo}
        />

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
     
     {/*Botão do sininho*/}
    {/*<TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>*/}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Área de promoções, avisos e novidades
          </Text>
        </View>

        {/* Produtos */}
        {produtos.map((item) => (
      <TouchableOpacity
          key={item.id}
          style={styles.productCard}
          onPress={() =>
          navigation.navigate("ProdutoDetalhe", {
            produto: item,
        })
        }
        >
        <View style={styles.productImage}>
          <Text>Imagem</Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>
            {item.nome}
          </Text>

          <Text style={styles.productDescription}>
            {item.descricao}
          </Text>

          <Text style={styles.productPrice}>
            {item.preco}
          </Text>
        </View>
      </TouchableOpacity>
))} 
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.bottomBar}>

        <TouchableOpacity>
          <Ionicons name="home" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="star" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="chatbox-outline" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1b2e",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    gap: 10,
  },

  logo: {
    width: 40,
    height: 40,
  },

  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 18,
  },

  banner: {
    backgroundColor: "#8b8b8b",
    marginHorizontal: 20,
    borderRadius: 15,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  bannerText: {
    textAlign: "center",
    paddingHorizontal: 20,
  },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#1a2a3a",
    marginHorizontal: 18,
    marginBottom: 15,
    borderRadius: 20,
    padding: 12,
  },

  productImage: {
    width: 110,
    height: 110,
    backgroundColor: "#8b8b8b",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },

  productTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  productDescription: {
    color: "#ccc",
    fontSize: 14,
  },

  productPrice: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#d9d9d9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  cartButton: {
    marginTop: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
