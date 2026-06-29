import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  StatusBar,
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

export default function NewAccount() {
  const navigation = useNavigation();
  const { signup } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleCriar = async () => {
    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!email.trim()) return setErro("Informe seu e-mail.");
    if (!cpf.trim()) return setErro("Informe seu CPF.");
    if (senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    if (senha !== confSenha) return setErro("As senhas não são iguais.");
    setErro("");
    setCarregando(true);
    try {
      await signup(nome.trim(), email.trim(), senha);
      navigation.navigate("Confirmacao", { nome });
    } catch (e) {
      setErro(e.message || "Não foi possível criar a conta.");
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
      <View style={styles.glow} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.logoContainer, { opacity: fadeAnim }]}
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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>É rápido — só precisamos de alguns dados.</Text>
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
            label="Nome completo"
            icon="person-outline"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />
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
            label="CPF"
            icon="card-outline"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            maxLength={14}
          />
          <Field
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            secure
          />
          <Field
            label="Confirmar senha"
            icon="lock-closed-outline"
            placeholder="Repita a senha"
            value={confSenha}
            onChangeText={setConfSenha}
            secure
          />

          <PrimaryButton
            label="Criar conta"
            onPress={handleCriar}
            loading={carregando}
            style={{ marginTop: 6 }}
          />
          <PrimaryButton
            label="Já tenho conta"
            variant="ghost"
            onPress={() => navigation.navigate("Login")}
          />
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
    paddingVertical: 50,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.brand,
    top: -50,
    left: -50,
    opacity: 0.1,
  },
  logoContainer: { marginBottom: spacing.md, alignItems: "center" },
  logo: { width: 120, height: 120 },
  textContainer: { alignItems: "center", marginBottom: spacing.xl },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: { color: colors.textSecondary, fontSize: 15, textAlign: "center" },
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
});
