import { useEffect, useState } from "react";

import MarketplaceContext from "./marketplace-context";
import Web3Context from "./web3-context";
import web3 from "../connection/web3";
import NFTMarketplace from "../abis/NFTMarketplace.json";

const MarketplaceProvider = (props) => {
    let contract = null;
    let offers = [];

    const loadContract = async () => {
        const temp = new web3.eth.Contract(
            NFTMarketplace.abi,
            nftContractAddress
        );
        contract = temp;
        return temp;
    };

    const loadOffer = async () => {
        if (!contract) {
            console.log("Contract Not Loaded");
            return;
        }
        let temp = [];
        const offerCount = await contract.methods.offerCount().call();
        for (let i = 0; i < offerCount; i++) {
            const offer = await contract.methods.offers(i + 1).call();
            temp.push(offer);
        }
        temp = temp
            .map((offer) => {
                offer.offerId = parseInt(offer.offerId);
                offer.id = parseInt(offer.id);
                offer.price = parseInt(offer.price);
                return offer;
            })
            .filter(
                (offer) =>
                    offer.fulfilled === false && offer.cancelled === false
            );
        setOffers(temp);
    };

    const addOffer = async (tokenID, price) => {
        if (!contract) {
            console.log("Contract Not Loaded");
            return;
        }
        const offerCount = await contract.methods.offerCount().call();
    };

    const makeOffer = async (tokenID) => {};

    return (
        <MarketplaceContext.Provider>
            {props.children}
        </MarketplaceContext.Provider>
    );
};

export default MarketplaceProvider;
