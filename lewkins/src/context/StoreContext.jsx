import React, { createContext, useReducer, useContext } from 'react';

const StoreContext = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
  wishlist: {
    items: [],
  },
  userInfo: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item.id === newItem.id);
      let cartItems;
      if (existItem) {
        cartItems = state.cart.cartItems.map((item) =>
          item.id === existItem.id ? newItem : item
        );
      } else {
        cartItems = [...state.cart.cartItems, newItem];
      }
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter((item) => item.id !== action.payload.id);
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR': {
      return { ...state, cart: { cartItems: [] } };
    }
    case 'WISHLIST_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.wishlist.items.find((item) => item.id === newItem.id);
      let items;
      if (existItem) {
        items = state.wishlist.items;
      } else {
        items = [...state.wishlist.items, newItem];
      }
      return { ...state, wishlist: { ...state.wishlist, items } };
    }
    case 'WISHLIST_REMOVE_ITEM': {
      const items = state.wishlist.items.filter((item) => item.id !== action.payload.id);
      return { ...state, wishlist: { ...state.wishlist, items } };
    }
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userInfo: null, cart: { cartItems: [] }, wishlist: { items: [] } };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
