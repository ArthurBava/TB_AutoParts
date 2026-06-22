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
import BottomNav from "../../components/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { colors, radius, spacing } from "../../theme";

const grupos = [
  {
    titulo: "Conta",
    itens: [
      { icon: "person-outline", label: "Meu perfil", rota: "MeuPerfil" },
      { icon: "receipt-outline", label: "Minhas compras", rota: "Historico" },
      { icon: "location-outline", label: "Meus endereços", rota: "MeusEnderecos" },
      { icon: "notifications-outline", label: "Notificações", rota: null },
    ],
  },
  {
    titulo: "Vender",
    itens: [
      { icon: "pricetag-outline", label: "Anunciar uma peça", rota: "CadastroProduto" },
      { icon: "cube-outline", label: "Meus anúncios", rota: null },
    ],
  },
  {
    titulo: "Sobre",
    itens: [
      { icon: "people-outline", label: "Equipe do projeto", rota: "Menu" },
      { icon: "help-circle-outline", label: "Ajuda e suporte", rota: null },
    ],
  },
];

export default function Configuracoes() {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.title}>Configurações</Text>

        {/* perfil */}
        <View style={styles.perfil}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={colors.brand} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.perfilNome}>
              {isAuthenticated ? user?.name || "Usuário" : "Visitante"}
            </Text>
            <Text style={styles.perfilEmail}>
              {isAuthenticated ? user?.email || "" : "Faça login para ver seu perfil"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {grupos.map((g) => (
          <View key={g.titulo} style={styles.grupo}>
            <Text style={styles.grupoTitulo}>{g.titulo}</Text>
            <View style={styles.grupoCard}>
              {g.itens.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.item, i < g.itens.length - 1 && styles.itemBorder]}
                  onPress={() => item.rota && navigation.navigate(item.rota)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemIcon}>
                    <Ionicons name={item.icon} size={20} color={colors.brand} />
                  </View>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* logout */}
        <TouchableOpacity
          style={styles.logout}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versao}>AutoParts · versão 1.0.0</Text>
      </ScrollView>

      <BottomNav active="mais" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 18,
  },
  perfil: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    borderRadius: radius.lg,
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  perfilNome: { color: colors.text, fontSize: 18, fontWeight: "800" },
  perfilEmail: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  grupo: { marginTop: spacing.xl },
  grupoTitulo: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginHorizontal: 22,
    marginBottom: 10,
  },
  grupoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  item: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 15 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  itemLabel: { flex: 1, color: colors.text, fontSize: 15, fontWeight: "600" },
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
  versao: { color: colors.textMuted, fontSize: 12, textAlign: "center", marginTop: 20 },
});
