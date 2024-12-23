<template>
  <v-row class="total-payment-section">
    <div v-if="block === 1">
      <v-overlay>
        <v-progress-circular :size="100" color="primary" indeterminate></v-progress-circular>
      </v-overlay>
    </div>

    <v-col cols="12" lg="8" class="pb-0">
      <v-col cols="12" class="total-payment-label">
        <div class="text-center text-h6 text-lg-h5">Total</div>
      </v-col>
      <v-col cols="12" class="text-center total-payment">
        <h1 class="">{{ cartTotalStr }}</h1>
      </v-col>
    </v-col>

    <v-col cols="12" lg="4" align-self="center" class="pr-0 pl-0">
      <v-btn v-if="cartItemsLength > 0" @click="showCheckoutDialog" color="secondary" x-large class="d-none d-lg-flex">
        Cobrar
      </v-btn>
    </v-col>

    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title text-center>Cobrar</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="returnToOrder">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" sm="6" class="pt-0 pb-2">
              <div class="total-section">
                Total: <h2>{{ cartTotalStr }}</h2>
              </div>
            </v-col>
          </v-row>

          <div>
            <h2 class="my-3" v-if="selectedPayment <= 0 && !disabledBtn && !workingService">
              Seleccionar el metodo de pago
            </h2>
            <v-row v-if="selectedPayment <= 0 && !disabledBtn">
              <v-col cols="12" sm="6">
                <v-btn :disabled="disabledBtn || workingService" @click="selectedPayment = PM_TYPE_CASH" block dark
                  color="secondary">
                  <v-icon class="mr-2">mdi-cash</v-icon>
                  Efectivo
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn :disabled="disabledBtn || workingService" @click="selectedPayment = PM_TYPE_CARD_SELECTOR" block
                  dark color="success">
                  <v-icon class="mr-2">mdi-credit-card</v-icon>
                  Tarjeta
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn :disabled="disabledBtn || workingService" @click="selectedPayment = PM_TYPE_TRANSFER" block dark
                  color="lightPrimary">
                  <v-icon class="mr-2">mdi-transfer-right</v-icon>
                  Transferencia
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="selectedPayment === PM_TYPE_CASH">
              <v-col cols="12" sm="12">
                <v-currency-field v-model="moneyImport" outlined prepend-icon="mdi-cash"
                  @keypress.enter="makeTransaction" @input="getChange" color="secondary" label="Cash amount">
                </v-currency-field>
              </v-col>
              <h2>Cambio: {{ transactionChange }}</h2>
            </v-row>

            <v-row v-if="selectedPayment === PM_TYPE_CARD_SELECTOR">
              <v-col cols="12" sm="12">
                <v-radio-group v-model="cardType" row>
                  <v-radio color="secondary" label="Debit card" :value="PM_TYPE_DEBIT_CARD"></v-radio>
                  <v-radio color="secondary" label="Credit card" :value="PM_TYPE_CREDIT_CARD"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="12">
                <v-currency-field v-model="moneyImport" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-credit-card" class="pb-4" color="secondary" label="Card import">
                </v-currency-field>
                <v-text-field v-model="cardLastNumbers" type="number" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-numeric" class="pb-4" color="secondary" label="Last 4 digits of card">
                </v-text-field>
                <v-text-field v-model="confirmationNumber" type="number" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-shield-check-outline" color="secondary" label="Confirmation number">
                </v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="selectedPayment === PM_TYPE_CHECK">
              <v-col cols="12" sm="12">
                <v-currency-field v-model="moneyImport" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-checkbook" class="pb-4" color="secondary" label="Money amount">
                </v-currency-field>
                <v-text-field v-model="bankName" @keypress.enter="makeTransaction" outlined prepend-icon="mdi-bank"
                  class="pb-4" color="secondary" label="Bank name"></v-text-field>
                <v-text-field v-model="confirmationNumber" type="number" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-shield-check-outline" color="secondary" label="Confirmation number">
                </v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="selectedPayment === PM_TYPE_TRANSFER">
              <v-col cols="12" sm="12">
                <v-currency-field v-model="moneyImport" @keypress.enter="makeTransaction" class="pb-4" outlined
                  prepend-icon="mdi-transfer-right" color="secondary" label="Transfer amount">
                </v-currency-field>
                <v-text-field v-model="confirmationNumber" type="number" @keypress.enter="makeTransaction" outlined
                  prepend-icon="mdi-shield-check-outline" color="secondary" label="Confirmation number">
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions v-if="selectedPayment > 0">
          <v-spacer></v-spacer>
          <v-btn @click="clearPaymentData" color="error">Regresar</v-btn>
          <v-btn :disabled="!isAmountGreaterThanTotal || workingService" color="secondary" @click="makeTransaction">
            Finalizar compra
          </v-btn>

        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="clearPayments">
            Delete payments
          </v-btn>
          <v-btn v-if="block === 0" @click="finishOrder" dark color="#1f6feb">
            Finish checkout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
