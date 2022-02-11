# APICart Shopify

Libreria de metodos para usar la api cart de shopify en el storefront con javascript.

[![npm](https://img.shields.io/npm/v/apicart-shopify?color=check&style=plastic)](https://www.npmjs.com/package/apicart-shopify)

## Contenido

- [Instalar](#Instalar)
- [Contenido](#Contenido)

## Instalar

**APICart Shopify** esta disponible en NPM con el nombre de `apicart-shopify`, se puede instalar con Yarn o NPM

```sh
yarn add apicart-shopify
```

```sh
npm i apicart-shopify
```

## Contenido

Esta cuenta con varios métodos que podemos acceder a ellos importando la librería:

```javascript
import apiCart from "apicart-shopify";
```

Ademas se resguardan dentro de un objeto en **Ambito global,** es decir, se alojan en un espacio de **window**.

Este espacio se le dio nombre de **apiCart.**

Seguido a esto se agregan todos los métodos y variables requeridas para el funcionamiento:

### Utilidades

- **stateCart [Object]**
  Esta variable aloja el state del cart.

  Y siempre queda alojada en **Ambito global,** es decir, se alojan en un espacio de “**_window_**”.

  Esta variable se va actualizando con la función de **getCart**

  ```javascript
  window.apiCart.stateCart = {};
  ```

- **updateHeaderCount [Function]**
  Este método solo sirve para actualizar el contador del total de productos en carrito del header.

  Solo basta con colocar el data de **data-cart-count-text** en el spacio que contendrá el contador.

  Este método se manda a llamar dentro del metodo **getCart**

  ```javascript
  apiCart.updateHeaderCount();
  ```

- **getQuantityProductInCart [Function] [Return - Number]**
  Este método recupera la cantidad actual de un producto ya existente en carrito.

  Retorna la cantidad del producto en carrito.

  Solo se necesita pasar él id del producto.

  ```javascript
  const quantity = window.apiCart.getQuantityProductInCart(id);
  ```

- **setKeyProductsInCart [Function]**
  Este método sirve para recuperar los keys generados de cada producto en cart, y estos los aloja en un data llamado **key** (**data-key**), para en un futuro usarlos en donde se requiera.

  Este valor se almacena en todos los elementos/botones qué contengan el parámetro **button-ajax-cart**, ya que la función hace recorrido sobre todos estos elementos.

  Este método se manda a llamar dentro del metodo **getCart**

  ```javascript
  window.apiCart.setKeyProductsInCart();
  ```

### Métodos

- **getCart [Function] [Promise] [Return - Object]**
  Este método sirve para obtener el estado actual del carrito, ademas, actualiza el **stateCart** para que después pueda ser utilizado en cualquier lugar.

  Ademas dentro de este mismo método se manda a llamar **updateHeaderCount y setKeyProductsInCart**

  Este método se manda a llamar como **CALLBACK** en todos los métodos modificadores del carrito.

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .getCart()
    .then(() => {})
    .catch(() => {});
  ```

- **clearCart [Function] [Promise] [Return - Object]**
  Este método sirve para limpiar el carrito totalmente, borrando todos los productos agregados.

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .clearCart()
    .then(() => {})
    .catch(() => {});
  ```

- **addItem [Function] [Promise] [Return - Object]**
  Este método agrega un producto individualmente, pasándole el id, la cantidad a agregar y también las propiedades.

  **NOTA:** Esta función agrega infinitamente, no importa si el producto/variante tiene poco stock, el inventario es traqueado, etc.

  #### Parámetros

  - id **[Number] [Required]**
    Recibe el id de la variante a agregar
  - quantity **[Number] [Optional]**
    Recibe la cantidad a agregar
    **_Valor Default = 1_**
  - properties **[Object] [Optional]**
    Recibe las propiedades que se agregaran al producto
    **_Valor Default = {}_**

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .addItem(id, quantity, properties)
    .then(() => {})
    .catch(() => {});
  ```

- **addItems [Function] [Promise] [Return - Object]**
  Este método agrega varios productos en un solo llamado, pasando un array con todos los items a agregar, donde cada uno cuenta con él id, quantity y properties.

  **NOTA:** Esta función no agrega infinitamente, se toma en cuenta que el producto/variante tenga el stock sea mayor a 0, el inventario es traqueado, etc, es decir, si agregas mas de lo que hay en inventario disponible la promesa sera rechazada y no se agregara la cantidad colocada.

  ```javascript
  const arrayItems = [
    {
      id: 36110175633573,
      quantity: 2,
    },
    {
      id: 9830175673827,
      quantity: 4,
      properties: {
        "First name": "Caroline",
      },
    },
  ];
  ```

  #### Parámetros

  - arrayItems **[Array] [Required]**
    Recibe el array con la lista de objetos, en el que cada objeto contiene los datos del producto como el id, quantity y properties

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .addItems(arrayItems)
    .then(() => {})
    .catch(() => {});
  ```

- **updateItems [Function] [Promise] [Return - Object]**

  Este método solo es para modificar las cantidades de los productos en el carrito.

  Recibe un objeto, el cual solo se tiene que colocar él id del producto y la cantidad nueva a la que se actualizara.

  **NOTA:** Esta función agrega infinitamente, no importa si el producto/variante tiene poco stock, el inventario es traqueado, etc.

  **IMPORTANTE:** Esta función cuenta con el problema de que se guía por el **id** del producto, así que este puede entrar en conflicto cuando agregues el mismo producto pero con diferentes propiedades (line_items), sabiendo que shopify cuenta como otro producto si las propiedades son diferentes aunque sea el mismo producto.
  Si aparece este percance, la función seguirá funcionando pero modificara solo el ultimo producto agregado con ese id.

  Este puede solo recibir un solo producto o varios a la vez.

  ```javascript
  const objectItems = {
    // [id]: [quantity],
    794864233: 3,
    794864549: 90,
  };
  ```

  #### Parámetros

  - objectItems **[Object] [Required]**
    Recibe el objeto los productos a modificar, solo recibe el id y el quantity.

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .updateItems(objectItems)
    .then(() => {})
    .catch(() => {});
  ```

- **changeItem [Function] [Promise] [Return - Object]**
  Este método modifica un producto en especifico ya existente en carrito, hay que pasar los parámetros a modificar como el key, quantity y properties.
  Nota: Si pasas las properties como un objeto vacío, sobrescribirá las propiedades que ya estaban antes, posiblemente hay que tener cuidado de mejor no colocar esa propiedad, así esta no se sobrescribirá.

  La función de **setKeyProductsInCart** obtiene y coloca estas key automáticamente en un data, de aqui puedes obtener este valor.

  **NOTA:** Esta función no agrega infinitamente, se toma en cuenta que el producto/variante tenga el stock sea mayor a 0, el inventario es traqueado, etc, aunque en este caso, si agregas mas cantidad de la que se tiene disponible, se agregara los mas que se pueda, dejando la cantidad igual a stock disponible.

  #### Parámetros

  - key **[String] [Required]**
    Recibe el key asignado para el producto cuando se agrego a carrito.
  - quantity **[Number] [Required]**
    Recibe la cantidad a modificar.
  - properties **[Object] [Optional]**
    Recibe las propiedades que se agregaran al producto
    **_Valor Default = {}_**

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .changeItem(key, quantity, properties)
    .then(() => {})
    .catch(() => {});
  ```

- **removeItem [Function] [Promise] [Return - Object]**
  Este método remove el producto en carrito, solo hay que pasar el key asignado al producto por el carrito cuando se agrego.

  La función de **setKeyProductsInCart** obtiene y coloca estas key automáticamente en un data, de aqui puedes obtener este valor.

  ```javascript
  const key = "41755980529827:e0f073dbf1b535b8eff131e151df3451";
  ```

  #### Parámetros

  - **key [String] [Required]**
    Recibe el key asignado para el producto cuando se agrego a carrito.

  Este método al ser una **PROMISE** debe de utilizarse con **.then()** y **.catch()**

  ```javascript
  window.apiCart
    .removeItem(key)
    .then(() => {})
    .catch(() => {});
  ```
