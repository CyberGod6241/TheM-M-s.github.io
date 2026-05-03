# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listMenuItems, getUserOrders, getOrderItems, createOrder, createOrderItem } from '@dataconnect/generated';


// Operation listMenuItems: 
const { data } = await ListMenuItems(dataConnect);

// Operation getUserOrders:  For variables, look at type GetUserOrdersVars in ../index.d.ts
const { data } = await GetUserOrders(dataConnect, getUserOrdersVars);

// Operation getOrderItems:  For variables, look at type GetOrderItemsVars in ../index.d.ts
const { data } = await GetOrderItems(dataConnect, getOrderItemsVars);

// Operation createOrder:  For variables, look at type CreateOrderVars in ../index.d.ts
const { data } = await CreateOrder(dataConnect, createOrderVars);

// Operation createOrderItem:  For variables, look at type CreateOrderItemVars in ../index.d.ts
const { data } = await CreateOrderItem(dataConnect, createOrderItemVars);


```