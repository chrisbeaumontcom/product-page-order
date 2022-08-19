// API path for product style info to add ID
export const urlProduct = import.meta.env.PROD
  ? import.meta.env.VITE_URL_PRODUCT_PROD
  : import.meta.env.VITE_URL_PRODUCT_DEV;

// Image root path
export const imagePath = import.meta.env.VITE_IMAGE_PATH;

// Key name for local session storage cart object
export const sessionKey = import.meta.env.VITE_SESSION_KEY;

// Show back orders at all?
export const setShowBackOrders = true;

// Max number of back orders to show?
export const maxBackOrders = 2;

// Show back orders if there is less than this qty
export const minOrderQtyForBackOrders = 15;

// Only show more back order dates if the first has less than this
export const maxFirstBkOrder = 20;

// These discontinued styles/colours should not show back orders
export const delStyles = [
  { style: "1768MW", all: true },
  { style: "1769WW", all: true },
  { style: "1767WD", all: true },
  { style: "1725WSK", all: true },
  { style: "1723WT", all: true },
  { style: "1730WT", all: false, colours: ["navy", "charcoal"] },
  { style: "1766WSK", all: false, colours: ["navy", "charcoal"] },
  { style: "1884WS", all: true },
  { style: "1885WS", all: true },
  { style: "1886WS", all: true },
  { style: "1890WS", all: true },
  { style: "1889WS", all: true },
  { style: "1251L", all: false, colours: ["mint"] },
  { style: "1251WL", all: false, colours: ["mint"] },
  { style: "1701L", all: false, colours: ["red"] },
  { style: "1701WL", all: false, colours: ["red"] },
  { style: "1267L", all: false, colours: ["taupe"] },
  { style: "1267S", all: false, colours: ["taupe"] },
  { style: "1891L", all: true },
  { style: "1891WL", all: true },
  { style: "1891WS", all: true },
  { style: "1376WL", all: true },
  { style: "1376L", all: true },
  { style: "1069L", all: true },
  { style: "1069WL", all: true },

  { style: "1710HS", all: true },
  { style: "1710WHS", all: true },
  { style: "1897L", all: true },
  { style: "1897WZ", all: true },
  { style: "1710L", all: false, colours: ["red"] },
  { style: "1710WL", all: false, colours: ["red"] },
  { style: "1763WSK", all: true },
  { style: "1764WT", all: true },

  { style: "1887MJ", all: false, colours: ["charcoal"] },
];
