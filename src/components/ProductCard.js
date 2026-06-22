import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, radius, shadow, formatMoney, imgSource } from "../theme";
import { useCart } from "../context/CartContext";

// Card de produto horizontal usado no Catálogo e na Busca.
export default function ProductCard({ produto }) {
  const navigation = useNavigation();
  const { adicionar } = useCart();
  const semEstoque = produto.stock != null && produto.stock <= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("ProdutoDetalhe", { produtoId: produto.id, produto })}
    >
      <View style={styles.imageWrap}>
        {produto.imagem ? (
          <Image source={imgSource(produto.imagem)} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name="cube-outline" size={36} color={colors.textMuted} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.cat}>{produto.categoria}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {produto.nome}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {produto.descricao}
        </Text>

        <View style={styles.rating}>
          {produto.avaliacoes > 0 ? (
            <>
              <Ionicons name="star" size={13} color={colors.star} />
              <Text style={styles.ratingText}>{produto.avaliacao.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({produto.avaliacoes})</Text>
            </>
          ) : (
            <Text style={styles.ratingCount}>Sem avaliações</Text>
          )}
          {produto.stock != null && (
            <Text style={[styles.estoque, semEstoque && { color: colors.danger }]}>
              {semEstoque ? "Esgotado" : `${produto.stock} em estoque`}
            </Text>
          )}
        </View>

        <View style={styles.bottom}>
          <Text style={styles.price}>{formatMoney(produto.preco, produto.moeda)}</Text>
          <TouchableOpacity
            style={[styles.add, semEstoque && { opacity: 0.4 }]}
            onPress={() => !semEstoque && adicionar(produto)}
            disabled={semEstoque}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={22} color="#1A0E03" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: radius.lg,
    padding: 12,
    ...shadow.card,
  },
  imageWrap: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  info: { flex: 1, marginLeft: 14, justifyContent: "space-between" },
  cat: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { color: colors.text, fontSize: 16, fontWeight: "700", marginTop: 2 },
  desc: { color: colors.textSecondary, fontSize: 13 },
  rating: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  ratingText: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  ratingCount: { color: colors.textMuted, fontSize: 12 },
  estoque: { color: colors.success, fontSize: 11, fontWeight: "700", marginLeft: 8 },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: { color: colors.text, fontSize: 18, fontWeight: "800" },
  add: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
});
