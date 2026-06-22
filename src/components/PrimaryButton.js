import React from "react";
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { colors, radius, shadow } from "../theme";

// Botão de ação. variant: "primary" (laranja), "secondary" (contorno), "ghost".
export default function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  style,
  disabled,
  loading,
}) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.base,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        isGhost && styles.ghost,
        isPrimary && shadow.brand,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#1A0E03" : colors.brand} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && { color: "#1A0E03" },
            !isPrimary && { color: colors.brand },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.brand },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.brand,
  },
  ghost: { backgroundColor: "transparent" },
  label: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
