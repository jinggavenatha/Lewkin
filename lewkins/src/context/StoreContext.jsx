import React, { createContext, useReducer, useContext, useEffect } from 'react';

const StoreContext = createContext();

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const savedUserInfo = localStorage.getItem('userInfo');
    const savedCart = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlistItems');

    return {
      cart: {
        cartItems: savedCart ? JSON.parse(savedCart) : [],
      },
      wishlist: {
        items: savedWishlist ? JSON.parse(savedWishlist) : [],
      },
      userInfo: savedUserInfo ? JSON.parse(savedUserInfo) : null,
    };
  } catch (error) {
    console.error('Error loading initial state from localStorage:', error);
    return {
      cart: { cartItems: [] },
      wishlist: { items: [] },
      userInfo: null,
    };
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      );
      
      let cartItems;
      if (existItem) {
        cartItems = state.cart.cartItems.map((item) =>
          item.id === existItem.id && 
          item.size === existItem.size && 
          item.color === existItem.color
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        cartItems = [...state.cart.cartItems, newItem];
      }

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const itemToRemove = action.payload;
      const cartItems = state.cart.cartItems.filter((item) => 
        !(item.id === itemToRemove.id && 
          item.size === itemToRemove.size && 
          item.color === itemToRemove.color)
      );

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_UPDATE_ITEMS': {
      const cartItems = action.payload;
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR': {
      // Clear from localStorage
      localStorage.removeItem('cartItems');
      
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

      // Save to localStorage
      localStorage.setItem('wishlistItems', JSON.stringify(items));
      
      return { ...state, wishlist: { ...state.wishlist, items } };
    }
    case 'WISHLIST_REMOVE_ITEM': {
      const items = state.wishlist.items.filter((item) => item.id !== action.payload.id);
      
      // Save to localStorage
      localStorage.setItem('wishlistItems', JSON.stringify(items));
      
      return { ...state, wishlist: { ...state.wishlist, items } };
    }
    case 'USER_LOGIN': {
      const userInfo = action.payload;
      
      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      return { ...state, userInfo };
    }
    case 'USER_LOGOUT': {
      // Clear from localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('wishlistItems');
      
      return { 
        ...state, 
        userInfo: null, 
        cart: { cartItems: [] }, 
        wishlist: { items: [] } 
      };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadInitialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
