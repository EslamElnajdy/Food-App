import { useState } from 'react';
import './Orders.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const Orders = ({url}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOreders = async () => {
    const response = await axios.get(url+'/api/order/list');
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url+'/api/order/status', {orderId, status: event.target.value});
    if (response.data.success) {
      await fetchAllOreders();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    fetchAllOreders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + "x" + item.quantity;
                  } else {
                    return item.name + "x" + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName+" "+order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street+","}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zip}</p>
              </div>
              <p className="order-item-phone">
                {order.address.phone}
              </p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          )
        })}
      </div>
    </div>
  )
}

Orders.propTypes = {
  url: PropTypes.string.isRequired
}

export default Orders