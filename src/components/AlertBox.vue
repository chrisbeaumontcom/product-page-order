<template>
  <dialog class="support-box" ref="dialog" @close="close">
    <div class="inner">
      <p>{{ supportText }}</p>
      <form class="text-right" method="dialog">
        <button class="btn btn-primary btn-sm btn-close" value="ok">OK</button>
        <button v-if="confirm" class="btn btn-secondary btn-sm btn-close btn-cancel" value="cancel">Cancel</button>
      </form>
    </div>
  </dialog>
</template>
<script setup>
// AlertBox component replaces the standard js alert() & confirm() with HTML Dialog
import { ref, watch, onMounted, onUnmounted, toRaw } from "vue";

const props = defineProps({
  open: Boolean,
  supportText: String,
  confirm: Boolean,
  alertData: Object,
});

const emit = defineEmits("close", "remove");

const dialog = ref(null);
const clickOutSide = ref(false);

watch(
  () => props.open,
  () => {
    if (props.open) {
      dialog.value.showModal();
    }
  }
);

const close = (ev) => {
  if (confirm && ev.target.returnValue === "ok" && !clickOutSide.value) {
    emit("remove", toRaw(props.alertData));
  }
  emit("close");
  clickOutSide.value = false;
};

const closeClickOutside = (event) => {
  const rect = dialog.value.getBoundingClientRect();
  const isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  if (!isInDialog) {
    clickOutSide.value = true;
    dialog.value.close();
  }
};

onMounted(() => {
  dialog.value.addEventListener("click", closeClickOutside);
});
onUnmounted(() => {
  if (dialog && dialog.value) {
    dialog.value.removeEventListener("click", closeClickOutside);
  }
});
</script>
<style scoped>
dialog.support-box::backdrop {
  background-color: rgba(30, 30, 30, 0.4);
}
dialog.support-box {
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 0;
}
dialog.support-box div.inner {
  padding: 20px;
}
button.btn-close {
  margin: 2px 10px;
}
</style>
