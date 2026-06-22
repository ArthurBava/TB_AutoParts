import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "../../components/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { TARGET_CURRENCY } from "../../services/config";
import { colors, radius, formatMoney, imgSource } from "../../theme";

const formatarData = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

export default function Historico() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!isAuthenticated) {
      setCarregando(false);
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      const page = await api.get("/ws/orders", {
        params: { targetCurrency: TARGET_CURRENCY, size: 50 },
        auth: true,
      });
      setPedidos(page?.content || []);
    } catch (e) {
      setErro(e.message || "Erro ao carregar pedidos.");
    } finally {
      setCarregando(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", carregar);
    return unsub;
  }, [navigation, carregar]);

  const renderConteudo = () => {
    if (!isAuthenticated) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="lock-closed-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Entre para ver seus pedidos</Text>
          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.ctaText}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (carregando) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      );
    }
    if (erro) {
      return (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptySub}>{erro}</Text>
          <TouchableOpacity style={styles.cta} onPress={carregar}>
            <Text style={styles.ctaText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (pedidos.length === 0) {
      return (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={52} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptySub}>Suas compras aparecerão aqui.</Text>
          <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate("AutoPart")}>
            <Text style={styles.ctaText}>Explorar peças</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {pedidos.map((p) => {
          const itens = p.items || [];
          const totalItens = itens.reduce((s, i) => s + (i.quantity || 0), 0);
          const total = p.totalConvertedPrice > 0 ? p.totalConvertedPrice : p.totalPrice;
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.pedidoNum}>Pedido #{String(p.id).slice(-6)}</Text>
                  <Text style={styles.pedidoData}>{formatarData(p.orderDate)}</Text>
                </View>
                <View style={styles.statusTag}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Em separação</Text>
                </View>
              </View>

              <View style={styles.thumbs}>
                {itens.slice(0, 4).map((item, i) => (
                  <View key={i} style={styles.thumb}>
                    {item.product?.imageURL ? (
                      <Image source={imgSource(item.product.imageURL)} style={styles.thumbImg} resizeMode="cover" />
                    ) : (
                      <Ionicons name="cube-outline" size={22} color={colors.textMuted} />
                    )}
                  </View>
                ))}
                {itens.length > 4 && (
                  <View style={[styles.thumb, styles.thumbMais]}>
                    <Text style={styles.thumbMaisText}>+{itens.length - 4}</Text>
                  </View>
                )}
              </View>

              {p.deliveryAddress ? (
                <View style={styles.entregaRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.entregaText} numberOfLines={2}>{p.deliveryAddress}</Text>
                </View>
              ) : null}

              <View style={styles.cardBottom}>
                <Text style={styles.totalLabel}>{totalItens} itens</Text>
                <Text style={styles.totalValor}>{formatMoney(total, TARGET_CURRENCY)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus pedidos</Text>
        <Text style={styles.headerSub}>{pedidos.length} compra{pedidos.length !== 1 ? "s" : ""}</Text>
      </View>

      {renderConteudo()}

      <BottomNav active="pedidos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  headerTitle: { color: colors.text, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  headerSub: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: radius.lg,
    padding: 16,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  pedidoNum: { color: colors.text, fontSize: 16, fontWeight: "800" },
  pedidoData: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  statusText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  thumbs: { flexDirection: "row", gap: 8, marginTop: 16 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%" },
  thumbMais: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  thumbMaisText: { color: colors.textSecondary, fontWeight: "800", fontSize: 14 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  entregaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 },
  entregaText: { color: colors.textMuted, fontSize: 12, flex: 1 },
  totalLabel: { color: colors.textSecondary, fontSize: 14 },
  totalValor: { color: colors.text, fontSize: 18, fontWeight: "800" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 60, gap: 8 },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  emptySub: { color: colors.textMuted, fontSize: 14, marginTop: 6, textAlign: "center", paddingHorizontal: 30 },
  cta: {
    marginTop: 24,
    backgroundColor: colors.brand,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  ctaText: { color: "#1A0E03", fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", fontSize: 13 },
});
