import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "../../components/BottomNav";
import ProductCard from "../../components/ProductCard";
import { api } from "../../services/api";
import { TARGET_CURRENCY } from "../../services/config";
import { adaptProduct } from "../../services/adapters";
import { colors, radius, spacing } from "../../theme";

export default function AutoPart() {
  const navigation = useNavigation();
  const [pesquisa, setPesquisa] = useState("");
  const [cat, setCat] = useState("Todos");
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    try {
      // size grande para trazer o catálogo todo; filtro/busca acontecem abaixo
      const page = await api.get("/products", {
        params: { targetCurrency: TARGET_CURRENCY, size: 100 },
      });
      const lista = (page?.content || []).map(adaptProduct);
      setProdutos(lista);
    } catch (e) {
      setErro(e.message || "Erro ao carregar produtos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // recarrega ao focar a tela
  React.useEffect(() => {
    const unsub = navigation.addListener("focus", carregar);
    return unsub;
  }, [navigation, carregar]);

  const categorias = useMemo(() => {
    const set = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))];
    return ["Todos", ...set];
  }, [produtos]);

  const lista = useMemo(() => {
    return produtos.filter((p) => {
      const okCat = cat === "Todos" || p.categoria === cat;
      const okBusca =
        !pesquisa ||
        p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (p.marca || "").toLowerCase().includes(pesquisa.toLowerCase());
      return okCat && okBusca;
    });
  }, [produtos, pesquisa, cat]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.header}>
        <Image source={require("../../../assets/img_tb_facul.png")} style={styles.logo} />
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar peças, marcas..."
            placeholderTextColor={colors.textMuted}
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Configuracoes")}
        >
          <Ionicons name="person" size={20} color={colors.brand} />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} size="large" />
          <Text style={styles.centerText}>Carregando catálogo…</Text>
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={styles.erroText}>{erro}</Text>
          <TouchableOpacity style={styles.retry} onPress={carregar}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <ProductCard produto={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={carregar} tintColor={colors.brand} />
          }
          ListHeaderComponent={
            <>
              <View style={styles.banner}>
                <View style={styles.bannerGlow} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTag}>OFERTA DA SEMANA</Text>
                  <Text style={styles.bannerTitle}>Bem-vindo{"\n"}à AutoParts</Text>
                  <Text style={styles.bannerSub}>Catálogo direto do servidor</Text>
                </View>
                <Ionicons name="car-sport" size={64} color={colors.brand} style={{ opacity: 0.9 }} />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {categorias.map((c) => {
                  const ativo = c === cat;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.chip, ativo && styles.chipAtivo]}
                      onPress={() => setCat(c)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  {cat === "Todos" ? "Destaques" : cat}
                </Text>
                <Text style={styles.sectionCount}>{lista.length} itens</Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma peça encontrada.</Text>
            </View>
          }
        />
      )}

      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    gap: 10,
  },
  logo: { width: 42, height: 42, borderRadius: 10 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 30 },
  centerText: { color: colors.textSecondary, fontSize: 14 },
  erroText: { color: colors.textSecondary, fontSize: 14, textAlign: "center" },
  retry: {
    marginTop: 6,
    backgroundColor: colors.brand,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  retryText: { color: "#1A0E03", fontWeight: "800", textTransform: "uppercase", fontSize: 13, letterSpacing: 1 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginHorizontal: 18,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: spacing.lg,
    marginTop: 4,
    overflow: "hidden",
  },
  bannerGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.brand,
    opacity: 0.14,
    right: -40,
    top: -40,
  },
  bannerTag: {
    color: colors.brand,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  bannerTitle: { color: colors.text, fontSize: 22, fontWeight: "800", lineHeight: 26 },
  bannerSub: { color: colors.textSecondary, fontSize: 13, marginTop: 8 },
  chips: { paddingHorizontal: 18, gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAtivo: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: "700" },
  chipTextAtivo: { color: "#1A0E03" },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: "800", letterSpacing: -0.3 },
  sectionCount: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { color: colors.textMuted, fontSize: 15 },
});
