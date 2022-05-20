import { useMoralis } from "react-moralis";
import { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MyCollectionItem from "./MyCollectionItem";
import MarketplaceContext from "../../providers/marketplace-context";
import CollectionContext from "../../providers/collection-context";
import Web3Context from "../../providers/web3-context";
function MyCollection() {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);
    const { authenticate, Moralis, isAuthenticated, user, refetchUserData } =
        useMoralis();
    const [products, setproducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { walletAddress } = useMoralisDapp();

    useEffect(() => {
        if (!walletAddress) return;
        getNFTs().then((response) => {
            setproducts(response);
            setLoading(false);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("NFTs");
        queryNFTs.equalTo("ownerOf", walletAddress);
        queryNFTs.descending("updatedAt");
        const datas = await queryNFTs.find();
        let dataFormedArray = [];
        for (let i = 0; i < datas.length; i++) {
            const dataFormed = {
                id: datas[i].id,
                name: datas[i].get("name"),
                description: datas[i].get("description"),
                imageURI: datas[i].get("imageURI"),
                ownerOf: datas[i].get("ownerOf"),
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
            <p>MyCollecion</p>
            {Loading ? <strong>Loading...</strong> : null}
            <div id="NFTLists" class="container">
                <MyCollectionItem products={products} />
            </div>
        </div>
    );
}

export default MyCollection;
