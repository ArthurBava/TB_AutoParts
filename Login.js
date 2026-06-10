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
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import EsqueciSenha from "./EsqueciSenha";

const { width } = Dimensions.get("window");

export default function Login() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    

    useEffect(() => {
    Animated.parallel([
    Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 900,
    useNativeDriver: false,
    }),

    Animated.timing(slideAnim, {
    toValue: 0,
    duration: 700,
    useNativeDriver: false,
    }),

    Animated.spring(logoScale, {
    toValue: 1,
    friction: 5,
    tension: 80,
    useNativeDriver: false,
    }),
    ]).start();
    }, []);


      const handleemail = () => {
        navigation.navigate("Email")
      };
    
    
      const handleForgotPassword = () => {
        console.log("Senha");
      };

      const handleesqueciaSenha = () => {
        navigation.navigate("EsqueciSenha");
      };
      const handleLogin = () => {
        console.log("clicou");

        navigation.navigate("AutoPart");
      };

      return (
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#0d1b2e"
          />
    
          {/* Background */}
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />
    
          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require("./assets/img_tb_facul.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
    
          {/* Textos */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.welcomeTitle}>
              Bem-vindo à AutoParts!
            </Text>
    
            <Text style={styles.welcomeSubtitle}>
              Faça aqui o seu login{"\n"}
              
            </Text>
          </Animated.View>
    
          {/* Botões */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >


    
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#a0b4c8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
             autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#a0b4c8"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />

            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
            <Ionicons
              name={mostrarSenha ? "eye-off" : "eye"}
              size={24}
              color="#a0b4c8"
              />
            </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
            <Text style={styles.emailButtonText}>
              Entrar
            </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
            style={styles.esqueciaSenhaButton}
            onPress={handleesqueciaSenha}
            activeOpacity={0.85}>
            
            <Text style={styles.esqueciaSenhaButtonText}>
              Esqueci a Senha!
            </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );


}
const styles = StyleSheet.create({
  input: {
  width: "100%",
  backgroundColor: "#112240",
  borderWidth: 1.5,
  borderColor: "#4a6080",
  borderRadius: 30,
  paddingHorizontal: 20,
  paddingVertical: 15,
  color: "#fff",
  fontSize: 16,
  },

  container: {
    flex: 1,
    backgroundColor: "#0d1b2e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    overflow: "hidden",
  },

  bgCircle1: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: "#112240",
    top: -width * 0.5,
    left: -width * 0.1,
    opacity: 0.6,
  },

  bgCircle2: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#0a1628",
    bottom: -width * 0.3,
    right: -width * 0.2,
    opacity: 0.8,
  },

  logoContainer: {
    marginBottom: 32,
    alignItems: "center",

    shadowColor: "#e87722",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 12,
  },

  logo: {
    width: 220,
    height: 220,
  },

  textContainer: {
    alignItems: "center",
    marginBottom: 36,
  },

  welcomeTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  welcomeSubtitle: {
    color: "#a0b4c8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 14,
  },

  emailButton: {
    width: "100%",
    backgroundColor: "#4a6080",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",

    borderWidth: 1.5,
    borderColor: "#5a7090",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  emailButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  ForgotpasswordButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",

    borderWidth: 1.5,
    borderColor: "#4a6080",
  },

  passwordButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },

  esqueciaSenhaButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",

    
    borderColor: "#4a6080",
  },

  esqueciaSenhaButtonText: {
    color: "#0000FF",
    fontSize: 20,
    fontWeight: "200"
  },
  
  passwordContainer: {
  width: "100%",
  backgroundColor: "#112240",
  borderWidth: 1.5,
  borderColor: "#4a6080",
  borderRadius: 30,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
},

passwordInput: {
  flex: 1,
  color: "#fff",
  fontSize: 16,
  paddingVertical: 15,
},


});