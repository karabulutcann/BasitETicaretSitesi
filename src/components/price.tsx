export function calculatePrice(price: number|string): string {
  let newPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(newPrice);
}

export function calculateKDV(price: number|string): string {
  let newPrice = typeof price === "string" ? parseFloat(price) : price;
  return calculatePrice((newPrice * 20) / 100); 
}
