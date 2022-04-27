import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import MarketPlaceItem from "./MarketPlace/MarketPlaceItem";

function MarketPlace(){
    const { authenticate, Moralis, isAuthenticated, user, refetchUserData } =
    useMoralis();
    const [products, setproducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { walletAddress } = useMoralisDapp();

    useEffect(() => {
        if (!walletAddress) return;
        getOfferings().then((response) => {
            setproducts(response);
            setLoading(false);
        });
    }, [walletAddress]);

    async function getOfferings() {
        const queryOfferings = new Moralis.Query("Offerings");
        queryOfferings.descending("updatedAt");
        const datas = await queryOfferings.find();
        let dataFormedArray = [];
        for (let i = 0; i < datas.length; i++) {
            const dataFormed = {
                id: datas[i].id,
                name: datas[i].get("name"),
                price: datas[i].get("price"),
                description: datas[i].get("description"),
                imageURI: datas[i].get("imageURI"),
                offerBy: datas[i].get("offerBy"),
            };
            dataFormedArray.push(dataFormed);
        }
        return dataFormedArray;
    }

    if (!isAuthenticated) {
        return (
            <div>
                <h1>로그인부터하셈 ㅋㅋ</h1>
                <button onClick={() => authenticate()}>Connect MetaMask</button>
            </div>
        );
    }

    return (
        <div class="temp">
            <p>MarketPlace</p>
            {Loading ? <strong>Loading...</strong> : null}
            <div id="NFTLists" class="container">
                <MarketPlaceItem products={products} />
            </div>
        </div>
    );
}

export default MarketPlace