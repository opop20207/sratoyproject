import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeaderTemp from "./components/HeaderTemp";
import Footer from "./components/Footer";
import Main from "./components/Main";
import MyNFT from "./components/MyNFT";
import Create from "./components/Create";
import MarketPlace from "./components/MarketPlace";
import LoginMeta from "./components/LoginMeta";
import Selling from "./components/MyNFT/MyCollectionItemSell";
import MyCollection from "./components/MyNFT/MyCollection";
import CustomAvatar from "./components/MyNFT/CustomAvatar";
import MyCollectionItemDetail from "./components/MyNFT/MyCollectionItemDetail";
import MyCollectionItemSell from "./components/MyNFT/MyCollectionItemSell";
import "antd/dist/antd.css";
import MarketPlaceItemBuy from "./components/MarketPlace/MarketPlaceItemBuy";
import MarketPlaceItemDetail from "./components/MarketPlace/MarketPlaceItemDetail";
import Web3Context from "./providers/web3-context";
import CollectionContext from "./providers/collection-context";
import MarketplaceContext from "./providers/marketplace-context";
import web3 from "./connection/web3";
import { useContext, useEffect } from "react";

import NFTCollection from "./abis/NFTCollection.json";
import NFTMarketplace from "./abis/NFTMarketplace.json";

const App = () => {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);

    useEffect(() => {
        if (!web3) {
            console.log("NO METAMASK ERROR");
        }
        const loadData = async () => {
            const account = web3Ctx.loadAccount(web3);
            const networkId = web3Ctx.loadNetworkId(web3);

            console.log("FROM INIT", account, networkId);

            if (!account) {
                try {
                    await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    web3Ctx.loadAccount(web3);
                } catch (error) {
                    console.error(error);
                }
            }

            window.ethereum.on("accountsChanged", (accounts) => {
                web3Ctx.loadAccount(web3);
            });
            const nftContract = await collectionCtx.loadContract();
            await collectionCtx.loadCollection();
            console.log(collectionCtx);
        };
        loadData();
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Main />}></Route>
                        <Route path="/MyNFT" element={<MyNFT />}></Route>
                        <Route path="/Create" element={<Create />}></Route>
                        <Route
                            path="/MarketPlace"
                            element={<MarketPlace />}></Route>
                        <Route
                            path="/MarketPlace/:id"
                            element={<MarketPlaceItemDetail />}></Route>
                        <Route
                            path="/MarketPlace/:id/Buy"
                            element={<MarketPlaceItemBuy />}></Route>

                        <Route
                            path="/LoginMeta"
                            element={<LoginMeta />}></Route>

                        <Route path="/SellingNFT" element={<Selling />}></Route>
                        <Route
                            path="/MyCollection"
                            element={<MyCollection />}></Route>
                        <Route
                            path="/MyCollection/:id"
                            element={<MyCollectionItemDetail />}></Route>
                        <Route
                            path="/MyCollection/:id/Sell"
                            element={<MyCollectionItemSell />}></Route>
                        <Route
                            path="/CustomAvatar"
                            element={<CustomAvatar />}></Route>
                    </Routes>

                    <Footer />
                </Router>
            </header>
        </div>
    );
};
export default App;
