import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, shadow } from "../theme";
import { useCart } from "../context/CartContext";

// Barra de navegação inferior reutilizável, com botão de carrinho em destaque,
// badge de quantidade e indicação da aba ativa.
export default function BottomNav({ active }) {
  const navigation = useNavigation();
  const { quantidadeTotal } = useCart();

  const Item = ({ icon, label, rota, isActive }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => rota && navigation.navigate(rota)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isActive ? colors.brand : colors.textSecondary}
      />
      <Text style={[styles.label, isActive && { color: colors.brand }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bar}>
      <Item icon="home" label="Início" rota="AutoPart" isActive={active === "home"} />
      <Item
        icon="time-outline"
        label="Pedidos"
        rota="Historico"
        isActive={active === "pedidos"}
      />

      {/* botão central — carrinho */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate("Carrinho")}
        activeOpacity={0.85}
      >
        <Ionicons name="cart" size={28} color="#1A0E03" />
        {quantidadeTotal > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{quantidadeTotal}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Item
        icon="search-outline"
        label="Buscar"
        rota="Busca"
        isActive={active === "busca"}
      />
      <Item
        icon="menu"
        label="Mais"
        rota="Configuracoes"
        isActive={active === "mais"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 18,
    paddingTop: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: { alignItems: "center", justifyContent: "center", flex: 1, gap: 3 },
  label: { color: colors.textSecondary, fontSize: 10, fontWeight: "600" },
  cartButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.brand,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -28,
    borderWidth: 4,
    borderColor: colors.bg,
    ...shadow.brand,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.bg,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
