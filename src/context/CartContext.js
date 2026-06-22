// Estado global do carrinho. O pedido é criado no backend (order-service),
// que recalcula os preços no servidor — o cliente só envia produto + quantidade.
import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]); // { ...produto, qtd }

  const adicionar = (produto, qtd = 1) => {
    setItens((prev) => {
      const existente = prev.find((i) => i.id === produto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === produto.id ? { ...i, qtd: i.qtd + qtd } : i
        );
      }
      return [...prev, { ...produto, qtd }];
    });
  };

  const alterarQtd = (id, delta) =>
    setItens((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i))
        .filter((i) => i.qtd > 0)
    );

  const remover = (id) => setItens((prev) => prev.filter((i) => i.id !== id));

  const limpar = () => setItens([]);

  // Cria o pedido no backend. Requer usuário logado (rota protegida /ws/).
  // deliveryAddress: snapshot em texto do endereço escolhido (gravado no pedido).
  const finalizarPedido = async (deliveryAddress = null) => {
    const body = {
      items: itens.map((i) => ({ productId: i.id, quantity: i.qtd })),
      deliveryAddress,
    };
    const pedido = await api.post("/ws/orders", body, { auth: true });
    limpar();
    return pedido;
  };

  const quantidadeTotal = itens.reduce((s, i) => s + i.qtd, 0);
  const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const total = subtotal; // sem frete
  const moeda = itens[0]?.moeda || "BRL";

  const value = useMemo(
    () => ({
      itens,
      adicionar,
      alterarQtd,
      remover,
      limpar,
      finalizarPedido,
      quantidadeTotal,
      subtotal,
      total,
      moeda,
    }),
    [itens]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
};
