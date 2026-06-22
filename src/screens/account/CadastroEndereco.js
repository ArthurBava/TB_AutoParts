import React, { useState } from "react";
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenHeader from "../../components/ScreenHeader";
import PrimaryButton from "../../components/PrimaryButton";
import Field from "../../components/Field";
import { api } from "../../services/api";
import { colors, spacing } from "../../theme";

export default function CadastroEndereco() {
  const navigation = useNavigation();
  const route = useRoute();
  const editando = route.params?.address || null;

  const [label, setLabel] = useState(editando?.label || "");
  const [recipientName, setRecipientName] = useState(editando?.recipientName || "");
  const [phone, setPhone] = useState(editando?.phone || "");
  const [zipCode, setZipCode] = useState(editando?.zipCode || "");
  const [street, setStreet] = useState(editando?.street || "");
  const [number, setNumber] = useState(editando?.number || "");
  const [district, setDistrict] = useState(editando?.district || "");
  const [city, setCity] = useState(editando?.city || "");
  const [estado, setEstado] = useState(editando?.state || "");
  const [complement, setComplement] = useState(editando?.complement || "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // ViaCEP: ao completar 8 dígitos, autopreenche. Falha = preenchimento manual.
  const onCepChange = async (txt) => {
    setZipCode(txt);
    const digitos = txt.replace(/\D/g, "");
    if (digitos.length === 8) {
      setBuscandoCep(true);
      try {
        const r = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
        const j = await r.json();
        if (!j.erro) {
          setStreet(j.logradouro || "");
          setDistrict(j.bairro || "");
          setCity(j.localidade || "");
          setEstado(j.uf || "");
        }
      } catch {
        // silencioso: usuário preenche manualmente
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const salvar = async () => {
    if (!label.trim()) return setErro("Dê um nome ao endereço (ex.: Casa).");
    if (!recipientName.trim()) return setErro("Informe quem vai receber.");
    if (!street.trim() || !number.trim() || !city.trim() || !estado.trim())
      return setErro("Preencha rua, número, cidade e UF.");
    setErro("");
    setSalvando(true);
    const body = {
      label: label.trim(), recipientName: recipientName.trim(), phone: phone.trim(),
      zipCode: zipCode.trim(), street: street.trim(), number: number.trim(),
      district: district.trim(), city: city.trim(), state: estado.trim().toUpperCase(),
      complement: complement.trim(),
    };
    try {
      if (editando) await api.put(`/ws/addresses/${editando.id}`, body, { auth: true });
      else await api.post("/ws/addresses", body, { auth: true });
      navigation.goBack();
    } catch (e) {
      setErro(e.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScreenHeader title={editando ? "Editar endereço" : "Novo endereço"} />

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {erro ? (
          <View style={styles.erroBox}><Text style={styles.erroText}>{erro}</Text></View>
        ) : null}

        <Field label="Nome do endereço" icon="bookmark-outline" placeholder="Casa, Trabalho..." value={label} onChangeText={setLabel} />
        <Field label="Quem recebe" icon="person-outline" placeholder="Nome do destinatário" value={recipientName} onChangeText={setRecipientName} />
        <Field label="Telefone" icon="call-outline" placeholder="(54) 99999-9999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label={buscandoCep ? "CEP (buscando...)" : "CEP"} icon="location-outline" placeholder="00000-000" value={zipCode} onChangeText={onCepChange} keyboardType="numeric" maxLength={9} />
        <Field label="Rua" icon="map-outline" placeholder="Logradouro" value={street} onChangeText={setStreet} />
        <Field label="Número" icon="navigate-outline" placeholder="123" value={number} onChangeText={setNumber} keyboardType="numeric" />
        <Field label="Bairro" icon="business-outline" placeholder="Bairro" value={district} onChangeText={setDistrict} />
        <Field label="Cidade" icon="business-outline" placeholder="Cidade" value={city} onChangeText={setCity} />
        <Field label="UF" icon="flag-outline" placeholder="RS" value={estado} onChangeText={setEstado} autoCapitalize="characters" maxLength={2} />
        <Field label="Complemento (opcional)" icon="add-outline" placeholder="Ap, bloco..." value={complement} onChangeText={setComplement} />

        <PrimaryButton
          label={editando ? "Salvar alterações" : "Cadastrar endereço"}
          onPress={salvar}
          loading={salvando}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  form: { paddingHorizontal: 18, paddingBottom: 40, gap: 14 },
  erroBox: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1, borderColor: colors.danger,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
  },
  erroText: { color: colors.danger, textAlign: "center", fontWeight: "700", fontSize: 14 },
});
