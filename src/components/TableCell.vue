<template>
  <td :title="sizeHover(size.size)">
    <div v-if="size.qty > 0 && size.customerPrice > 0">
      <input
        type="text"
        class="qty"
        @input="orderSize"
        @focus="setInitialValue"
        :name="size.itemid"
        data-index="0"
        :data-id="size.itemid"
        :data-size="size.size"
        :data-maxqty="size.qty"
        data-order-type="order"
        data-delivery=""
        v-model="size.ordqty"
      />
      <div>
        {{ showQty(size.qty) }}<br />
        {{ showQtyTxt(size.qty) }}
      </div>
    </div>

    <div v-else class="input-plhd">&nbsp;</div>

    <div class="bkord" v-if="showBackOrders && size.bkorder === 0">
      <div class="toggler" @click="alertNoBkOrder" title="Contact customer service">B/O...</div>
    </div>

    <div class="bkord" v-if="showBackOrders && size.bkorder > 0">
      <div v-if="size.bkorder_display">
        <div v-if="showMoreBkOrders" v-for="(backorder, i) in backorders" :key="i">
          <input
            type="text"
            class="qty"
            @input="orderSize"
            @focus="setInitialValue"
            :name="size.itemid + bk + i"
            :data-index="i"
            :data-id="size.itemid"
            :data-size="size.size"
            :data-maxqty="backorder.qty"
            data-order-type="back order"
            :data-delivery="backorder.date"
            v-model="size.backorders[i].ordqty"
            :title="backorder.qty + ' on back order'"
          />
          <div class="bkord-eta">
            {{ formatBkOrderDate(backorder.date) }}
          </div>
        </div>

        <div v-else>
          <input
            type="text"
            class="qty"
            @input="orderSize"
            @focus="setInitialValue"
            :name="size.itemid + bk + i"
            :data-index="i"
            :data-id="size.itemid"
            :data-size="size.size"
            :data-maxqty="size.backorders[0].qty"
            data-order-type="back order"
            :data-delivery="size.backorders[0].date"
            v-model="size.backorders[0].ordqty"
            :title="size.backorders[0].qty + ' on back order'"
          />
          <div class="bkord-eta">
            {{ formatBkOrderDate(size.backorders[0].date) }}
          </div>
        </div>

        <div
          v-if="backOrderValue === 0"
          class="toggler"
          v-on:click="
            () => {
              size.bkorder_display = !size.bkorder_display;
            }
          "
          title="Hide back orders"
        >
          hide
        </div>
      </div>
      <div v-else="size.bkorder_display">
        <div
          class="toggler"
          v-on:click="
            () => {
              size.bkorder_display = !size.bkorder_display;
            }
          "
          title="Show back orders"
        >
          B/O...
        </div>
      </div>
    </div>
  </td>
</template>

<script setup>
import { ref, computed } from "vue";
import { setShowBackOrders, maxBackOrders, maxFirstBkOrder, minOrderQtyForBackOrders } from "../config";

const props = defineProps({
  size: Object,
  noBkorder: Boolean,
});

const backorders = computed(() => {
  if (props.size.backorders) {
    if (props.size.backorders.length > maxBackOrders) {
      return props.size.backorders.slice(0, 2);
    }
    return props.size.backorders;
  }
  return [];
});

const emit = defineEmits(["addToOrder", "alert"]);

// Initial value of any input when clicked on
const currentVal = ref("");
// Implements the above
const setInitialValue = (e) => {
  currentVal.value = e.target.value;
};

// Turn off backorders if needed
const showBackOrders = computed(() => {
  return props.size.qty < minOrderQtyForBackOrders && setShowBackOrders && !props.noBkorder;
});
// Only show the hide toggler if no backorders at all
const backOrderValue = computed(() => {
  if (props.size.backorders) {
    return props.size.backorders.reduce((previousValue, currentValue) => {
      const val = currentValue.ordqty === "" ? 0 : parseInt(currentValue.ordqty);
      return previousValue + val;
    }, 0);
  }
  return 0;
});
// Only show more back order dates if the first has less than this
// Implements above as a computed bool
const showMoreBkOrders = computed(() => {
  if (props.size.backorders) {
    return props.size.backorders[0].qty < maxFirstBkOrder;
  }
  return false;
});

// Handle Alert
const customerAlert = (text) => {
  emit("alert", text);
};

// No actual backorders to offer user
const alertNoBkOrder = () => {
  const text =
    "Please contact customer service regarding " +
    props.size.style +
    " " +
    props.size.colour +
    " size " +
    props.size.size;
  customerAlert(text);
};

// Order entry handled here for on:input
const orderSize = (e) => {
  const numTest = /^[0-9]+$/;
  const { id, orderType, maxqty, delivery, size, index } = e.target.dataset;

  const newVal = e.target.value;
  const isBackorder = orderType === "back order";

  // Test string input value
  if (newVal != "" && !numTest.test(newVal)) {
    customerAlert("Warning: not a positive number.");
    if (isBackorder) {
      props.size.backorders[index].ordqty = currentVal.value;
    } else {
      props.size.ordqty = currentVal.value;
    }
    return;
  }
  // Assign input value to an int
  const inputVal = newVal ? parseInt(newVal) : 0;

  // Respond to new value
  if (inputVal > parseInt(maxqty)) {
    customerAlert("Warning: only " + maxqty + " units available in size: " + size + "!");
    if (isBackorder) {
      props.size.backorders[index].ordqty = currentVal.value;
    } else {
      props.size.ordqty = currentVal.value;
    }
    return;
  }
  if (inputVal === 0) {
    e.target.value = "";
  }

  // All good - send it up
  emit("addToOrder", { itemid: id, orderType, delivery, maxqty, qty: inputVal });
  currentVal.value = newVal;
};

// Filters
const showQty = function (v) {
  if (v === "na") {
    return "";
  }
  if (v === "0") {
    return "Out of stock*";
  }
  return v;
};
const showQtyTxt = function (v) {
  if (v === "na" || v === "0") {
    return "";
  }
  return "In stock";
};
const sizeHover = function (v) {
  return "Size: " + v;
};
const formatBkOrderDate = function (bdate) {
  if (bdate) {
    return "ETA " + formatDate(bdate);
  }
  // if (qty === 0 && bqty === 0) {
  //   return "Contact Customer Service";
  // }
  return "";
};
const formatDate = function (v, short = false) {
  var d = new Date(v);
  var s =
    ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("" + d.getFullYear()).slice(-2);
  if (short) {
    var b = s.split("/");
    b.pop();
    return b.join("/");
  }
  return s;
};
</script>
