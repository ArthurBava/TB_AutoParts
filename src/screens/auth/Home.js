import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../components/PrimaryButton";
import { colors, spacing } from "../../theme";

const { width } = Dimensions.get("window");

// Tela de boas-vindas / abertura.
export default function Home() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* atmosfera de fundo */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.glow} />

      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image
          source={require("../../../assets/img_tb_facul.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.kicker}>PEÇAS · ACESSÓRIOS · OFICINA</Text>
        <Text style={styles.welcomeTitle}>Bem-vindo à AutoParts</Text>
        <Text style={styles.welcomeSubtitle}>
          Aqui você encontra tudo o que{"\n"}falta em seu veículo.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonsContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <PrimaryButton label="Login" onPress={() => navigation.navigate("Login")} />
        <PrimaryButton
          label="Criar nova conta"
          variant="secondary"
          onPress={() => navigation.navigate("NewAccount")}
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
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: colors.surface,
    top: -width * 0.5,
    left: -width * 0.1,
    opacity: 0.6,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: colors.bgDeep,
    bottom: -width * 0.3,
    right: -width * 0.2,
    opacity: 0.8,
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.brand,
    top: width * 0.1,
    opacity: 0.12,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
    alignItems: "center",
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 12,
  },
  logo: { width: 210, height: 210 },
  textContainer: { alignItems: "center", marginBottom: 40 },
  kicker: {
    color: colors.brand,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  welcomeTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 10,
  },
  welcomeSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: { width: "100%", alignItems: "center", gap: 14 },
});
