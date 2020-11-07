import React, { useState, useEffect } from 'react';
import { mdiCartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Cart from '../cart/cart';
import './product.css';

const Products = () => {
    const [state, setState] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const { createApolloFetch } = require('apollo-fetch');
    useEffect(() => {
        const fetch = createApolloFetch({
            uri: 'https://pangaea-interviews.now.sh/api/graphql',
        });
        fetch({
            query: ` query products {
                    products {
                        id
                        image_url
                        title
                        price(currency: USD)
                    }
                }`
        })
            .then(res => {
                console.log(res.data);
                setState(res.data)
            })
            .catch(err => console.log('fetch error', err));
    }, [refresh])

    // localStorage.clear()
    function addToCart(data) {
        const idArray = [];
        let dataArray = JSON.parse(localStorage.getItem('products')) || [];
        let formattedDataArray = dataArray.map(obj => {
            idArray.push(obj.id)
            if (obj.id === data.id) {
                obj.quantity += 1;
                obj.price = obj.unitPrice * obj.quantity
                return obj
            }
            return obj
        }, [])

        if (!idArray.includes(data.id)) {
            data.quantity = 1;
            data.unitPrice = +data.price
            formattedDataArray.push(data);
        }

        localStorage.setItem('products', JSON.stringify(formattedDataArray));
        let refreshState = refresh + 1
        setRefresh(refreshState)
    }
    return (
        <div>
            <nav className="nav">
                <h2>LUMIN</h2>
                <ul>
                    <li>Shop</li>
                    <li>Learn</li>
                </ul>
                <div className="cart">
                    <p>Account</p>
                    <Icon path={mdiCartOutline} title="Dashboard-icon" size={1} className="cart-icon" />
                </div>
            </nav>
            <hr />
            <div className="cart-down">
                <Cart />
            </div>
            <section className="top">
                <div className="all-products">
                    <h2>All Products</h2>
                    <p>A 360<sup>0</sup> look at lumin</p>
                </div>
                <div className="filter">
                    <select name="filter-by">
                        <option value="filter">Filter by</option>
                    </select>
                </div>
            </section>
            <section className="products">
                {state && state.products.map(data => (<div className="product">
                    <img src={`${data.image_url}`} alt="product" className="product-image" />
                    <p>{data.title}</p>
                    <p>${data.price}</p>
                    <button className="add" onClick={() => addToCart(data)}>Add to cart</button>
                </div>))}
            </section>
        </div>
    )
}

export default Products;