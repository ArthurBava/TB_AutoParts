import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Field from "../../components/Field";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing } from "../../theme";

const { width } = Dimensions.get("window");

export default function Login() {
  const navigation = useNavigation();
  const { signin } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      await signin(email.trim(), senha);
      navigation.reset({ index: 0, routes: [{ name: "AutoPart" }] });
    } catch (e) {
      setErro(e.message || "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior="padding"
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.bgCircle1} />
      <View style={styles.glow} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require("../../../assets/img_tb_facul.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Acesse sua conta</Text>
          <Text style={styles.subtitle}>Bom te ver de novo na AutoParts.</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.form,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {erro ? (
            <View style={styles.erroBox}>
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          ) : null}

          <Field
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secure
          />

          <TouchableOpacity
            style={styles.forgot}
            onPress={() => navigation.navigate("EsqueciSenha")}
          >
            <Text style={styles.forgotText}>Esqueci a senha</Text>
          </TouchableOpacity>

          <PrimaryButton label="Entrar" onPress={handleLogin} loading={carregando} />

          <View style={styles.signupRow}>
            <Text style={styles.signupMuted}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("NewAccount")}>
              <Text style={styles.signupLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: 60,
  },
  bgCircle1: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: colors.surface,
    top: -width * 0.55,
    left: -width * 0.1,
    opacity: 0.5,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.brand,
    top: -40,
    right: -60,
    opacity: 0.12,
  },
  logoContainer: { marginBottom: spacing.lg, alignItems: "center" },
  logo: { width: 150, height: 150 },
  textContainer: { alignItems: "center", marginBottom: spacing.xl },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: { color: colors.textSecondary, fontSize: 15 },
  form: { width: "100%", gap: 14 },
  erroBox: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  erroText: { color: colors.danger, textAlign: "center", fontWeight: "700", fontSize: 14 },
  forgot: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: { color: colors.brand, fontSize: 14, fontWeight: "700" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 6 },
  signupMuted: { color: colors.textSecondary, fontSize: 14 },
  signupLink: { color: colors.brand, fontSize: 14, fontWeight: "800" },
});
