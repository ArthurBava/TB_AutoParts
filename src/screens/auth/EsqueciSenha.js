import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import Field from "../../components/Field";
import PrimaryButton from "../../components/PrimaryButton";
import { colors, spacing } from "../../theme";

export default function EsqueciSenha() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior="padding"
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Recuperar senha" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {enviado ? (
          <View style={styles.successWrap}>
            <View style={styles.iconRing}>
              <Ionicons name="mail-open-outline" size={48} color={colors.brand} />
            </View>
            <Text style={styles.title}>Verifique seu e-mail</Text>
            <Text style={styles.subtitle}>
              Se <Text style={{ color: colors.text }}>{email}</Text> estiver cadastrado,
              enviamos um link para você redefinir a sua senha.
            </Text>
            <PrimaryButton
              label="Voltar ao login"
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 28 }}
            />
          </View>
        ) : (
          <>
            <View style={styles.iconRing}>
              <Ionicons name="lock-closed-outline" size={44} color={colors.brand} />
            </View>
            <Text style={styles.title}>Esqueceu a senha?</Text>
            <Text style={styles.subtitle}>
              Digite o e-mail cadastrado e enviaremos as instruções para criar uma nova.
            </Text>

            <Field
              label="E-mail"
              icon="mail-outline"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginTop: 28, marginBottom: 22 }}
            />

            <PrimaryButton
              label="Enviar link"
              onPress={() => email.trim() && setEnviado(true)}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: "center",
  },
  successWrap: { alignItems: "center", width: "100%" },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
