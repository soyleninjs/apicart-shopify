/* eslint-disable babel/camelcase, require-atomic-updates */
/* api-cart-shopify.js 0.5.0 */

const headerFetch = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const updateHeaderCount = () => {
  const { item_count } = window.apiCart.stateCart;
  document.querySelector("[data-cart-count-text]").textContent = item_count;
};

const getQuantityProductInCart = (id) => {
  const itemExist = window.apiCart.stateCart.items.filter((item) => {
    return item.id === id;
  });

  if (itemExist.length > 0) {
    const itemQuantityInCart = Number(itemExist[0].quantity);
    return itemQuantityInCart;
  }

  return null;
};

const setKeyProductsInCart = () => {
  document.querySelectorAll("[data-button-ajax]").forEach((buttonAjax) => {
    buttonAjax.removeAttribute("data-key");

    window.apiCart.stateCart.items.every((item) => {
      const itemKey = item.key;
      const itemVariantId = item.variant_id;
      const buttonVariantId = Number(buttonAjax.dataset.productId);

      if (itemVariantId === buttonVariantId) {
        buttonAjax.dataset.key = itemKey;
        return false;
      }

      return true;
    });
  });
};

const getCart = async () => {
  const result = await window.fetch("/cart.js");

  if (result.status === 200) {
    const objectCart = await result.json();
    window.apiCart.stateCart = objectCart;
    setKeyProductsInCart();
    updateHeaderCount();
    return objectCart;
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const clearCart = async () => {
  const result = await window.fetch("/cart/clear.json");

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const addItem = async (id, quantity = 1, properties = {}) => {
  // add infinite
  const result = await window.fetch("/cart/add.json", {
    method: "POST",
    headers: headerFetch,
    body: JSON.stringify({
      id,
      quantity,
      properties,
    }),
  });

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const addItems = async (arrayItems) => {
  // not inifite add
  const result = await window.fetch("/cart/add.json", {
    method: "POST",
    headers: headerFetch,
    body: JSON.stringify({
      items: arrayItems,
    }),
  });

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const updateItems = async (objectItems) => {
  // add infinite
  /* 

    BUG
    problemas al actualizar productos con el mismo id pero diferentes propiedades

  */
  const result = await window.fetch("/cart/update.json", {
    method: "POST",
    headers: headerFetch,
    body: JSON.stringify({
      updates: objectItems,
    }),
  });

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const changeItem = async (key, quantity = 1, properties = {}) => {
  // not infinite
  // truncate on max stock
  const result = await window.fetch("/cart/change.json", {
    method: "POST",
    headers: headerFetch,
    body: JSON.stringify({
      id: key,
      quantity,
      properties,
    }),
  });

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const removeItem = async (key) => {
  const result = await window.fetch("/cart/change.json", {
    method: "POST",
    headers: headerFetch,
    body: JSON.stringify({
      id: key,
      quantity: 0,
    }),
  });

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

const apiCart = {
  updateHeaderCount,
  getQuantityProductInCart,
  setKeyProductsInCart,
  getCart,
  clearCart,
  addItem,
  addItems,
  updateItems,
  changeItem,
  removeItem,
};

window.apiCart = window.apiCart || apiCart;
window.apiCart.getCart();

export default apiCart;

/*
rawhair.mx

*/
