// Converte o ProductDTO do backend para o formato usado pelas telas/componentes.
export function adaptProduct(dto) {
  const converteu = dto.convertedPrice != null && dto.convertedPrice > 0;
  const preco = converteu ? dto.convertedPrice : dto.price;
  const moeda = converteu ? dto.requestCurrency || "BRL" : dto.currency || "USD";

  return {
    id: dto.id,
    nome: dto.description,
    marca: dto.brand,
    modelo: dto.model,
    categoria: dto.category || dto.brand,
    descricao: [dto.brand, dto.model].filter(Boolean).join(" · "),
    descricaoCompleta: dto.description,
    preco,
    moeda,
    stock: dto.stock,
    imagem: dto.imageURL || null,
    vendedor: dto.sellerName,
    avaliacao: dto.rating || 0,
    avaliacoes: dto.ratingCount || 0,
  };
}
