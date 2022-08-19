// Manage the stock allocation for this style
import { ref } from "vue";

export default function useStyleInfo(options) {
  const { delStyles, orderValue } = options;

  // Array of colours with nested size SKUs for the style on the current page
  const productAllocation = ref([]);

  // These style/colours are being discontinued so don't show backorders
  const getDeletion = (vstyle, vcolour) => {
    for (var i = 0; i < delStyles.length; i++) {
      if (delStyles[i].style === vstyle && delStyles[i].all) {
        return true;
      }
      if (
        delStyles[i].style === vstyle &&
        !delStyles[i].all &&
        delStyles[i].colours.indexOf(vcolour.toLowerCase()) > -1
      ) {
        return true;
      }
    }
    return false;
  };
  // Alter the API returned product stock allocation data to use in this app after loading
  const processAllocation = () => {
    // Add some useful fields to the allocation data library
    const allocation = productAllocation.value;
    if (allocation && allocation.length > 0) {
      allocation.forEach(function (colour) {
        colour.no_bkorder = getDeletion(style.value, colour.colour);
        colour.sizes.forEach(function (size) {
          size.ordqty = orderValue(size.itemid, "order", "");
          let boQtyTotal = 0;
          if (size.backorders) {
            size.backorders.forEach((backorder) => {
              const bkqty = orderValue(size.itemid, "back order", backorder.date);
              backorder.ordqty = bkqty;
              const intBoQty = bkqty !== "" ? parseInt(bkqty) : 0;
              boQtyTotal += intBoQty;
            });
          }
          size.ordqtybk = boQtyTotal;
          size.bkorder_display = boQtyTotal > 0;
        });
      });
    }
  };
  // Get the path to the thumb from the API product stock allocation data
  // Each Colour has a thumb path provided by the API data
  const getColourThumb = (vcolour) => {
    var allocation = productAllocation.value;
    if (allocation.length > 0) {
      for (const i in allocation) {
        if (allocation[i].colour === vcolour) {
          return allocation[i].thumb;
        }
      }
    }
    return "";
  };
  // Get data for this sku from the API product stock allocation data
  const getSKUData = (vitemid) => {
    const allocation = productAllocation.value;
    if (allocation.length > 0) {
      for (const j in allocation) {
        const sizes = allocation[j].sizes;
        for (const i in sizes) {
          if (sizes[i].itemid === vitemid) {
            return sizes[i];
          }
        }
      }
    }
    return {};
  };
  // Update the qty as a string display in table cell input
  const resetItemQty = function (vitemid, bkorder, delivery, qtyStr) {
    var allocation = productAllocation.value;
    if (allocation && allocation.length > 0) {
      // Colours array
      for (var j = 0; j < allocation.length; j++) {
        // Sizes array
        var sizes = allocation[j].sizes;
        for (var i = 0; i < sizes.length; i++) {
          if (sizes[i].itemid === vitemid) {
            if (bkorder && sizes[i].backorders) {
              // for backorders
              sizes[i].backorders.forEach((backorder) => {
                if (backorder.date === delivery) {
                  backorder.ordqty = qtyStr;
                }
              });
            } else {
              sizes[i]["ordqty"] = qtyStr;
            }
            return;
          }
        }
      }
    }
  };

  return {
    productAllocation,
    getColourThumb,
    getSKUData,
    resetItemQty,
    processAllocation,
  };
}
