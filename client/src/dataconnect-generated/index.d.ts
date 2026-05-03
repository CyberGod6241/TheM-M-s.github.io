import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateOrderData {
  order_insert: Order_Key;
}

export interface CreateOrderItemData {
  orderItem_insert: OrderItem_Key;
}

export interface CreateOrderItemVariables {
  orderId: UUIDString;
  menuItemId: UUIDString;
  quantity: number;
  subtotal: number;
  specialInstructions?: string | null;
}

export interface CreateOrderVariables {
  orderDate: DateString;
  totalAmount: number;
  status: string;
  orderType: string;
  restaurantId: UUIDString;
  deliveryAddress?: string | null;
  deliveryFee?: number | null;
}

export interface GetOrderItemsData {
  orderItems: ({
    id: UUIDString;
    quantity: number;
    subtotal: number;
    menuItem?: {
      id: UUIDString;
      name: string;
      price: number;
    } & MenuItem_Key;
      specialInstructions?: string | null;
  } & OrderItem_Key)[];
}

export interface GetOrderItemsVariables {
  orderId: UUIDString;
}

export interface GetUserOrdersData {
  orders: ({
    id: UUIDString;
    orderDate: DateString;
    totalAmount: number;
    status: string;
    orderType: string;
    deliveryAddress?: string | null;
    deliveryFee?: number | null;
    customer?: {
      id: UUIDString;
      displayName: string;
      email?: string | null;
    } & User_Key;
  } & Order_Key)[];
}

export interface GetUserOrdersVariables {
  userId: UUIDString;
}

export interface ListMenuItemsData {
  menuItems: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    category: string;
    imageUrl?: string | null;
    isAvailable?: boolean | null;
  } & MenuItem_Key)[];
}

export interface MenuItem_Key {
  id: UUIDString;
  __typename?: 'MenuItem_Key';
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Restaurant_Key {
  id: UUIDString;
  __typename?: 'Restaurant_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListMenuItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMenuItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMenuItemsData, undefined>;
  operationName: string;
}
export const listMenuItemsRef: ListMenuItemsRef;

export function listMenuItems(options?: ExecuteQueryOptions): QueryPromise<ListMenuItemsData, undefined>;
export function listMenuItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMenuItemsData, undefined>;

interface GetUserOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserOrdersVariables): QueryRef<GetUserOrdersData, GetUserOrdersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserOrdersVariables): QueryRef<GetUserOrdersData, GetUserOrdersVariables>;
  operationName: string;
}
export const getUserOrdersRef: GetUserOrdersRef;

export function getUserOrders(vars: GetUserOrdersVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOrdersData, GetUserOrdersVariables>;
export function getUserOrders(dc: DataConnect, vars: GetUserOrdersVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserOrdersData, GetUserOrdersVariables>;

interface GetOrderItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderItemsVariables): QueryRef<GetOrderItemsData, GetOrderItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrderItemsVariables): QueryRef<GetOrderItemsData, GetOrderItemsVariables>;
  operationName: string;
}
export const getOrderItemsRef: GetOrderItemsRef;

export function getOrderItems(vars: GetOrderItemsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemsData, GetOrderItemsVariables>;
export function getOrderItems(dc: DataConnect, vars: GetOrderItemsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemsData, GetOrderItemsVariables>;

interface CreateOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  operationName: string;
}
export const createOrderRef: CreateOrderRef;

export function createOrder(vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;
export function createOrder(dc: DataConnect, vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface CreateOrderItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderItemVariables): MutationRef<CreateOrderItemData, CreateOrderItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderItemVariables): MutationRef<CreateOrderItemData, CreateOrderItemVariables>;
  operationName: string;
}
export const createOrderItemRef: CreateOrderItemRef;

export function createOrderItem(vars: CreateOrderItemVariables): MutationPromise<CreateOrderItemData, CreateOrderItemVariables>;
export function createOrderItem(dc: DataConnect, vars: CreateOrderItemVariables): MutationPromise<CreateOrderItemData, CreateOrderItemVariables>;

