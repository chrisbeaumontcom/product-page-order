import axios from "axios";

export default function useAxios() {
  // An Axios GET fetch to an endpoint. Must contain a "success" boolean from API.
  const fetchStyleData = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      if (response && response.data && response.data.success === true) {
        return response.data;
      } else {
        throw new Error("Incorrect response");
      }
    } catch (err) {
      console.log("Get Products Error:", err.message);
      return { success: false };
    }
  };

  return { fetchStyleData };
}
