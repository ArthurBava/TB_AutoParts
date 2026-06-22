import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { api } from "../../services/api";
import { colors, radius, spacing } from "../../theme";

const pagamentos = [
  { id: "pix", titulo: "Pix", detalhe: "Aprovação imediata", icon: "qr-code-outline" },
  { id: "credito", titulo: "Cartão de crédito", detalhe: "Em até 10x sem juros", icon: "card-outline" },
  { id: "boleto", titulo: "Boleto", detalhe: "Vence em 3 dias úteis", icon: "barcode-outline" },
];

export default function Verificacao() {
  const navigation = useNavigation();
  const [enderecos, setEnderecos] = useState([]);
  const [endSel, setEndSel] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const r = await api.get("/ws/addresses", { auth: true });
      const arr = Array.isArray(r) ? r : [];
      setEnderecos(arr);
      setEndSel((sel) => sel ?? (arr[0]?.id ?? null));
    } catch {
      setEnderecos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const [pagSel, setPagSel] = useState("pix");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Endereço e pagamento" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* passos */}
        <View style={styles.steps}>
          <Passo n="1" label="Entrega" ativo />
          <View style={styles.stepLine} />
          <Passo n="2" label="Revisão" />
          <View style={styles.stepLine} />
          <Passo n="3" label="Pronto" />
        </View>

        <Text style={styles.secao}>Endereço de entrega</Text>
        {carregando ? (
          <ActivityIndicator color={colors.brand} style={{ marginVertical: 20 }} />
        ) : enderecos.length === 0 ? (
          <View style={styles.vazioBox}>
            <Text style={styles.vazioTxt}>Você ainda não tem endereços cadastrados.</Text>
          </View>
        ) : (
          enderecos.map((e) => {
            const sel = endSel === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                style={[styles.card, sel && styles.cardSel]}
                onPress={() => setEndSel(e.id)}
                activeOpacity={0.85}
              >
                <Ionicons name="location" size={22} color={sel ? colors.brand : colors.textMuted} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitulo}>{e.label || "Endereço"}</Text>
                  <Text style={styles.cardLinha}>{[e.street, e.number].filter(Boolean).join(", ")}</Text>
                  <Text style={styles.cardDetalhe}>{[e.city, e.state].filter(Boolean).join(" / ")}{e.zipCode ? ` · ${e.zipCode}` : ""}</Text>
                  <Text style={styles.cardDetalhe}>{[e.recipientName, e.phone].filter(Boolean).join(" · ")}</Text>
                </View>
                <Radio on={sel} />
              </TouchableOpacity>
            );
          })
        )}
        <TouchableOpacity style={styles.addLink} onPress={() => navigation.navigate("CadastroEndereco")}>
          <Ionicons name="add-circle-outline" size={18} color={colors.brand} />
          <Text style={styles.addLinkText}>Adicionar novo endereço</Text>
        </TouchableOpacity>

        <Text style={styles.secao}>Forma de pagamento</Text>
        {pagamentos.map((p) => {
          const sel = pagSel === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, sel && styles.cardSel]}
              onPress={() => setPagSel(p.id)}
              activeOpacity={0.85}
            >
              <Ionicons name={p.icon} size={22} color={sel ? colors.brand : colors.textMuted} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitulo}>{p.titulo}</Text>
                <Text style={styles.cardDetalhe}>{p.detalhe}</Text>
              </View>
              <Radio on={sel} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continuar"
          onPress={() =>
            navigation.navigate("Checkout", {
              endereco: enderecos.find((e) => e.id === endSel) || null,
              pagSel,
            })
          }
        />
      </View>
    </View>
  );
}

const Passo = ({ n, label, ativo }) => (
  <View style={styles.passo}>
    <View style={[styles.passoBola, ativo && styles.passoBolaAtivo]}>
      <Text style={[styles.passoNum, ativo && { color: "#1A0E03" }]}>{n}</Text>
    </View>
    <Text style={[styles.passoLabel, ativo && { color: colors.text }]}>{label}</Text>
  </View>
);

const Radio = ({ on }) => (
  <View style={[styles.radio, on && styles.radioOn]}>
    {on && <View style={styles.radioDot} />}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  passo: { alignItems: "center", gap: 6 },
  passoBola: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  passoBolaAtivo: { backgroundColor: colors.brand, borderColor: colors.brand },
  passoNum: { color: colors.textMuted, fontWeight: "800", fontSize: 14 },
  passoLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "700" },
  stepLine: { flex: 1, height: 1.5, backgroundColor: colors.border, marginHorizontal: 6, marginBottom: 18 },
  secao: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: radius.lg,
    padding: 16,
  },
  cardSel: { borderColor: colors.brand, backgroundColor: colors.surfaceAlt },
  cardTitulo: { color: colors.text, fontSize: 15, fontWeight: "800" },
  cardLinha: { color: colors.textSecondary, fontSize: 14, marginTop: 3 },
  cardDetalhe: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  addLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 18,
    marginTop: 4,
  },
  addLinkText: { color: colors.brand, fontSize: 14, fontWeight: "700" },
  vazioBox: { marginHorizontal: 18, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg },
  vazioTxt: { color: colors.textSecondary, fontSize: 14, textAlign: "center" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: colors.brand },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.brand },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
