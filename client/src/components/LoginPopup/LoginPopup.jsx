import { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({setShowLogin}) => {

  const {url, setToken} = useContext(StoreContext);

  const [currState, setCurrState] = useState("Sign Up")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangeHandler = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const onLogin = async (e) => {
    e.preventDefault(); 
    let newUrl = url;
    if(currState==="Sign Up") {
      newUrl += "/api/user/register";
    }
    else {
      newUrl += "/api/user/login";
    }

    const response = await axios.post(newUrl, data);
    if(response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }

  }


  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState==="Sign Up"?<input type="text" onChange={onChangeHandler} value={data.name} name='name' placeholder='Your name' required />:<></>}
          <input onChange={onChangeHandler} value={data.email} type="email" name='email' placeholder='Your email' required />
          <input onChange={onChangeHandler} value={data.password} type="password" name='password' placeholder='Your password' required />
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required/>
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
          ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
          :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}
LoginPopup.propTypes = {
  setShowLogin: PropTypes.func
}

export default LoginPopup