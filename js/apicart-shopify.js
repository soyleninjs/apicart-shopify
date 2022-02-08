/* eslint-disable babel/camelcase, require-atomic-updates */

window.apiCart = window.apiCart || {};

window.apiCart.headerFetch = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

window.apiCart.updateHeaderCount = () => {
  const { item_count } = window.apiCart.stateCart;
  document.querySelector("[data-cart-count-text]").textContent = item_count;
};

window.apiCart.getQuantityProductInCart = (id) => {
  const itemExist = window.apiCart.stateCart.items.filter((item) => {
    return item.id === id;
  });

  if (itemExist.length > 0) {
    const itemQuantityInCart = Number(itemExist[0].quantity);
    return itemQuantityInCart;
  }

  return null;
};

window.apiCart.setKeyProductsInCart = () => {
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

window.apiCart.getCart = async () => {
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

window.apiCart.clearCart = async () => {
  const result = await window.fetch("/cart/clear.json");

  if (result.status === 200) {
    await getCart();
    return result.json();
  }

  throw new Error(
    `Fallo la petición!, el resultado regreso: ${result.status} ${result.statusText}`
  );
};

window.apiCart.addItem = async (id, quantity = 1, properties = {}) => {
  // add infinite
  const result = await window.fetch("/cart/add.json", {
    method: "POST",
    headers: window.apiCart.headerFetch,
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

window.apiCart.addItems = async (arrayItems) => {
  // not inifite add
  const result = await window.fetch("/cart/add.json", {
    method: "POST",
    headers: window.apiCart.headerFetch,
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

window.apiCart.updateItems = async (objectItems) => {
  // add infinite
  /* 

    BUG
    problemas al actualizar productos con el mismo id pero diferentes propiedades

  */
  const result = await window.fetch("/cart/update.json", {
    method: "POST",
    headers: window.apiCart.headerFetch,
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

window.apiCart.changeItem = async (key, quantity = 1, properties = {}) => {
  // not infinite
  // truncate on max stock
  const result = await window.fetch("/cart/change.json", {
    method: "POST",
    headers: window.apiCart.headerFetch,
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

window.apiCart.removeItem = async (key) => {
  const result = await window.fetch("/cart/change.json", {
    method: "POST",
    headers: window.apiCart.headerFetch,
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

window.apiCart.getCart();
