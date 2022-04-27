import React from "react";
import { NavLink } from "react-router-dom";

function MarketPlaceItem(props) {
    const renderItems = () =>
        props.products &&
        props.products.map((product) => (
            <div key={product.id}>
                <NavLink to={`/MarketPlace/${product.id}`}>
                    <img src={product.imageURI} />
                </NavLink>
                <div id="content">
                    <p id="title">{product.name}</p>
                    <div id="aligncontent">
                        <p id="description">{product.description}</p>
                    </div>
                    <p id="temp">가격</p>
                    <p id="price">{product.price}</p>
                </div>
            </div>
        ));

    return console.log(props.products), renderItems();
}

export default MarketPlaceItem;
