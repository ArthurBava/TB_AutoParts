import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import { colors, spacing } from "../../theme";

const { width } = Dimensions.get("window");

// Tela de sucesso após criar a conta.
export default function Confirmacao({ route }) {
  const navigation = useNavigation();
  const nome = route?.params?.nome || "";
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

      <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
        <View style={styles.iconRing}>
          <Ionicons name="checkmark-sharp" size={64} color={colors.success} />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Text style={styles.title}>Conta criada{"\n"}com sucesso!</Text>
        <Text style={styles.subtitle}>
          {nome ? `Boas-vindas, ${nome.split(" ")[0]}! ` : ""}
          Sua conta na AutoParts está pronta.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: fade }]}>
        <PrimaryButton
          label="Começar a comprar"
          onPress={() => navigation.navigate("AutoPart")}
        />
        <PrimaryButton
          label="Ir para o login"
          variant="ghost"
          onPress={() => navigation.navigate("Login")}
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
    backgroundColor: colors.success,
    opacity: 0.1,
  },
  iconWrap: { marginBottom: spacing.xxl },
  iconRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.successSoft,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  actions: { width: "100%", gap: 12, marginTop: 48 },
});
