import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import { colors, radius, spacing } from "../../theme";

const { width } = Dimensions.get("window");

export default function PedidoConfirmado({ route }) {
  const navigation = useNavigation();
  const pedidoId = route?.params?.pedidoId;
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.glow} />

      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.iconRing}>
          <Ionicons name="bag-check" size={60} color={colors.brand} />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Text style={styles.title}>Compra confirmada!</Text>
        <Text style={styles.subtitle}>
          Seu pedido foi recebido e já está em separação.
          Você pode acompanhá-lo pelo histórico.
        </Text>

        {pedidoId ? (
          <View style={styles.codigo}>
            <Text style={styles.codigoLabel}>PEDIDO</Text>
            <Text style={styles.codigoNum}>#{String(pedidoId).slice(-6)}</Text>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: fade }]}>
        <PrimaryButton
          label="Acompanhar pedido"
          onPress={() => navigation.navigate("Historico")}
        />
        <PrimaryButton
          label="Voltar à loja"
          variant="ghost"
          onPress={() => navigation.navigate("AutoPart")}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.brand,
    opacity: 0.1,
  },
  iconRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.brandSoft,
    borderWidth: 2,
    borderColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 12 },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 6,
  },
  codigo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 22,
  },
  codigoLabel: { color: colors.textMuted, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  codigoNum: { color: colors.brand, fontSize: 16, fontWeight: "800" },
  actions: { width: "100%", gap: 12, marginTop: 44 },
});
