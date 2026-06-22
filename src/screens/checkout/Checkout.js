import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { colors, radius, formatMoney, imgSource } from "../../theme";

const labelPagamento = {
  pix: "Pix",
  credito: "Cartão de crédito",
  boleto: "Boleto bancário",
};

const iconePagamento = {
  pix: "qr-code-outline",
  credito: "card-outline",
  boleto: "barcode-outline",
};

export default function Checkout({ route }) {
  const navigation = useNavigation();
  const { itens, subtotal, total, moeda, finalizarPedido } = useCart();
  const { isAuthenticated } = useAuth();
  const pagSel = route?.params?.pagSel || "pix";
  const endereco = route?.params?.endereco || null;
  const textoEndereco = endereco
    ? [
        [endereco.street, endereco.number].filter(Boolean).join(", "),
        [endereco.city, endereco.state].filter(Boolean).join(" / "),
      ].filter(Boolean).join(" — ")
    : "Nenhum endereço selecionado";

  // snapshot em texto gravado no pedido (limitado ao tamanho da coluna, 255)
  const enderecoSnapshot = endereco
    ? [
        endereco.label,
        [endereco.street, endereco.number].filter(Boolean).join(", "),
        endereco.district,
        [endereco.city, endereco.state].filter(Boolean).join("/"),
        endereco.zipCode ? `CEP ${endereco.zipCode}` : null,
        [endereco.recipientName, endereco.phone].filter(Boolean).join(" "),
      ].filter(Boolean).join(" · ").slice(0, 255)
    : null;
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const confirmar = async () => {
    if (!isAuthenticated) {
      setErro("Você precisa estar logado para finalizar a compra.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      const pedido = await finalizarPedido(enderecoSnapshot);
      navigation.navigate("PedidoConfirmado", { pedidoId: pedido?.id });
    } catch (e) {
      setErro(e.message || "Não foi possível concluir o pedido.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Revise e confirme" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.secao}>Itens do pedido</Text>
        {itens.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.imgWrap}>
              {item.imagem ? (
                <Image source={imgSource(item.imagem)} style={styles.img} resizeMode="cover" />
              ) : (
                <Ionicons name="cube-outline" size={24} color={colors.textMuted} />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.itemQtd}>{item.qtd} un. · {item.marca}</Text>
            </View>
            <Text style={styles.itemPreco}>{formatMoney(item.preco * item.qtd, item.moeda)}</Text>
          </View>
        ))}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.brand} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.infoTitulo}>Entrega</Text>
              {endereco?.label ? <Text style={styles.infoTexto}>{endereco.label}</Text> : null}
              <Text style={styles.infoTexto}>{textoEndereco}</Text>
            </View>
          </View>
          <View style={styles.infoDivisor} />
          <View style={styles.infoRow}>
            <Ionicons name={iconePagamento[pagSel] || "card-outline"} size={20} color={colors.brand} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.infoTitulo}>Pagamento</Text>
              <Text style={styles.infoTexto}>{labelPagamento[pagSel]}</Text>
            </View>
          </View>
        </View>

        <View style={styles.resumo}>
          <Linha label="Produtos" valor={formatMoney(subtotal, moeda)} />
          <Linha label="Frete" valor="A combinar" />
          <View style={styles.divisor} />
          <Linha label="Você pagará" valor={formatMoney(total, moeda)} forte />
        </View>

        {erro ? (
          <View style={styles.erroBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Confirmar a compra" onPress={confirmar} loading={enviando} />
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
  secao: { color: colors.text, fontSize: 17, fontWeight: "800", marginHorizontal: 18, marginTop: 14, marginBottom: 12 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: radius.md,
    padding: 10,
  },
  imgWrap: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  itemNome: { color: colors.text, fontSize: 15, fontWeight: "700" },
  itemQtd: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  itemPreco: { color: colors.text, fontSize: 15, fontWeight: "800" },
  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: radius.lg,
    padding: 16,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoTitulo: { color: colors.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  infoTexto: { color: colors.text, fontSize: 14, marginTop: 2 },
  infoDivisor: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  resumo: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: radius.lg,
    padding: 18,
  },
  linha: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  linhaLabel: { color: colors.textSecondary, fontSize: 15 },
  linhaValor: { color: colors.text, fontSize: 15, fontWeight: "600" },
  linhaForte: { color: colors.text, fontSize: 20, fontWeight: "800" },
  divisor: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  erroBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 14,
  },
  erroText: { color: colors.danger, fontSize: 13, fontWeight: "600", flex: 1 },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
