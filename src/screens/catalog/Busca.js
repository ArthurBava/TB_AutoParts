import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "../../components/BottomNav";
import ProductCard from "../../components/ProductCard";
import { api } from "../../services/api";
import { TARGET_CURRENCY } from "../../services/config";
import { adaptProduct } from "../../services/adapters";
import { colors, radius } from "../../theme";

const ordens = [
  { id: "relevancia", label: "Relevância" },
  { id: "menor", label: "Menor preço" },
  { id: "maior", label: "Maior preço" },
  { id: "avaliacao", label: "Mais avaliados" },
];

export default function Busca() {
  const navigation = useNavigation();
  const [termo, setTermo] = useState("");
  const [cat, setCat] = useState("Todos");
  const [ordem, setOrdem] = useState("relevancia");
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const page = await api.get("/products", {
        params: { targetCurrency: TARGET_CURRENCY, size: 100 },
      });
      setProdutos((page?.content || []).map(adaptProduct));
    } catch {
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    carregar();
  }, [carregar]);

  const categorias = useMemo(() => {
    const set = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))];
    return ["Todos", ...set];
  }, [produtos]);

  const resultado = useMemo(() => {
    let r = produtos.filter((p) => {
      const okCat = cat === "Todos" || p.categoria === cat;
      const okTermo =
        !termo ||
        p.nome.toLowerCase().includes(termo.toLowerCase()) ||
        (p.marca || "").toLowerCase().includes(termo.toLowerCase()) ||
        (p.categoria || "").toLowerCase().includes(termo.toLowerCase());
      return okCat && okTermo;
    });
    if (ordem === "menor") r = [...r].sort((a, b) => a.preco - b.preco);
    if (ordem === "maior") r = [...r].sort((a, b) => b.preco - a.preco);
    if (ordem === "avaliacao") r = [...r].sort((a, b) => b.avaliacao - a.avaliacao);
    return r;
  }, [produtos, termo, cat, ordem]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.top}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você procura?"
            placeholderTextColor={colors.textMuted}
            value={termo}
            onChangeText={setTermo}
            autoFocus
          />
          {termo ? (
            <TouchableOpacity onPress={() => setTermo("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      ) : (
        <FlatList
          data={resultado}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <ProductCard produto={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {ordens.map((o) => {
                  const ativo = o.id === ordem;
                  return (
                    <TouchableOpacity
                      key={o.id}
                      style={[styles.ordChip, ativo && styles.ordChipAtivo]}
                      onPress={() => setOrdem(o.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="swap-vertical" size={13} color={ativo ? colors.brand : colors.textMuted} />
                      <Text style={[styles.ordText, ativo && { color: colors.brand }]}>{o.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.count}>
                {resultado.length} resultado{resultado.length !== 1 ? "s" : ""}
                {termo ? ` para "${termo}"` : ""}
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nada encontrado.</Text>
              <Text style={styles.emptySub}>Tente outra peça ou categoria.</Text>
            </View>
          }
        />
      )}

      <BottomNav active="busca" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.brand,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  chips: { paddingHorizontal: 18, gap: 8, paddingTop: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAtivo: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: "700" },
  chipTextAtivo: { color: "#1A0E03" },
  ordChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ordChipAtivo: { borderColor: colors.brand },
  ordText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  count: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 12,
  },
  empty: { alignItems: "center", paddingTop: 70, gap: 8 },
  emptyText: { color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 8 },
  emptySub: { color: colors.textMuted, fontSize: 14 },
});
