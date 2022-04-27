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

function App() {
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
}
export default App;
