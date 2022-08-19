// Composable for AlertBox component which replaces the standard js alert() and confirm()
import { ref } from "vue";

export default function useAlert() {
  const dialogOK = ref(false);
  const isConfirmBox = ref(false);
  const showAlert = ref(false);
  const supportText = ref("");
  const alertData = ref(null);

  const openAlertBox = (text, confirm = false, obj = {}) => {
    supportText.value = text;
    alertData.value = obj;
    isConfirmBox.value = confirm;
    if (dialogOK.value) {
      showAlert.value = true;
    } else {
      alert(supportText.value);
    }
  };

  const closeAlertBox = () => {
    // Reset the Alert Box on close
    isConfirmBox.value = false;
    supportText.value = "";
    showAlert.value = false;
  };
  return { dialogOK, isConfirmBox, showAlert, supportText, openAlertBox, closeAlertBox, alertData };
}
