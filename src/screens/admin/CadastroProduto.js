import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import Field from "../../components/Field";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { colors, radius, spacing } from "../../theme";

export default function CadastroProduto() {
  const navigation = useNavigation();
  const { isAuthenticated, isAdmin } = useAuth();

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [price, setPrice] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const salvar = async () => {
    if (!description.trim() || !price.trim()) {
      setErro("Informe ao menos o nome e o preço.");
      return;
    }
    const precoNum = Number(price.replace(",", "."));
    if (Number.isNaN(precoNum) || precoNum <= 0) {
      setErro("Preço inválido.");
      return;
    }
    setErro("");
    setSalvando(true);
    try {
      await api.post(
        "/ws/products",
        {
          description: description.trim(),
          brand: brand.trim(),
          model: model.trim(),
          category: category.trim(),
          currency: currency.trim().toUpperCase() || "BRL",
          price: precoNum,
          imageURL: imageURL.trim(),
        },
        { auth: true }
      );
      setSalvo(true);
      setTimeout(() => navigation.navigate("AutoPart"), 1100);
    } catch (e) {
      setErro(e.message || "Não foi possível publicar a peça.");
    } finally {
      setSalvando(false);
    }
  };

  // bloqueio: rota exige admin (type=0) no backend
  if (!isAuthenticated || !isAdmin) {
    return (
      <View style={styles.containerFull}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ScreenHeader title="Anunciar peça" />
        <View style={styles.bloqueio}>
          <View style={styles.bloqueioIcon}>
            <Ionicons name="shield-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.bloqueioTitle}>Acesso restrito</Text>
          <Text style={styles.bloqueioSub}>
            {isAuthenticated
              ? "Apenas administradores podem cadastrar produtos."
              : "Faça login com uma conta de administrador para cadastrar produtos."}
          </Text>
          {!isAuthenticated && (
            <PrimaryButton
              label="Fazer login"
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 24, width: "70%" }}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior="padding"
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Anunciar peça" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity style={styles.upload} activeOpacity={0.8}>
          <View style={styles.uploadIcon}>
            <Ionicons name="image-outline" size={30} color={colors.brand} />
          </View>
          <Text style={styles.uploadTitle}>Imagem do produto</Text>
          <Text style={styles.uploadSub}>Cole a URL da imagem no campo abaixo</Text>
        </TouchableOpacity>

        <Field
          label="Nome / descrição"
          icon="cube-outline"
          placeholder="Ex.: Kit Amortecedor Dianteiro"
          value={description}
          onChangeText={setDescription}
          style={styles.gap}
        />
        <Field
          label="URL da imagem"
          icon="link-outline"
          placeholder="https://..."
          value={imageURL}
          onChangeText={setImageURL}
          autoCapitalize="none"
          style={styles.gap}
        />

        <View style={styles.row}>
          <Field
            label="Preço"
            icon="pricetag-outline"
            placeholder="0,00"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={[styles.gap, { flex: 2 }]}
          />
          <Field
            label="Moeda"
            placeholder="BRL"
            value={currency}
            onChangeText={setCurrency}
            autoCapitalize="characters"
            maxLength={3}
            style={[styles.gap, { flex: 1 }]}
          />
        </View>

        <Field
          label="Marca"
          icon="ribbon-outline"
          placeholder="Ex.: Cofap"
          value={brand}
          onChangeText={setBrand}
          style={styles.gap}
        />
        <View style={styles.row}>
          <Field
            label="Modelo"
            placeholder="Ex.: Gol G6"
            value={model}
            onChangeText={setModel}
            style={[styles.gap, { flex: 1 }]}
          />
          <Field
            label="Categoria"
            placeholder="Ex.: Suspensão"
            value={category}
            onChangeText={setCategory}
            style={[styles.gap, { flex: 1 }]}
          />
        </View>

        {erro ? (
          <View style={styles.erroBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        ) : null}

        {salvo ? (
          <View style={styles.okBox}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.okText}>Peça publicada com sucesso!</Text>
          </View>
        ) : null}

        <PrimaryButton label="Salvar e publicar" onPress={salvar} loading={salvando} style={{ marginTop: 8 }} />
        <PrimaryButton label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerFull: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 40 },
  upload: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radius.lg,
    paddingVertical: 28,
    marginBottom: spacing.lg,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  uploadSub: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  gap: { marginBottom: 14 },
  row: { flexDirection: "row", gap: 12 },
  erroBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 14,
  },
  erroText: { color: colors.danger, fontWeight: "600", fontSize: 14, flex: 1 },
  okBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 14,
  },
  okText: { color: colors.success, fontWeight: "700", fontSize: 14 },
  bloqueio: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, paddingBottom: 60 },
  bloqueioIcon: {
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
  bloqueioTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  bloqueioSub: { color: colors.textMuted, fontSize: 14, marginTop: 8, textAlign: "center", lineHeight: 20 },
});
