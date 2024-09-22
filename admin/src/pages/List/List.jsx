import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";


const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeItem = async (id) => {
    const response = await axios.post(`${url}/api/food/remove`, { id });
    if (response.data.success) {
      toast.success("Item removed");
      fetchList();
    } else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, idx) => {
          return (
            <div key={idx} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=>removeItem(item._id)} className="cursor">X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

List.propTypes = {
  url: PropTypes.string.isRequired,
};
export default List;
