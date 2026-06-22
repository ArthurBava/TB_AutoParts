import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { colors, radius, spacing } from "../../theme";

export default function MeusEnderecos() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const r = await api.get("/ws/addresses", { auth: true });
      setLista(Array.isArray(r) ? r : []);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) carregar();
      else setCarregando(false);
    }, [isAuthenticated, carregar])
  );

  const remover = async (id) => {
    try {
      await api.del(`/ws/addresses/${id}`, { auth: true });
      setLista((l) => l.filter((e) => e.id !== id));
    } catch (e) {
      setErro(e.message || "Não foi possível remover.");
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ScreenHeader title="Meus endereços" />
        <View style={styles.vazio}>
          <Ionicons name="lock-closed-outline" size={42} color={colors.brand} />
          <Text style={styles.vazioTitulo}>Você não está logado</Text>
          <Text style={styles.vazioTexto}>Entre para gerenciar seus endereços.</Text>
          <PrimaryButton label="Entrar" onPress={() => navigation.navigate("Login")} style={{ alignSelf: "stretch", marginTop: spacing.lg }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Meus endereços" />

      {carregando ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.brand} /></View>
      ) : erro ? (
        <View style={styles.vazio}>
          <Ionicons name="alert-circle-outline" size={42} color={colors.danger} />
          <Text style={styles.vazioTexto}>{erro}</Text>
          <PrimaryButton label="Tentar de novo" onPress={carregar} style={{ alignSelf: "stretch", marginTop: spacing.lg }} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, paddingTop: 6 }}>
          {lista.length === 0 ? (
            <View style={styles.vazio}>
              <Ionicons name="location-outline" size={42} color={colors.textMuted} />
              <Text style={styles.vazioTitulo}>Nenhum endereço ainda</Text>
              <Text style={styles.vazioTexto}>Cadastre um endereço para usar no checkout.</Text>
            </View>
          ) : (
            lista.map((e) => (
              <View key={e.id} style={styles.card}>
                <Ionicons name="location" size={22} color={colors.brand} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitulo}>{e.label || "Endereço"}</Text>
                  <Text style={styles.cardLinha}>{[e.street, e.number].filter(Boolean).join(", ")}{e.district ? ` — ${e.district}` : ""}</Text>
                  <Text style={styles.cardDetalhe}>{[e.city, e.state].filter(Boolean).join(" / ")}{e.zipCode ? ` · ${e.zipCode}` : ""}</Text>
                  <Text style={styles.cardDetalhe}>{[e.recipientName, e.phone].filter(Boolean).join(" · ")}</Text>
                </View>
                <View style={{ gap: 10 }}>
                  <TouchableOpacity onPress={() => navigation.navigate("CadastroEndereco", { address: e })} hitSlop={8}>
                    <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => remover(e.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={{ paddingHorizontal: 18, marginTop: spacing.md }}>
            <PrimaryButton
              label="Adicionar endereço"
              onPress={() => navigation.navigate("CadastroEndereco")}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    marginHorizontal: 18, marginBottom: 10, borderRadius: radius.lg, padding: 16,
  },
  cardTitulo: { color: colors.text, fontSize: 15, fontWeight: "800" },
  cardLinha: { color: colors.textSecondary, fontSize: 14, marginTop: 3 },
  cardDetalhe: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  vazio: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl },
  vazioTitulo: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: spacing.md },
  vazioTexto: { color: colors.textSecondary, fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
});
