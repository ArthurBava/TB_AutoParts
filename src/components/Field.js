import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../theme";

// Campo de texto padrão. Suporta ícone, senha (com olho) e rótulo flutuante.
export default function Field({
  label,
  icon,
  secure,
  value,
  onChangeText,
  style,
  ...props
}) {
  const [hide, setHide] = useState(true);
  const [focus, setFocus] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, focus && styles.boxFocus]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={focus ? colors.brand : colors.textMuted}
            style={{ marginRight: 10 }}
          />
        ) : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          secureTextEntry={secure ? hide : false}
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHide(!hide)} hitSlop={10}>
            <Ionicons
              name={hide ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 7,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
  },
  boxFocus: { borderColor: colors.brand },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 15,
  },
});
