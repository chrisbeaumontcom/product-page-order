import { ref, computed } from "vue";

export default function useCartOrder(sessionKey, options) {
  // The cart is an array of lineitems
  // [{itemid,qty,maxqty,bkorder,ordertype,delivery,colour,colourcode,size,sku,style,styletext,thumb,styleid,price,customerPrice}]
  const { id, discountPercent, sizelist, resetItemQty } = options;
  const cartorder = ref([]);
  const styleId = ref(id);
  const percentage = ref(discountPercent);
  const sizes = ref(sizelist);

  // List all line items in the order that match this product page by product id (int)
  const stylelist = computed(() => {
    return cartorder.value.filter((item) => {
      return item.styleid === styleId.value;
    });
  });
  // "Customer price" totals for this product id only
  const subTotal = computed(() => {
    const tot = stylelist.value.reduce((total, acc) => {
      return total + parseFloat(acc.customerPrice) * 100 * acc.qty;
    }, 0);
    return tot / 100;
  });
  // Some customers have a discount
  const discount = computed(() => {
    const t = Math.round(subTotal.value * 100 * percentage.value) / 100;
    return t / 100;
  });
  // Total after discount
  const total = computed(() => {
    return subTotal.value - discount.value;
  });

  // Get the cart from session storeage
  const getOrderData = () => {
    if (sessionStorage && sessionStorage[sessionKey]) {
      return JSON.parse(sessionStorage.getItem(sessionKey));
    }
    return [];
  };
  // Save the order array to session storage after an update
  const setOrderData = () => {
    sessionStorage.setItem(sessionKey, JSON.stringify(cartorder.value));
  };

  // Total number of items in the order
  const countCartItems = computed(() => {
    return cartorder.value.reduce((total, acc) => {
      return total + parseInt(acc.qty);
    }, 0);
  });

  // Sort the order array before saving it after any update
  const sortOrder = () => {
    // Sizes could be numeric or s m l xl 2xl so use the index of the list to order them
    const sizeIndex = (val) => {
      return sizes.value.indexOf(val);
    };

    if (cartorder.value.length > 0) {
      // Sort back orders by date
      cartorder.value = cartorder.value.sort((a, b) => {
        const d = Date.now();
        const x = a.delivery === "" ? d : Date.parse(a.delivery);
        const y = b.delivery === "" ? d : Date.parse(b.delivery);
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      // Sort by size index
      cartorder.value = cartorder.value.sort((a, b) => {
        const x = sizeIndex(a.size);
        const y = sizeIndex(b.size);
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      // Sort by colour (alpha)
      cartorder.value = cartorder.value.sort((a, b) => {
        const x = a.colour.toLowerCase();
        const y = b.colour.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      // Sort by Style (alpha)
      cartorder.value = cartorder.value.sort((a, b) => {
        const x = a.style.toLowerCase();
        const y = b.style.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    }
  };
  // After any order update re-sort and save to session storage
  const processOrder = () => {
    sortOrder();
    setOrderData();
  };
  // Filter out the order line item and reset the table cell input
  const removeFromOrder = function (data) {
    const { itemid, orderType, delivery } = data;
    const isBackorder = orderType === "back order";
    cartorder.value = cartorder.value.filter(function (item) {
      return !(item.itemid === itemid && item.ordertype === orderType && item.delivery === delivery);
    });
    resetItemQty(itemid, isBackorder, delivery, "");
    processOrder();
  };

  return {
    cartorder,
    countCartItems,
    getOrderData,
    setOrderData,
    sortOrder,
    processOrder,
    removeFromOrder,
    stylelist,
    subTotal,
    discount,
    total,
  };
}
