import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";
import { colors, radius, spacing } from "../../theme";

// Tela "Sobre" — equipe do projeto.
const integrantes = [
  { nome: "Maria Eduarda Schulze", ra: "1136125", funcao: "Líder · Designer UX/UI", imagem: require("../../../assets/maria.jpeg") },
  { nome: "Arthur Bavaresco Spada", ra: "1136264", funcao: "Front-End · React Native", imagem: require("../../../assets/arthur.jpeg") },
  { nome: "Isadora Aguirre Dal Conte", ra: "1136123", funcao: "Front-End", imagem: require("../../../assets/izadora.jpeg") },
  { nome: "Mariana Mezzavila Melara", ra: "1136271", funcao: "Back-End", imagem: null },
  { nome: "Guilherme Tadeu Castellani", ra: "1136257", funcao: "Back-End", imagem: require("../../../assets/guilherme.jpeg") },
  { nome: "Emanoel Rosa", ra: "1136489", funcao: "Gestor de Projetos", imagem: require("../../../assets/emanoel.jpeg") },
  { nome: "Rafaela Bilibio da Silva", ra: "1137885", funcao: "Qualidade · Designer UX/UI", imagem: null },
];

const iniciais = (nome) =>
  nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function Menu() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title="Equipe do projeto" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.hero}>
          <Image
            source={require("../../../assets/img_tb_facul.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>AutoParts</Text>
          <Text style={styles.heroSub}>Marketplace de peças automotivas</Text>
        </View>

        {integrantes.map((item, index) => (
          <View key={index} style={styles.card}>
            {item.imagem ? (
              <Image source={item.imagem} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.iniciais}>{iniciais(item.nome)}</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.funcao}>{item.funcao}</Text>
              <View style={styles.raTag}>
                <Ionicons name="school-outline" size={12} color={colors.brand} />
                <Text style={styles.raText}>RA {item.ra}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: "center", marginBottom: spacing.lg },
  logo: { width: 120, height: 120 },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3, marginTop: 4 },
  heroSub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 14,
  },
  avatar: { width: 62, height: 62, borderRadius: 18 },
  avatarFallback: {
    backgroundColor: colors.brandSoft,
    borderWidth: 1.5,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  iniciais: { color: colors.brand, fontSize: 20, fontWeight: "800" },
  info: { flex: 1, marginLeft: 14 },
  nome: { color: colors.text, fontSize: 16, fontWeight: "800" },
  funcao: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  raTag: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  raText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
});
