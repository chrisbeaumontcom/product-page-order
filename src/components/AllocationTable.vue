<template>
  <div v-if="allocation">
    <table class="table table-hover stockdata">
      <thead>
        <TableLedgend v-bind:sizelist="sizelist" v-bind:style="style" />
      </thead>
      <tbody>
        <tr v-for="(record, index) in allocation" v-bind:key="index">
          <TableCellImage
            :colour="record.colour"
            :image="record.thumb"
            :price="country + formatPrice(record.customerPrice)"
          />
          <TableCell
            v-for="size in record.sizes"
            :size="size"
            :key="size.itemid"
            @add-to-order="addToOrder"
            @alert="openAlertBox"
            :no-bkorder="record.no_bkorder"
          />
        </tr>
        <tr class="header" v-if="allocation.length > 4">
          <td>{{ style }}</td>
          <td class="" v-for="(size, index) in sizelist" v-bind:key="index">
            {{ size }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import TableLedgend from "./TableLegend.vue";
import TableCellImage from "./TableCellImage.vue";
import TableCell from "./TableCell.vue";
import { formatPrice } from "../helpers/helpers";

const props = defineProps({
  allocation: Array,
  addToOrder: Function,
  removeFromOrder: Function,
  country: String,
  sizelist: Array,
  style: String,
  openAlertBox: Function,
});
</script>

<style>
table.stockdata {
  width: 100%;
}
table.stockdata thead {
  position: sticky;
  inset-block-start: 138px; /* "top" 138 */
  z-index: 4;
}
table.stockdata tr.header {
  background-color: #999;
}
table.stockdata tr.header th {
  color: #ffffff;
  padding: 2px;
  text-align: center;
  font-weight: normal;
  font-size: 0.8em;
  border: 1px solid #aaa;
}
table.stockdata tr td {
  border: 1px solid #aaa;
  text-align: center;
  max-width: 0px;
  position: relative;
  vertical-align: top;
  padding: 4px 0;
  font-size: 0.7em;
  line-height: 1.2;
}
table.stockdata tr.header td {
  color: #ffffff;
  padding: 2px;
}
table.stockdata tr td img {
  width: 100%;
  height: auto;
  max-width: 60px;
}
table.stockdata tr td.colour-img {
  padding: 2px 0;
  font-size: 0.7em;
}
table.stockdata tr td.na {
  background-color: #ededed;
}
table.stockdata tr td.zero {
  color: #666;
}
table.stockdata tr td input {
  font-size: 1em;
  width: 32px;
  height: 24px;
  padding: 2px;
  text-align: center;
}
/* input placeholder */
table.stockdata tr td div.input-plhd {
  height: 1.5rem;
}
table.stockdata tr td div {
  width: 100%;
  margin: 1px 0;
  padding: 1px 0;
}
table.stockdata tr td div.bkord {
  color: #666;
  margin: 1px 0;
  padding: 1px 0;
}
table.stockdata tr td div.bkord-eta {
  white-space: nowrap;
  font-size: 0.7em;
}
div.toggler {
  cursor: pointer;
  color: #819fd2;
  text-decoration: underline;
}
</style>
