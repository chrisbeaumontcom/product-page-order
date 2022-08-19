## Stock picking web app for an apparel wholesaler

The table displays all of the colour/size (SKU) combinations for a single apparel style number currently available in the warehouse. It is also possible to view and select back orders for future delivery when stock numbers are low.

![Image of app](https://res.cloudinary.com/web-school/image/upload/v1660878703/dev/resellers-app-vue3.png)

This version is Vue 3 Composition API but was originally written as a simple in-page Vue 2 script to add to a legacy ASP.NET C# / Razor wholesale catalogue site.

When a particular product page loads, the script picks up the style id and calls a rest api to load the current stock levels and account details of the logged in user reseller.

Session storage saves an array of lineitems accumulated across product pages.

The checkout page is not added here. It reads the stored order list and displays user data for the user to save a purchase order to the server.
