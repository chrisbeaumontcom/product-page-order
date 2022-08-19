import { imagePath } from "../config";

// All product thumbnail paths
export const thumb = (img) => {
  return imagePath + img;
};
// Show and update cart in page header
export const updateBag = (itemscount) => {
  var display = document.getElementById("bagdisplay");
  if (display) {
    if (itemscount > 0) {
      showCart(true);
      display.innerHTML = itemscount + (itemscount === 1 ? " item" : " items");
    } else {
      showCart(false);
      display.innerHTML = "";
    }
  }
};
export const showCart = (val) => {
  var items = document.getElementsByClassName("cart-nav-item-empty");
  var items2 = document.getElementsByClassName("cart-nav-item");
  if (val) {
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = "none";
    }
    for (var i = 0; i < items2.length; i++) {
      items2[i].style.display = "block";
    }
  } else {
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = "block";
    }
    for (var i = 0; i < items2.length; i++) {
      items2[i].style.display = "none";
    }
  }
};
// Filters
export const formatPrice = (val) => {
  if (val) {
    return "$" + val.toFixed(2);
  }
  return "";
};
