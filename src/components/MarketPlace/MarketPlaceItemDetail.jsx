import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

function MarketPlaceItemDetail() {
    const { id } = useParams();
    const { Moralis } = useMoralis();
    const [nft, setNft] = useState();
    const { walletAddress } = useMoralisDapp();

    useEffect(() => {
        if (!walletAddress) return;
        getNFTs().then((response) => {
            setNft(response);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("Offerings");
        queryNFTs.equalTo("objectId", id);
        const data = await queryNFTs.find();
        console.log(data);
        const dataFormed = {
            id: data[0].id,
            name: data[0].get("name"),
            description: data[0].get("description"),
            imageURI: data[0].get("imageURI"),
            ownerOf: data[0].get("offerBy"),
        };
        console.log("!@!@#!@#@");
        console.log(nft);
        return dataFormed;
    }
    return (
        <>
            <p>itemDetailPage item ID : {id}</p>
            <img src={nft?.imageURI} />
            <NavLink to={`/MarketPlace/${id}/buy`}>buy</NavLink>
        </>
    );
}

export default MarketPlaceItemDetail;
