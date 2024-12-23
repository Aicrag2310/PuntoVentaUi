/* eslint-disable */

export class ProductTableItem {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.category = data.category;
      this.retail_price = this.formatPrice(data.retail_price);
      this.wholesale_price = this.formatPrice(data.wholesale_price);
      this.purchase_price = this.formatPrice(data.purchase_price);
  }
  /**
   * Formatea el precio como float y le agrega el símbolo de $
   * @param {number|string} price - Precio a formatear
   * @returns {string} Precio con formato
   */
  formatPrice(price) {
    const formattedPrice = parseFloat(price).toFixed(2); // Asegura 2 decimales
    return `$${formattedPrice}`; // Agrega el símbolo de pesos
  }
}