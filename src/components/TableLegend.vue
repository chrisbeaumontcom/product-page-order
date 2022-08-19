<template>
  <tr class="header">
    <th>{{ style }}</th>
    <th v-for="(size, i) in sizelist" v-bind:key="i">{{ size }}</th>
  </tr>
</template>

<script>
export default {
  props: {
    sizelist: Array,
    style: String,
  },
};
</script>
