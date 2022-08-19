<template>
  <div>
    <table v-if="stylelist.length" class="table-hover orderdata" id="orderData">
      <tr class="header">
        <td>Image</td>
        <td>Style</td>
        <td class="center">Colour</td>
        <td>Description</td>
        <td class="center">Size</td>
        <td class="center">Price</td>
        <td class="center">Qty</td>
        <td class="center">Remove</td>
        <td class="center">Sub Total</td>
      </tr>
      <tr v-for="(record, index) in orders" v-bind:key="index">
        <td class="center">
          <img :src="thumb(record.thumb)" alt="image" class="lineitem" />
        </td>
        <td>
          {{ record.style }}
        </td>
        <td class="center">
          {{ record.colour }}
        </td>
        <td>{{ record.styletext }}</td>
        <td class="center">
          {{ record.size }}
        </td>
        <td class="price">
          {{ formatPrice(record.price) }}
        </td>
        <td class="center">
          <input
            type="text"
            class="qty"
            @input="resetSize"
            @focus="setInitialValue"
            :data-id="record.itemid"
            :data-size="record.size"
            :data-maxqty="record.maxqty"
            data-order-type="order"
            data-delivery=""
            :value="record.qty"
          />
        </td>
        <td class="center">
          <button
            v-on:click="confirmRemove"
            :data-id="record.itemid"
            data-order-type="order"
            data-delivery=""
            class="btn btn-default btn-remove"
          >
            &times;
          </button>
        </td>
        <td class="price">
          {{ formatPrice(record.price * record.qty) }}
        </td>
      </tr>

      <!-- <tr v-if="backorders.length > 0">
        <td colspan="9">Back Order Items</td>
      </tr> -->

      <tr v-for="(record, index) in backorders" v-bind:key="index" class="backorder">
        <td class="center">
          <img :src="thumb(record.thumb)" alt="image" class="lineitem" />
        </td>
        <td>
          {{ record.style }}
        </td>
        <td class="center">
          {{ record.colour }}
        </td>
        <td>
          <i>{{ record.styletext }} (Backorder {{ formatDate(record.delivery) }})</i>
        </td>
        <td class="center">
          {{ record.size }}
        </td>
        <td class="price">
          {{ formatPrice(record.price) }}
        </td>
        <td class="center">
          <input
            type="text"
            class="qty"
            @input="resetSize"
            @focus="setInitialValue"
            :data-id="record.itemid"
            :data-size="record.size"
            :data-maxqty="record.maxqty"
            data-order-type="back order"
            :data-delivery="record.delivery"
            :value="record.qty"
          />
        </td>
        <td class="center">
          <button
            v-on:click="confirmRemove"
            :data-id="record.itemid"
            data-order-type="back order"
            :data-delivery="record.delivery"
            class="btn btn-default btn-remove"
          >
            &times;
          </button>
        </td>
        <td class="price">
          {{ formatPrice(record.customerPrice * record.qty) }}
        </td>
      </tr>
      <tr>
        <td colspan="8" style="text-align: right; padding-right: 5px">Sub total</td>
        <td class="price">{{ formatPrice(subTotal) }}</td>
      </tr>
      <tr v-if="discount > 0 && discountPercentage > 0">
        <td colspan="8" style="text-align: right; padding-right: 5px">
          Discount {{ formatDiscount(discountPercentage) }}
        </td>
        <td class="price">{{ formatPrice(discount) }}</td>
      </tr>
      <tr v-if="total > 0">
        <td colspan="8" style="text-align: right; padding-right: 5px">Total</td>
        <td class="price">{{ country }}{{ formatPrice(total) }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatPrice, thumb } from "../helpers/helpers";

const props = defineProps({
  stylelist: Array,
  country: String,
  discount: Number,
  discountPercentage: Number,
  subTotal: Number,
  total: Number,
  openAlertBox: Function,
  dialogOk: Boolean,
});

const emit = defineEmits(["addToOrder", "remove"]);

const currentVal = ref("");

const orders = computed(() => {
  return props.stylelist.filter((i) => {
    return !i.bkorder;
  });
});
const backorders = computed(() => {
  return props.stylelist.filter((i) => {
    return i.bkorder;
  });
});

const setInitialValue = (e) => {
  currentVal.value = e.target.value;
};

const confirmRemove = (event) => {
  const { id, orderType, delivery } = event.target.dataset;
  if (props.dialogOk) {
    props.openAlertBox("Are you sure you want to remove this from your order?", true, {
      itemid: id,
      orderType,
      delivery,
    });
  } else {
    if (confirm("Are you sure you want to remove this from your order?")) {
      emit("remove", { itemid: id, orderType, delivery });
    }
  }
};

const resetSize = (e) => {
  const numTest = /^[0-9]+$/;
  const { id, orderType, maxqty, delivery, size } = e.target.dataset;

  const newVal = e.target.value;

  // Test string input value
  if (newVal != "" && !numTest.test(newVal)) {
    props.openAlertBox("Warning: not a positive number.");

    e.target.value = currentVal.value;
    return;
  }

  // Assign input value to an int
  const inputVal = newVal ? parseInt(newVal) : 0;

  // Respond to new value
  if (inputVal > parseInt(maxqty)) {
    props.openAlertBox("Warning: only " + maxqty + " units in size: " + size + " available!");
    e.target.value = currentVal.value;
    return;
  }
  if (inputVal === 0) {
    if (!confirm("Are you sure you want to remove this from your order?")) {
      e.target.value = currentVal.value;
      return;
    }
    e.target.value = "";
  }

  // All good - send it up
  emit("addToOrder", { itemid: id, orderType, delivery, maxqty, qty: inputVal });
  currentVal.value = newVal;
};

const formatDiscount = function (v) {
  if (v) {
    return v + "%";
  }
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

<style scoped>
table.orderdata {
  width: 100%;
}
table.orderdata tr.header {
  background-color: #999;
}
table.orderdata tr.header td {
  color: #ffffff;
  padding: 2px;
}
table.orderdata tr td {
  border: 1px solid #aaa;
  padding: 4px;
}
table.orderdata tr td.price {
  text-align: right;
  padding-right: 10px;
}
table.orderdata tr td.center {
  text-align: center;
}
table.orderdata tr.backorder td {
  font-style: italic;
  color: #888;
}
table.orderdata tr td img {
  text-align: center;
  width: 30px;
  height: auto;
}
button.btn-remove {
  font-size: 2em;
  font-weight: bold;
  line-height: 0.6;
  padding: 0 4px 4px 4px;
}
input.qty {
  width: 40px;
  text-align: center;
}
img.lineitem {
  width: 30px;
  height: auto;
}
</style>
