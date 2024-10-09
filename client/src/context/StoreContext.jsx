import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const url = "https://server-five-amber-78.vercel.app/";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if(!cartItems[itemId]) {
      setCartItems((prev)=>({...prev, [itemId]:1}));
    }
    else {
      setCartItems((prev)=>({...prev, [itemId]:prev[itemId]+1}));
    }
    if (token) {
      await axios.post(url+"/api/cart/add", {itemId}, {headers: {token}});
    }
  }

  const removeFromCart = async (itemId) => {
    if(cartItems[itemId]===1) {
      const newCartItems = {...cartItems};
      delete newCartItems[itemId];
      setCartItems(newCartItems);
    }
    else {
      setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
    }
    if (token) {
      await axios.post(url+"/api/cart/remove", {itemId}, {headers: {token}});
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(let item in cartItems) {
      if (cartItems[item] > 0){
        totalAmount += food_list.find((food)=>food._id===item).price * cartItems[item];
      }
    }
    return totalAmount
  }

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");

    if (response.data.success) {
      setFoodList(response.data.data);
    }
  }

  const loadFoodCart = async (token) => {
    const response = await axios.post(url+"/api/cart/get", {}, {headers: {token}});
    if (response.data.success) {
      setCartItems(response.data.cartData);
    }

  }

  useEffect(()=> {

    async function loadData() {
      await fetchFoodList();
      const token = localStorage.getItem("token");
      if(token) {
        setToken(token);
        await loadFoodCart(token);
      }
    }
    loadData();
    
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreContextProvider.propTypes = {
  children: PropTypes.node
}

export default StoreContextProvider;