import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { useCart } from "../../context/CartContext";
import { colors, radius, formatMoney, imgSource } from "../../theme";

export default function Carrinho() {
  const navigation = useNavigation();
  const { itens, alterarQtd, remover, subtotal, total, moeda, quantidadeTotal } = useCart();

  if (itens.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ScreenHeader title="Carrinho" />
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={56} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySub}>Adicione peças para vê-las aqui.</Text>
          <PrimaryButton
            label="Explorar peças"
            onPress={() => navigation.navigate("AutoPart")}
            style={{ marginTop: 28, width: "70%" }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title={`Carrinho (${quantidadeTotal})`} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {itens.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imgWrap}>
              {item.imagem ? (
                <Image source={imgSource(item.imagem)} style={styles.img} resizeMode="cover" />
              ) : (
                <Ionicons name="cube-outline" size={30} color={colors.textMuted} />
              )}
            </View>

            <View style={styles.info}>
              <View style={styles.infoTop}>
                <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                <TouchableOpacity onPress={() => remover(item.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={styles.marca}>{item.marca} · {item.categoria}</Text>

              <View style={styles.bottom}>
                <Text style={styles.preco}>{formatMoney(item.preco * item.qtd, item.moeda)}</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => alterarQtd(item.id, -1)}>
                    <Ionicons name="remove" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.qtd}>{item.qtd}</Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => alterarQtd(item.id, 1)}>
                    <Ionicons name="add" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.resumo}>
          <Linha label="Subtotal" valor={formatMoney(subtotal, moeda)} />
          <Linha label="Frete" valor="A combinar" />
          <View style={styles.divisor} />
          <Linha label="Total" valor={formatMoney(total, moeda)} forte />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>{formatMoney(total, moeda)}</Text>
        </View>
        <PrimaryButton
          label="Finalizar"
          style={{ flex: 1, marginLeft: 16 }}
          onPress={() => navigation.navigate("Verificacao")}
        />
      </View>
    </View>
  );
}

const Linha = ({ label, valor, forte }) => (
  <View style={styles.linha}>
    <Text style={[styles.linhaLabel, forte && styles.linhaForte]}>{label}</Text>
    <Text style={[styles.linhaValor, forte && styles.linhaForte]}>{valor}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 12,
  },
  imgWrap: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  info: { flex: 1, marginLeft: 14, justifyContent: "space-between" },
  infoTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nome: { color: colors.text, fontSize: 16, fontWeight: "700", flex: 1 },
  marca: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  preco: { color: colors.text, fontSize: 18, fontWeight: "800" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtd: { color: colors.text, fontSize: 16, fontWeight: "800", minWidth: 20, textAlign: "center" },
  resumo: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: radius.lg,
    padding: 18,
  },
  linha: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  linhaLabel: { color: colors.textSecondary, fontSize: 15 },
  linhaValor: { color: colors.text, fontSize: 15, fontWeight: "600" },
  linhaForte: { color: colors.text, fontSize: 20, fontWeight: "800" },
  divisor: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLabel: { color: colors.textMuted, fontSize: 12 },
  footerTotal: { color: colors.text, fontSize: 22, fontWeight: "800" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, paddingBottom: 80 },
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  emptySub: { color: colors.textMuted, fontSize: 14, marginTop: 6 },
});
