import { useMoralis } from "react-moralis";
import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MarketPlaceItem from "./MarketPlaceItem";

function MarketPlaceItemBuy() {
    const { authenticate, Moralis, isAuthenticated } = useMoralis();
    const nft_contract_address = "0xa18c119ae67cc47c37873efadddbe74398477acd"; 
    const [products, setproducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { walletAddress } = useMoralisDapp();
    const { id } = useParams();
    const [nft, setNft] = useState();
    const [tokenId, setTokenId] = useState(null);
    const [contractAddress, setContractaddress] = useState(null);
    const web3 = new Web3(window.ethereum);

    useEffect(() => {
        if (!walletAddress) return;
        console.log("MarketPlaceItem Executed!! : ", id);
        getNFTs().then((response) => {
            setNft(response);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("Offerings");
        queryNFTs.equalTo("objectId", id);
        const data = await queryNFTs.find();
        const dataFormed = {
            id: data[0].id,
            name: data[0].get("name"),
            description: data[0].get("description"),
            imageURI: data[0].get("imageURI"),
            offerBy: data[0].get("offerBy"),
            price: data[0].get("price"),
            tx: data[0].get("tx"),
        };

        const receipt = await web3.eth.getTransactionReceipt(data[0].get("tx"));
        if (receipt == null) {
            setTokenId(null);
        } else {
            console.log(receipt);
            setTokenId(receipt.logs[0].topics[3]);
            setContractaddress(nft_contract_address);
        }
        return dataFormed;
    }
    //Buy NFT Funtions

    async function buyNFT(context) {
        // const offeringId = context.parentElement.parentElement.id;
        // let offering = window.offeringArray.find(
        //     (object) => object.offeringId == offeringId
        // );
        // const price = Moralis.Units.ETH(offering.price);
        // const priceHexString = BigInt(price).toString(16);
        // closedOffering = await closeOffering(offeringId, priceHexString);
        // const tx_closeOffering = `<p> Buying transaction ${closedOffering}</p>`;
        // context.parentElement.innerHTML = tx_closeOffering;
    }

    async function closeOffering(offeringId, priceEncoded) {
        // const encodedFunction = web3.eth.abi.encodeFunctionCall(
        //     {
        //         name: "closeOffering",
        //         type: "function",
        //         inputs: [{ type: "bytes32", name: "_offeringId" }],
        //     },
        //     [offeringId]
        // );

        // const transactionParameters = {
        //     to: nft_market_place_address,
        //     from: window.ethereum.selectedAddress,
        //     value: priceEncoded,
        //     data: encodedFunction,
        // };
        // const txt = await window.ethereum.request({
        //     method: "eth_sendTransaction",
        //     params: [transactionParameters],
        // });
        // return txt;
    }

    if (tokenId != null) {
        return (
            <>
                <p># your token ID : {web3.utils.hexToNumber(tokenId)}</p>
                <p>itemDetailPage item ID : {id}</p>
                <img src={nft?.imageURI} />
                <button onClick={buyNFT}>????????????</button>
            </>
        );
    } else {
        return (
            <>
                <p>
                    ??????????????????. ????????? ????????? ?????? ????????? ????????? ??? ?????????
                    ??????????????????
                </p>
                <hr />
                <p>1. ?????? ??????????????? ???????????? ????????? ??????</p>
                <p>
                    2. DB??? ????????? ????????? ????????? ???????????? ???????????? ?????? ??????
                    ??????
                </p>
                <p>
                    3. ????????? ????????? DB?????? ??????????????? ???????????? ???????????? ??????
                    ??????
                </p>
            </>
        );
    }
}
export default MarketPlaceItemBuy;
