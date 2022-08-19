<template>
  <div class="mt-2 mb-3">
    <h3>Order</h3>
    <p class="message">&nbsp;{{ message }}</p>
    <p v-if="productAllocation && stylelist.length === 0">Nothing selected on this page yet.</p>
    <!-- Stock Table for the style on this page -->
    <AllocationTable
      v-if="sizelist.length"
      :add-to-order="addToOrder"
      :remove-from-order="removeFromOrder"
      :country="userCountry"
      :style="style"
      :allocation="productAllocation"
      :sizelist="sizelist"
      :open-alert-box="openAlertBox"
    />
    <p style="margin: 15px" v-if="stylelist.length">This page selection summary</p>
    <!-- List selected lineitems for the style on this page only -->
    <PageOrder
      :stylelist="stylelist"
      :country="userCountry"
      :sub-total="subTotal"
      :discount-percentage="userDiscountPercent"
      :discount="discount"
      :total="total"
      :open-alert-box="openAlertBox"
      @add-to-order="addToOrder"
      @remove="removeFromOrder"
      :dialog-ok="dialogOK"
    />
    <!-- Checkout button -->
    <p v-if="cartorder.length" class="p-2 attention">
      <button
        :disabled="cartorder.length === 0"
        onclick="document.location.href = '/checkout#review'"
        class="btn btn-sm btn-primary float-right"
      >
        CHECKOUT
      </button>
      Please note ETAs are approximate only and subject to change without notice. Please allow<br />
      an additional 1-5 business days to above ETAs to allow for stock processing and dispatch.
    </p>
    <!-- Dialog Modal replaces JS alert -->
    <AlertBox
      v-if="dialogOK"
      :open="showAlert"
      :support-text="supportText"
      :confirm="isConfirmBox"
      @close="closeAlertBox"
      :alert-data="alertData"
      @remove="removeFromOrder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AllocationTable from "./components/AllocationTable.vue";
import PageOrder from "./components/PageOrder.vue";
import AlertBox from "./components/AlertBox.vue";
import { urlProduct, sessionKey, delStyles } from "./config";
import useAlert from "./use/useAlert";
import useCartOrder from "./use/useCartOrder";
import useStyleInfo from "./use/useStyleInfo";
import useAxios from "./use/useAxios";
import { updateBag } from "./helpers/helpers";

const message = ref("");
const userDiscountPercent = ref(0);
const userCountry = ref("");
const styleId = ref(0);
const style = ref("");
const styletext = ref("");
const sizelist = ref([]);

// Manages an array of colors with nested size SKUs pulled from API for the Style on this page
const { productAllocation, getColourThumb, getSKUData, resetItemQty, processAllocation } = useStyleInfo({
  delStyles,
  orderValue,
});

// Manages the cart array of line items created by the user
const { cartorder, countCartItems, getOrderData, processOrder, removeFromOrder, stylelist, subTotal, discount, total } =
  useCartOrder(sessionKey, { id: styleId, discountPercent: userDiscountPercent, sizelist, resetItemQty });

// Manages an html dialog replacement for javascript alert
const { dialogOK, isConfirmBox, showAlert, supportText, openAlertBox, closeAlertBox, alertData } = useAlert();

// Manages data fetching
const { fetchStyleData } = useAxios();

// Update the cart in the page header outside the app when the number of items changes
watch(
  () => total.value,
  () => {
    updateBag(countCartItems.value);
  }
);

onMounted(async () => {
  // Can the browser use html dialog instead of js alert?
  dialogOK.value = typeof HTMLDialogElement === "function";
  // Pickup the style id for the API call in the page
  const docstyle = document.getElementById("style");
  if (docstyle && docstyle.dataset && docstyle.dataset.id) {
    styleId.value = docstyle.dataset.id ? parseInt(docstyle.dataset.id) : 0;
    // Load any order from session storage
    cartorder.value = getOrderData();
    message.value = "Getting product information...";
    // Load product stock data for the page style and basic user data in single API call
    const result = await fetchStyleData(urlProduct + styleId.value);
    if (result && result.success) {
      message.value = "";
      style.value = result.style;
      styletext.value = result.styletext;
      sizelist.value = result.sizelist.split(" ");
      productAllocation.value = result.allocation;
      userDiscountPercent.value = result.discountPercentage;
      userCountry.value = result.country;
      // Add useful fields to stock data
      processAllocation();
    } else {
      message.value = "Sorry, cannot retrieve product information at this time.";
    }
  } else {
    message.value = "Sorry, cannot retrieve product information - missing ID for this product.";
  }
});

// Query the order and get a qty as a string to display in a size table cell
function orderValue(itemid, ordertype, delivery) {
  const lineitem = cartorder.value.find((item) => {
    return item.itemid === itemid && item.ordertype === ordertype && item.delivery === delivery;
  });
  return lineitem ? lineitem.qty.toString() : "";
}
// Build a new line item for the order
function getLineitem(itemid) {
  // Get data for this sku from the API product stock allocation data
  var skudata = getSKUData(itemid);
  // Return the line item as an object
  return {
    itemid,
    qty: 0,
    maxqty: skudata.qty,
    bkorder: false,
    ordertype: "order",
    delivery: "",
    colour: skudata.colour,
    colourcode: skudata.colourcode,
    size: skudata.size,
    sku: skudata.sku,
    style: skudata.style,
    styletext: styletext.value,
    thumb: getColourThumb(skudata.colour),
    styleid: skudata.styleid,
    price: skudata.price,
    customerPrice: skudata.customerPrice,
  };
}
// Add the line item to the order array
function addToOrder(orderData) {
  var lineitem = getLineitem(orderData.itemid);
  // Commit new qty to lineitem
  lineitem.qty = parseInt(orderData.qty);
  lineitem.maxqty = parseInt(orderData.maxqty);
  lineitem.ordertype = orderData.orderType;
  lineitem.bkorder = orderData.orderType === "back order";
  lineitem.delivery = orderData.delivery;
  const newQty = orderData.qty > 0 ? orderData.qty.toString() : "";
  // Reset the table cell display
  resetItemQty(orderData.itemid, lineitem.bkorder, orderData.delivery, newQty);
  // Delete line item if present in the order state
  cartorder.value = cartorder.value.filter((item) => {
    return !(
      item.itemid === lineitem.itemid &&
      item.ordertype === lineitem.ordertype &&
      item.delivery === lineitem.delivery
    );
  });
  // Add lineitem or toss zero item
  if (lineitem.qty > 0) {
    cartorder.value.push(lineitem);
  }
  // Sort & Save
  processOrder();
}
</script>
<style scoped>
p.attention {
  font-size: 0.8em;
  color: #819fd2;
}
</style>
