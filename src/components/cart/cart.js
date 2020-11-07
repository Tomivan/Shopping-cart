import React from 'react';
import Icon from '@mdi/react';
import { mdiArrowLeftCircle } from '@mdi/js';
import './cart.css';

const Cart = () => {
    let dataArray = JSON.parse(localStorage.getItem('products')) || [];
    const [state, setState] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);
    
    React.useEffect(() => {
        if (dataArray !== state)
            setState(dataArray)
    }, [dataArray]);

    function increase(obj) {
        console.log("plus", obj)
        obj.quantity += 1;
        obj.price = obj.unitPrice * obj.quantity
        setState([...state])
        localStorage.setItem('products', JSON.stringify([...state]));
        let refreshState = refresh + 1
        setRefresh(refreshState)

    }

    function decrease(obj) {
        console.log("minus", obj)
        obj.quantity -= 1;
        if (obj.quantity < 1) return removeProduct(obj)
        obj.price = obj.unitPrice * obj.quantity
        setState([...state])
        localStorage.setItem('products', JSON.stringify([...state]));

        let refreshState = refresh + 1
        setRefresh(refreshState)

    }


    function removeProduct(data) {
       let filteredArray =  state.filter(obj => obj !== data)
       setState([...filteredArray])
       localStorage.setItem('products', JSON.stringify([...filteredArray]));
       console.log('a', filteredArray)
       let refreshState = refresh + 1
       setRefresh(refreshState)
    }
    return (
        <div className="cart-card">
            <div className="heading">
                <Icon path={mdiArrowLeftCircle} title="Dashboard-icon" size={1} className="back-icon" />
                <p>YOUR CART</p>
            </div>
            <div className="currency">
                <select name="currency" className="select">
                    <option>USD</option>
                </select>
            </div>
            {state ? state.map(data => <div className="cart-item">
                <div className="top-cart">
                    <p className="title">{data.title}</p>
                    <div className="close-form" onClick={() => removeProduct(data)}> + </div>
                </div>
                <div className="image">
                    <img src={`${data.image_url}`} alt="" className="cart-image" />
                </div>
                <div className="bottom-cart">
                    <div className="quantity">
                        <p className="minus" onClick={() => decrease(data)}> - </p>
                        <p className="number"> {data.quantity} </p>
                        <p className="plus" onClick={() => increase(data)}> + </p>
                    </div>
                    <p>${data.price}</p>
                </div>
            </div>) :
                <div>No Item in cart</div>}
            <div className="total">
                <hr />
                <div className="subtotal">
                    <p>Subtotal</p>
                    <p>${state && state.reduce((acc, curr) => {
                        return acc + curr.price;
                    }, 0)}</p>
                </div>
            </div>
            <div className="subscription">
                <button className="subscribe">MAKE THIS A SUBSCRIPTION (SAVE 20%)</button>
                <button className="checkout">PROCEED TO CHECKOUT</button>
            </div>
        </div>
    )
}

export default Cart;