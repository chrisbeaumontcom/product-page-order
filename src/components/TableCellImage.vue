<template>
  <td className="colour-img">
    <div>
      <em>{{ colour }}</em>
    </div>
    <img :src="thumb(image)" alt="thumbnail image" />
    <div>{{ price }}</div>
  </td>
</template>

<script setup>
import { thumb } from "../helpers/helpers";
const props = defineProps({
  colour: String,
  image: String,
  price: String,
});
</script>