/* eslint-disable */
import Swal from 'sweetalert2';
import { delay } from '@/utils/AppUtils';
import { mapActions, mapGetters } from 'vuex';
import CurrencyFormatter from '../../models/CurrencyFormatter';
import { PM_TYPES, PosPayment } from '@/models/pos/PosPayment';
import paymentService from '@/services/paymentService';

export default {
  name: 'payment',
  computed: {
    cartApiResponse() {
      return this.$store.state.cartApiResponse;
    },
    ...mapGetters(['cartItems']),
    ...mapGetters({
      cartItemsLength: 'posCartItemsLength',
      cartTotal: 'posCartTotal'
    }),

    cartTotalStr() {
      return CurrencyFormatter.format(this.cartTotal);
    },
    paymentsTotalStr() {
      return CurrencyFormatter.format(this.paymentsTotal);
    },
    isAmountGreaterThanTotal() {
      return parseFloat(this.moneyImport) >= parseFloat(this.cartTotal);
    },
  },

  data: () => ({
    dialog: false,
    transactionChange: 0,
    moneyImport: null,
    swalText: 'Do you wish to close the order and proceed to payment?',
    selectedPayment: 0,
    cardType: 0,
    cardLastNumbers: null,
    confirmationNumber: null,
    bankName: null,
    payments: [],
    change: 0,
    realPaidCash: 0,
    block: 0,
    taxesCost: 0,
    shippingCost: 0,
    carItems: [],
    PM_TYPE_CASH: PM_TYPES.CASH,
    PM_TYPE_BRAINTREE: PM_TYPES.BRAINTREE,
    PM_TYPE_CARD_SELECTOR: 2.5,
    PM_TYPE_DEBIT_CARD: PM_TYPES.DEBIT_CARD,
    PM_TYPE_CREDIT_CARD: PM_TYPES.CREDIT_CARD,
    PM_TYPE_CHECK: PM_TYPES.CHECK,
    PM_TYPE_TRANSFER: PM_TYPES.TRANSFER,
    disabledBtn: null,

    workingService: false,
  }),

  methods: {
    async makeTransaction() {
      let paymentMethod = 0;
      const total = this.remainingTotal;

      // process cash payment
      if (this.selectedPayment === PM_TYPES.CASH) {
        this.getChange();

        await this.clearPaymentData();
        this.finishOrder();
        return;
      }
      this.finishOrder();
    },
    async finishOrder() {
      
      const cartToSend = this.cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        sale_type: item.sale_type,
        total: item.calculated_price * item.quantity,
      }));

      const paymentData = {
        paymentMethod: this.selectedPayment, // Asegúrate de enviar el método de pago
        total: this.cartTotal,
        payments: this.payments, // Si tienes información adicional sobre los pagos
      };

      try {
        await paymentService.sendCartToApi({ cart: cartToSend, payment: paymentData });
        this.$store.dispatch('clearCart');
        this.selectedPayment = null;
        this.payments = [];
        this.dialog = false;
        Swal.fire({
          title: 'Exito',
          text: 'Venta Finalizada.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error al finalizar la transacción:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo procesar la transacción. Por favor, intente nuevamente.',
          icon: 'error',
        });
      }
    },

    async clearPayments() {
      const { value: dialogResult } = await Swal.fire({
        allowOutsideClick: false,
        title: 'Delete payments',
        confirmButtonText: 'Yes',
        text: 'Are you sure you want to delete payments made?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
      });

      if (!dialogResult) {
        return;
      }

      this.payments = [];
      this.realPaidCash = 0;
      this.change = 0;
      this.transactionChange = CurrencyFormatter.format(this.change);

      await this.clearPaymentData();
    },
    getChange() {
      const total = this.cartTotal;
      let change = parseFloat(this.moneyImport) - parseFloat(total);

      if (change < 0) {
        change = 0;
      }
      this.transactionChange = CurrencyFormatter.format(change);
      this.change = change;
    },
    async clearPaymentData() {
      this.selectedPayment = 0;
      this.moneyImport = 0;
      this.cardType = null;
      this.change = 0;
      this.transactionChange = CurrencyFormatter.format(this.change);
      this.cardLastNumbers = null;
      this.confirmationNumber = null;
      this.bankName = null;
    },
    showCheckoutDialog() {
      // reset payment context variables
      this.realPaidCash = 0;
      this.moneyImport = null;
      this.dialog = true;

      // reset payment input fields
      this.clearPaymentData();
    },
    async returnToOrder() {
      this.block = 0;
      const { value: dialogResult } = await Swal.fire({
        allowOutsideClick: false,
        title: 'Return to the order',
        confirmButtonText: 'Yes',
        text: 'Do you wish to return to the order? Payments made will be deleted',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
      });

      if (!dialogResult) {
        return;
      }

      this.dialog = false;
    },
  },
};
</script>

<style lang="less" scoped>
.total-payment-section {
  padding-top: 2rem;
}

.total-payment-label {
  padding: 0;

  h2 {
    font-size: 1.4rem;
    font-weight: 500;
  }
}

.total-payment {
  padding: 0;

  h1 {
    font-weight: 400;
    font-size: 2.6rem;
  }
}

.total-section {
  font-weight: 400;
  color: black;
}
</style>
