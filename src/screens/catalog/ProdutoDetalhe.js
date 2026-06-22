import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { TARGET_CURRENCY } from "../../services/config";
import { adaptProduct } from "../../services/adapters";
import { colors, radius, spacing, formatMoney, imgSource } from "../../theme";

function formatarData(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export default function ProdutoDetalhe({ route }) {
  const navigation = useNavigation();
  const { adicionar, quantidadeTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const id = route.params?.produtoId ?? route.params?.produto?.id;
  const [produto, setProduto] = useState(route.params?.produto || null);
  const [reviews, setReviews] = useState({ average: 0, count: 0, items: [] });
  const [qtd, setQtd] = useState(1);
  const [carregando, setCarregando] = useState(true);
  // proporção real da imagem, p/ o banner ter a altura da própria foto
  // (preenche a largura toda sem borda e sem cortar). Default landscape até carregar.
  const [imgRatio, setImgRatio] = useState(1.4);

  // formulário de avaliação
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroReview, setErroReview] = useState("");

  const carregarReviews = useCallback(async () => {
    try {
      const r = await api.get(`/products/${id}/reviews`);
      setReviews(r || { average: 0, count: 0, items: [] });
    } catch {
      /* silencioso: produto pode não ter avaliações */
    }
  }, [id]);

  const carregar = useCallback(async () => {
    try {
      const dto = await api.get(`/products/${id}`, {
        params: { targetCurrency: TARGET_CURRENCY },
      });
      setProduto(adaptProduct(dto));
    } catch {
      /* mantém o produto vindo por params, se houver */
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
    carregarReviews();
  }, [carregar, carregarReviews]);

  // descobre a proporção da imagem (URL remota) p/ ajustar a altura do banner
  useEffect(() => {
    const uri = typeof produto?.imagem === "string" ? produto.imagem : null;
    if (!uri) return;
    let vivo = true;
    Image.getSize(
      uri,
      (w, h) => {
        if (vivo && w > 0 && h > 0) setImgRatio(w / h);
      },
      () => {}
    );
    return () => {
      vivo = false;
    };
  }, [produto?.imagem]);

  const enviarReview = async () => {
    if (nota < 1) {
      setErroReview("Escolha uma nota de 1 a 5.");
      return;
    }
    setErroReview("");
    setEnviando(true);
    try {
      await api.post(
        `/ws/products/${id}/reviews`,
        { rating: nota, comment: comentario.trim() },
        { auth: true }
      );
      setNota(0);
      setComentario("");
      await carregarReviews();
      await carregar();
    } catch (e) {
      setErroReview(e.message || "Não foi possível enviar a avaliação.");
    } finally {
      setEnviando(false);
    }
  };

  if (!produto) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        {carregando ? (
          <ActivityIndicator color={colors.brand} size="large" />
        ) : (
          <>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
            <Text style={styles.centerText}>Produto não encontrado.</Text>
            <PrimaryButton label="Voltar" variant="secondary" onPress={() => navigation.goBack()} style={{ marginTop: 16, width: 200 }} />
          </>
        )}
      </View>
    );
  }

  const especificacoes = [
    { icon: "pricetag-outline", label: "Marca", valor: produto.marca },
    { icon: "construct-outline", label: "Modelo", valor: produto.modelo },
    { icon: "layers-outline", label: "Categoria", valor: produto.categoria },
    { icon: "storefront-outline", label: "Vendedor", valor: produto.vendedor || "—" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.navigate("Carrinho")}>
          <Ionicons name="cart-outline" size={22} color={colors.text} />
          {quantidadeTotal > 0 && (
            <View style={styles.miniBadge}>
              <Text style={styles.miniBadgeText}>{quantidadeTotal}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.imageWrap}>
          {produto.imagem ? (
            <Image source={imgSource(produto.imagem)} style={[styles.imagem, { aspectRatio: imgRatio }]} resizeMode="cover" />
          ) : (
            <Ionicons name="cube-outline" size={80} color="#cfd8e3" />
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.cat}>{produto.categoria}</Text>
          <Text style={styles.nome}>{produto.nome}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text style={styles.ratingText}>
              {reviews.count > 0 ? Number(reviews.average).toFixed(1) : "—"}
            </Text>
            <Text style={styles.ratingCount}>({reviews.count} avaliações)</Text>
            {produto.stock != null && (
              <View style={styles.estoqueTag}>
                <Text style={styles.estoqueTagText}>
                  {produto.stock > 0 ? `${produto.stock} em estoque` : "Esgotado"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.preco}>{formatMoney(produto.preco, produto.moeda)}</Text>
          <Text style={styles.parcela}>
            em até 10x de {formatMoney(produto.preco / 10, produto.moeda)}
          </Text>

          <Text style={styles.descricao}>{produto.descricaoCompleta}</Text>

          <Text style={styles.secao}>Especificações</Text>
          <View style={styles.specGrid}>
            {especificacoes.map((s) => (
              <View key={s.label} style={styles.specItem}>
                <Ionicons name={s.icon} size={18} color={colors.brand} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValor} numberOfLines={1}>{s.valor}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.secao}>Quantidade</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setQtd((q) => Math.max(1, q - 1))}>
              <Ionicons name="remove" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{qtd}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setQtd((q) => q + 1)}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* AVALIAÇÕES */}
          <Text style={styles.secao}>Avaliações ({reviews.count})</Text>

          {/* escrever avaliação */}
          {isAuthenticated ? (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>Deixe sua avaliação</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setNota(n)} hitSlop={6}>
                    <Ionicons
                      name={n <= nota ? "star" : "star-outline"}
                      size={30}
                      color={colors.star}
                      style={{ marginRight: 6 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Conte como foi sua experiência (opcional)"
                placeholderTextColor={colors.textMuted}
                value={comentario}
                onChangeText={setComentario}
                multiline
              />
              {erroReview ? <Text style={styles.reviewErro}>{erroReview}</Text> : null}
              <PrimaryButton label="Enviar avaliação" onPress={enviarReview} loading={enviando} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginPrompt}
              onPress={() => navigation.navigate("Login")}
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.brand} />
              <Text style={styles.loginPromptText}>Entre para avaliar este produto</Text>
            </TouchableOpacity>
          )}

          {/* lista de avaliações */}
          {reviews.items.length === 0 ? (
            <Text style={styles.semReviews}>Ainda não há avaliações. Seja o primeiro!</Text>
          ) : (
            reviews.items.map((c) => (
              <View key={c.id} style={styles.coment}>
                <View style={styles.comentTop}>
                  <Text style={styles.comentNome} numberOfLines={1}>{c.userName}</Text>
                  <View style={{ flexDirection: "row" }}>
                    {[...Array(5)].map((_, s) => (
                      <Ionicons
                        key={s}
                        name="star"
                        size={13}
                        color={s < c.rating ? colors.star : colors.border}
                      />
                    ))}
                  </View>
                </View>
                {c.comment ? <Text style={styles.comentTexto}>{c.comment}</Text> : null}
                <Text style={styles.comentData}>{formatarData(c.createdAt)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addCart}
          onPress={() => {
            adicionar(produto, qtd);
            navigation.navigate("Carrinho");
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="cart" size={22} color={colors.brand} />
        </TouchableOpacity>
        <PrimaryButton
          label="Comprar agora"
          style={{ flex: 1 }}
          onPress={() => {
            adicionar(produto, qtd);
            navigation.navigate("Verificacao");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: "center", justifyContent: "center", gap: 12 },
  centerText: { color: colors.textSecondary, fontSize: 15 },
  topBar: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(13,27,46,0.85)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  miniBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  miniBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  imageWrap: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  // largura total + aspectRatio (definido em runtime) => banner com a altura
  // exata da foto: sem borda e sem corte. maxHeight evita exageros em fotos
  // muito verticais.
  imagem: { width: "100%", maxHeight: 720 },
  body: { padding: spacing.xl },
  cat: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  nome: { color: colors.text, fontSize: 26, fontWeight: "800", letterSpacing: -0.4, marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  ratingText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  ratingCount: { color: colors.textMuted, fontSize: 13 },
  estoqueTag: {
    marginLeft: "auto",
    backgroundColor: colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  estoqueTagText: { color: colors.success, fontSize: 12, fontWeight: "700" },
  preco: { color: colors.text, fontSize: 32, fontWeight: "800", marginTop: 18 },
  parcela: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  descricao: { color: colors.textSecondary, fontSize: 15, lineHeight: 23, marginTop: 18 },
  secao: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 28, marginBottom: 14 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  specItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },
  specLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  specValor: { color: colors.text, fontSize: 14, fontWeight: "700" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 18 },
  stepBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: { color: colors.text, fontSize: 20, fontWeight: "800", minWidth: 30, textAlign: "center" },
  reviewForm: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  reviewFormTitle: { color: colors.text, fontSize: 15, fontWeight: "700", marginBottom: 12 },
  starsRow: { flexDirection: "row", marginBottom: 14 },
  reviewInput: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.text,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  reviewErro: { color: colors.danger, fontSize: 13, marginBottom: 10, fontWeight: "600" },
  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: 16,
  },
  loginPromptText: { color: colors.brand, fontWeight: "700", fontSize: 14 },
  semReviews: { color: colors.textMuted, fontSize: 14, fontStyle: "italic" },
  coment: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  comentTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, gap: 10 },
  comentNome: { color: colors.text, fontSize: 14, fontWeight: "700", flex: 1 },
  comentTexto: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  comentData: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addCart: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
});
