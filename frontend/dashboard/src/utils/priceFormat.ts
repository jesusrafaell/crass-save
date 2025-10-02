export const formatPrice = (price: number, symbol: string) => {
  if (symbol === "COP") {
    return price.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price;
};
