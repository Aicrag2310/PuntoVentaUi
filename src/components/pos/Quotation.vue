<template>
  <div>
    <!--<v-btn v-if="frontItemsList.length > 0" @click="saveQuotation" color="success">
      <v-icon>mdi-content-save</v-icon>
      Guardar cotización
    </v-btn>
    <img class="hidden" id="test" v-bind:src="img" alt="">-->
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { mapGetters } from 'vuex';
import { PurchaseOrderProduct } from '../../models/PurchaseOrder/PurchaseOrderProduct';
import PurchaseOrderService from '../../services/PurchaseOrderService';

const img = require('../../assets/pdf-template.jpg');

export default {
  name: 'quotation',
  computed: {
    ...mapGetters({
      itemsList: 'itemsList',
      frontItemsList: 'frontItemsList',
      cartTotal: 'cartTotal',
      selectedClient: 'selectedClient',
    }),
  },
  data: () => ({
    pageWidth: 595,
    pageHeight: 842,
    horizontalMargin: 20,

    cellPadding: 10,
    cellWidth: 180,
    cellHeight: 20,
    lineHeight: 20,

    startX: null,
    startY: null,

    doc: null,
    page: 1,
    imageData: null,
    img,
    topMargin: 150,
    bottomMargin: 0,
    currentQuotationFoil: null,
  }),
  methods: {
    async saveQuotation() {
      let clientId;
      let clientDiscount = 0;
      const { total } = this.cartTotal;
      if (this.selectedClient && this.selectedClient.id > 0) {
        clientId = this.selectedClient.id;
        clientDiscount = this.selectedClient.discount;
      }
      const products = [];
      this.itemsList.filter(x => x.isGift !== 1).forEach((x) => {
        const product = new PurchaseOrderProduct(x.id, x.baseCost, x.calculatedDiscount);
        products.push(product);
      });
      this.frontItemsList.forEach((item) => {
        if (item.isGift === 1) {
          for (let i = 0; i < item.quantity; i += 1) {
            let lastItem = products.filter(x => x.productId === item.id && x.isGift !== 1);
            lastItem = lastItem[lastItem.length - 1];
            lastItem.isGift = 1;
          }
        }
      });
      const resp = await PurchaseOrderService.saveQuotation(clientId,
        clientDiscount, total, products);
      if (resp.error) {
        Swal.fire('Error', 'Hubo un error al guardar la cotización', 'error');
        return;
      }
      const { quotationOrderFoil } = resp.data;
      this.currentQuotationFoil = quotationOrderFoil;
      Swal.fire('Correcto', `Cotización guardada con el folio: ${quotationOrderFoil}`, 'success');
      this.$store.dispatch('addSavedQuotation');
      this.createPDF();
    },
    createPDF() {
      this.pageHeight = 900;
      this.pageWidth = 595;
      this.loadImg();
      const options = { orientation: 'p', unit: 'pt', format: 'a4' };
      this.doc = new jsPDF(options);
      // Settear tamaño del espacio a usar en el documento
      // Ancho - (margenHorizontal * 2)
      // Alto - (margenSuperior + margenInferior)
      const realHorizontalMargin = this.horizontalMargin * 2;
      this.pageWidth -= realHorizontalMargin;
      this.pageHeight -= (this.topMargin + this.bottomMargin);

      this.doc.addImage(this.imageData, 'JPEG', 0, 0, 595, 842);

      this.startX = this.horizontalMargin;
      this.startY = 50;
      this.doc.setFontSize(12);
      const d = new Date();
      const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(d);
      let mo = new Intl.DateTimeFormat('es', { month: 'short' }).format(d);
      [mo] = mo.split('.');
      const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(d);

      const todayDt = `${da}/${mo}/${ye}`;
      this.createCell(512, todayDt, 'right');

      this.startX = this.horizontalMargin;
      this.startY = 75;
      this.createCell(512, `Folio: ${this.currentQuotationFoil}`, 'right');

      this.startX = this.horizontalMargin;
      this.startY = 100;
      if (this.selectedClient && this.selectedClient.id > 0) {
        this.createCell(512, `Cliente: ${this.selectedClient.name}`, 'right');
      } else {
        this.createCell(512, 'Cliente: Anónimo', 'right');
      }

      // Settear inicio de cursor en x,y
      this.startX = this.horizontalMargin;
      this.startY = this.topMargin;

      // Settear tamaño de fuente del listado
      this.doc.setFontSize(10);
      this.createCell(10, 'Cant');
      this.createCell(65, 'Modelo');
      this.createCell(200, 'Descripción');
      this.createCell(65, 'Marca');
      this.createCell(40, 'Precio Unitario');
      this.createCell(55, 'Importe', 'right');
      this.doc.setFontSize(8);
      this.startY += 20;
      this.frontItemsList.forEach((x) => {
        // Por cada elemento en la lista del carrito...
        // Escribir renglon de item que no es regalo
        if (x.isGift !== 1) {
          // Resetea el cursor en X antes de empezar a escribir el renglon
          this.startX = this.horizontalMargin;
          this.createCell(10, `${x.quantity}`);
          const modelLines = this.doc.splitTextToSize(x.model, 65);
          this.createCell(65, modelLines);
          const lines = this.doc.splitTextToSize(x.name, 200);
          this.createCell(200, lines);
          const brandLines = this.doc.splitTextToSize(x.brand, 65);
          this.createCell(65, brandLines);
          this.createCell(40, x.baseCostStr, 'right');
          this.createCell(55, x.costStr, 'right');
          if (modelLines.length > 2 || lines.length > 2 || brandLines.length > 2) {
            this.startY += 30;
          } else {
            this.startY += 5;
          }
          if (x.calculatedDiscount > 0) {
            // Se resetea el cursor en x y se aumenta el cursor en y para que sea otro renglon
            this.startX = this.horizontalMargin;
            this.createCell(10, ''); // Espacio vacio
            this.createCell(65, 'Descuento del producto');
            this.createCell(200, ''); // Espacio vacio
            this.createCell(65, ''); // Espacio vacio
            this.createCell(40, ''); // Espacio vacio
            this.createCell(55, `- ${x.discountStr}`, 'right');
          }
          this.startY += 20;
        } else {
          this.startX = this.horizontalMargin;
          this.createCell(10, `- ${x.quantity}`);
          const modelLines = this.doc.splitTextToSize(x.model, 65);
          this.createCell(65, modelLines);
          const promoName = `(PROMO) ${x.name}`;
          const lines = this.doc.splitTextToSize(promoName, 200);
          this.createCell(200, lines);
          const brandLines = this.doc.splitTextToSize(x.brand, 65);
          this.createCell(65, brandLines);
          this.createCell(40, '');
          this.createCell(55, `- ${x.costWithDiscountStr}`, 'right');
          if (modelLines.length > 2 || lines.length > 2 || brandLines.length > 2) {
            this.startY += 35;
          } else {
            this.startY += 10;
          }
        }
        this.doc.line(this.horizontalMargin, this.startY + 5,
          this.pageWidth + 10, this.startY + 5, 'S');
        this.startY += 10;
      });
      this.startY += 40;
      this.startX = this.horizontalMargin;
      this.doc.setFontSize(16);
      this.createCell(530, `Total: ${this.cartTotal.FTotal}`, 'right');
      this.doc.setFontSize(10);
      this.startY += 100;
      this.startX = this.horizontalMargin;
      let text = 'Precios sujetos a cambios sin previo aviso. Condición de venta:'
        + ' Contado. Formas de pago: Efectivo, Tarjetas de débito y crédito, Transferencias y/o depósitos'
        + ' en tiendas de autoservicio Seven Eleven, Farmacias del Ahorro y Farmacias Guadalajara.';
      let lines = this.doc.splitTextToSize(text, 555);
      this.createCell(555, lines);
      text = 'Nota: Los pagos realizados por medio de transferencia serán válidos para entrega'
        + ' de materiales hasta que los importes cotizados se reflejen en firme en nuestra cuenta.';
      this.startY += 40;
      this.startX = this.horizontalMargin;
      lines = this.doc.splitTextToSize(text, 555);
      this.createCell(555, lines);
      this.doc.save(`cotizacion-folio-${this.currentQuotationFoil}.pdf`);
      this.doc = null;
    },
    createCell(cellWidth, text, options = null) {
      const requiredWidth = this.startX + cellWidth + (this.cellPadding * 2);
      if (this.startY > this.pageHeight) {
        this.doc.addPage();
        this.page += 1;
        this.doc.setPage(this.page);
        this.doc.addImage(this.imageData, 'JPEG', 0, 0, 595, 842);
        this.startY = this.topMargin;
        this.startX = this.horizontalMargin;
      }
      if (options === 'right') {
        const textWidth = this.doc.getStringUnitWidth(text)
          * (this.doc.internal.getFontSize() / this.doc.internal.scaleFactor);
        this.startX += (cellWidth - textWidth);
      }
      this.textWriter(text, this.startX + this.cellPadding,
        this.startY + this.cellPadding, options);
      this.startX = requiredWidth;
    },
    textWriter(text, xPos, yPos) {
      if (text.length > 1) {
        this.doc.text(text, xPos, yPos);
      } else {
        this.doc.text(`${text}`, xPos, yPos);
      }
    },
    addEmptyLine() {
      this.createCell(575, '');
    },
    loadImg() {
      if (!this.imageData) {
        const img2 = document.getElementById('test');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img2.width;
        canvas.height = img2.height;
        ctx.drawImage(img2, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        const base64 = dataURL.replace(/^data:image\/jpeg;base64,/, '');
        this.imageData = base64;
      }
    },
  },
  mounted() {
    // const img2 = document.getElementById('test');
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // canvas.width = img2.width;
    // canvas.height = img2.height;
    // ctx.drawImage(img2, 0, 0);
    // const dataURL = canvas.toDataURL('image/jpeg');
    // const base64 = dataURL.replace(/^data:image\/jpeg;base64,/, '');
    // return base64;
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
