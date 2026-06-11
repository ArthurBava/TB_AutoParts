import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


export default function Menu() {
  const navigation =useNavigation();
  const [pesquisa, setPesquisa] = useState("");


  
  
  const integrantes = [
  {
    nome: "Arthur Bavaresco Spada",
    funcao: " RA-1136264 \n Desenvolvimento Front-End e React Native ",
    imagem: require("./assets/arthur.jpeg"),
  },
  {
    nome: "Mariana Mezzavila Melara",
    funcao: " RA-1136271 \n Desenvolvedora Backend.  ",
   
    
  },
  {
    nome: "Maria Eduarda Schulze",
    funcao: " RA-1136125 \n Lider do Grupo/Designer de UX/UI.",
    imagem: require("./assets/maria.jpeg"),
    
  },
  {
    nome: "Guilherme Tadeu Castellani",
    funcao: " RA-1136257 \n Desenvolvedor Backend.",
    imagem: require("./assets/guilherme.jpeg"),
  },
  {
    nome: "Emanoel Rosa",
    funcao: " RA- 1136489 \n Gestor de Projetos  ",
    imagem: require("./assets/emanoel.jpeg"),
  },
  {
    nome: "Isadora Aguirre Dal Conte",
    funcao: " RA-1136123 \n Desenvolvimento Front-End",
    imagem: require("./assets/izadora.jpeg"),
    
  },
  {
    nome: " Rafaela Bilibio da Silva ",
    funcao: " RA- 1137885 \n Atribuição: \n Engenheiro de Qualidade/Designer de UX/UI ",
    
  },
  
  
];
return (
  <View style={styles.container}>

    <ScrollView showsVerticalScrollIndicator={false}>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("./assets/img_tb_facul.png")}
          style={styles.logoGrande}
          resizeMode="contain"
        />
      </View>

      {/* Integrantes */}
      {integrantes.map((item, index) => (
        <View key={index} style={styles.memberCard}>

          {item.imagem ? (
            <Image
              source={item.imagem}
              style={styles.memberImage}
            />
          ) : (
            <View style={styles.memberImage}>
              <Text>Foto</Text>
            </View>
          )}

          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>
              {item.nome}
            </Text>

            <Text style={styles.memberDescription}>
              {item.funcao}
            </Text>
          </View>

        </View>
      ))}

      <View style={{ height: 100 }} />

    </ScrollView>

    {/* Barra inferior */}
    <View style={styles.bottomBar}>

      <TouchableOpacity onPress={() => navigation.navigate("AutoPart")}>
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
logoContainer: {
  alignItems: "center",
  marginTop: 40,
  marginBottom: 30,
},

logoGrande: {
  width: 220,
  height: 220,
},

memberCard: {
  flexDirection: "row",
  backgroundColor: "#1a2a3a",
  marginHorizontal: 20,
  marginBottom: 15,
  borderRadius: 20,
  padding: 15,
  alignItems: "center",
},

memberImage: {
  width: 90,
  height: 90,
  borderRadius: 10,
},

memberInfo: {
  flex: 1,
  marginLeft: 15,
},

memberName: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
},

memberDescription: {
  color: "#ccc",
  fontSize: 14,
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
},});
