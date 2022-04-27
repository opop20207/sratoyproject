import React from "react";
import { NavLink } from "react-router-dom";

function MyCollectionItem(props) {
    const renderItems = () =>
        props.products &&
        props.products.map((product) => (
            <div key={product.id}>
                <NavLink to={`/MyCollection/${product.id}`}>
                    <img src={product.imageURI} />
                </NavLink>
                <div id="content">
                    <p id="title">{product.name}</p>
                    <div id="aligncontent">
                        <p id="price">{product.description}</p>
                    </div>
                </div>
            </div>
        ));

    return console.log(props.products), renderItems();
}

export default MyCollectionItem;
