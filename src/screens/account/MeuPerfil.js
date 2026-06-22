import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { colors, radius, spacing, shadow } from "../../theme";

export default function MeuPerfil() {
  const navigation = useNavigation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  // estado deslogado — mesmo padrão de bloqueio das outras telas
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ScreenHeader title="Meu perfil" />
        <View style={styles.bloqueio}>
          <View style={styles.avatarGrande}>
            <Ionicons name="person-outline" size={42} color={colors.brand} />
          </View>
          <Text style={styles.bloqueioTitulo}>Você não está logado</Text>
          <Text style={styles.bloqueioTexto}>
            Faça login para ver e gerenciar os dados da sua conta.
          </Text>
          <PrimaryButton
            label="Entrar"
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: spacing.lg, alignSelf: "stretch" }}
          />
        </View>
      </View>
    );
  }

  const tipoConta = isAdmin ? "Administrador" : "Conta comum";

  const dados = [
    { icon: "person-outline", label: "Nome", valor: user?.name || "—" },
    { icon: "mail-outline", label: "E-mail", valor: user?.email || "—" },
    { icon: "shield-checkmark-outline", label: "Tipo de conta", valor: tipoConta },
    { icon: "finger-print-outline", label: "ID do usuário", valor: String(user?.id ?? "—") },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Meu perfil" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* cartão de identidade */}
        <View style={styles.identidade}>
          <View style={styles.avatarGrande}>
            <Ionicons name="person" size={42} color={colors.brand} />
          </View>
          <Text style={styles.nome}>{user?.name || "Usuário"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>

          <View style={[styles.badge, isAdmin ? styles.badgeAdmin : styles.badgeComum]}>
            <Ionicons
              name={isAdmin ? "construct" : "person-circle-outline"}
              size={14}
              color={isAdmin ? colors.brand : colors.success}
            />
            <Text style={[styles.badgeText, { color: isAdmin ? colors.brand : colors.success }]}>
              {tipoConta}
            </Text>
          </View>
        </View>

        {/* informações da conta */}
        <Text style={styles.grupoTitulo}>Informações da conta</Text>
        <View style={styles.card}>
          {dados.map((d, i) => (
            <View
              key={d.label}
              style={[styles.linha, i < dados.length - 1 && styles.linhaBorder]}
            >
              <View style={styles.linhaIcon}>
                <Ionicons name={d.icon} size={18} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linhaLabel}>{d.label}</Text>
                <Text style={styles.linhaValor} numberOfLines={1}>
                  {d.valor}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* atalho para anunciar (só admin) */}
        {isAdmin && (
          <>
            <Text style={styles.grupoTitulo}>Vender</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.linha}
                onPress={() => navigation.navigate("CadastroProduto")}
                activeOpacity={0.7}
              >
                <View style={styles.linhaIcon}>
                  <Ionicons name="pricetag-outline" size={18} color={colors.brand} />
                </View>
                <Text style={[styles.linhaValor, { flex: 1 }]}>Anunciar uma peça</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* sair */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  // cartão de identidade
  identidade: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  avatarGrande: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  nome: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  email: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  badgeAdmin: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  badgeComum: { backgroundColor: colors.successSoft, borderColor: colors.success },
  badgeText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },

  // grupos / cards
  grupoTitulo: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginHorizontal: 22,
    marginBottom: 10,
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  linha: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  linhaBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  linhaIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  linhaLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  linhaValor: { color: colors.text, fontSize: 15, fontWeight: "600" },

  // estado deslogado
  bloqueio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  bloqueioTitulo: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: spacing.lg,
  },
  bloqueioTexto: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  // sair
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 18,
    marginTop: spacing.xl,
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  logoutText: { color: colors.danger, fontSize: 15, fontWeight: "800" },
});
