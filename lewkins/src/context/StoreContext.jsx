import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, verifyToken, logout } from '../services/api';

const StoreContext = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
  wishlist: {
    items: [],
  },
  auth: {
    isAuthenticated: false,
    user: null,
    loading: true,
  },
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
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const itemToRemove = action.payload;
      const cartItems = state.cart.cartItems.filter((item) => 
        !(item.id === itemToRemove.id && 
          item.size === itemToRemove.size && 
          item.color === itemToRemove.color)
      );
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
    case 'AUTH_LOGIN':
      return { 
        ...state, 
        auth: { 
          isAuthenticated: true, 
          user: action.payload, 
          loading: false 
        } 
      };
    case 'AUTH_LOGOUT':
      return { 
        ...state, 
        auth: { 
          isAuthenticated: false, 
          user: null, 
          loading: false 
        }, 
        cart: { cartItems: [] }, 
        wishlist: { items: [] } 
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: { ...state.auth.user, ...action.payload }
        }
      };
    case 'AUTH_SET_LOADING':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: action.payload
        }
      };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'AUTH_SET_LOADING', payload: true });
      
      if (isAuthenticated()) {
        try {
          const response = await verifyToken();
          if (response.valid) {
            dispatch({ type: 'AUTH_LOGIN', payload: response.user });
          } else {
            // Token invalid, logout
            await logout();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          await logout();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Auth helper functions
  const authActions = {
    login: (user) => {
      dispatch({ type: 'AUTH_LOGIN', payload: user });
    },
    logout: async () => {
      await logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    },
    updateUser: (userData) => {
      dispatch({ type: 'AUTH_UPDATE_USER', payload: userData });
    }
  };

  // Cart helper functions
  const cartActions = {
    addItem: (item) => {
      dispatch({ type: 'CART_ADD_ITEM', payload: item });
    },
    removeItem: (item) => {
      dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    },
    clearCart: () => {
      dispatch({ type: 'CART_CLEAR' });
    }
  };

  // Wishlist helper functions
  const wishlistActions = {
    addItem: (item) => {
      dispatch({ type: 'WISHLIST_ADD_ITEM', payload: item });
    },
    removeItem: (item) => {
      dispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
    }
  };

  const value = {
    state,
    dispatch,
    auth: authActions,
    cart: cartActions,
    wishlist: wishlistActions
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
