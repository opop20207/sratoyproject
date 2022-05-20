import { useEffect, useState } from "react";

import MarketplaceContext from "./marketplace-context";

const MarketplaceProvider = (props) => {
    const [contract, setContract] = useState(null);
    const [offers, setOffers] = useState([]);

    useEffect((web3, NFTMarketplace, deployedNetwork) => {
        const temp = deployedNetwork
            ? new web3.eth.Contract(NFTMarketplace.abi, deployedNetwork.address)
            : "";
        setContract(temp);
    });

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
    };

    return (
        <MarketplaceContext.Provider>
            {props.children}
        </MarketplaceContext.Provider>
    );
};

export default MarketplaceProvider;
