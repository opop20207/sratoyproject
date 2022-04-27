import { useMoralis } from "react-moralis";
import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MyCollectionItem from "./MyCollectionItem";

function MyCollectionItemSell() {
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

    const nft_market_place_address = "0xf3c3fce5be43fe2f56a08478455f39dcb8251dd4";
    const coordinatorKey = "05a02c2b6f9d99768be59c621a763f941a7933764188c265083be7dbfa987b41";
    const nft_market_place_abi = [{"inputs": [{"internalType": "address", "name": "_operator", "type": "address"}], "stateMutability": "nonpayable", "type": "constructor", "name": "constructor"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "beneficiary", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "BalanceWithdrawn", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "offeringId", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"}], "name": "OfferingClosed", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "bytes32", "name": "offeringId", "type": "bytes32"}, {"indexed": true, "internalType": "address", "name": "hostContract", "type": "address"}, {"indexed": true, "internalType": "address", "name": "offerer", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}, {"indexed": false, "internalType": "string", "name": "uri", "type": "string"}], "name": "OfferingPlaced", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "address", "name": "previousOperator", "type": "address"}, {"indexed": false, "internalType": "address", "name": "newOperator", "type": "address"}], "name": "OperatorChanged", "type": "event"}, {"inputs": [{"internalType": "address", "name": "_newOperator", "type": "address"}], "name": "changeOperator", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_offeringId", "type": "bytes32"}], "name": "closeOffering", "outputs": [], "stateMutability": "payable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_offerer", "type": "address"}, {"internalType": "address", "name": "_hostContract", "type": "address"}, {"internalType": "uint256", "name": "_tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "_price", "type": "uint256"}], "name": "placeOffering", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_address", "type": "address"}], "name": "viewBalances", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "bytes32", "name": "_offeringId", "type": "bytes32"}], "name": "viewOfferingNFT", "outputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "uint256", "name": "", "type": "uint256"}, {"internalType": "uint256", "name": "", "type": "uint256"}, {"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "withdrawBalance", "outputs": [], "stateMutability": "nonpayable", "type": "function"}];
    const marketPlace = new web3.eth.Contract(nft_market_place_abi,nft_market_place_address);

    useEffect(() => {
        if (!walletAddress) return;
        getNFTs().then((response) => {
            setNft(response);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("NFTs");
        queryNFTs.equalTo("objectId", id);
        const data = await queryNFTs.find();
        const dataFormed = {
            id: data[0].id,
            name: data[0].get("name"),
            description: data[0].get("description"),
            imageURI: data[0].get("imageURI"),
            ownerOf: data[0].get("ownerOf"),
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

    //Sell NFT Funtion
    async function offerNFT() {
        const price = document.getElementById("price").value;

        console.log("contractAddress : ", contractAddress, " and tokenID : ", tokenId);
        const approval = await approveMarketPlace(contractAddress, tokenId);
        const tx_approval = `<p> Approval transaction ${approval}</p>`;
        console.log("Approval transaction hash : ", tx_approval);
        // const offering = await placeOffering(contractAddress, tokenId, price);
        // console.log("Offering transaction hash : ", offering);

        const savedData = new Moralis.Object("Offerings");
        savedData.set("name", nft.name);
        savedData.set(
            "description",
            nft.description
        );
        savedData.set("offerBy", nft.ownerOf);
        savedData.set("price", price);
        savedData.set("imageURI", nft.imageURI);
        savedData.set("tx", nft.tx);

        await savedData.save();
    }
    
    async function approveMarketPlace(hostContract, tokenId) {
        const encodedFunction = web3.eth.abi.encodeFunctionCall(
            {
                name: "approve",
                type: "function",
                inputs: [
                    { type: "address", name: "to" },
                    { type: "uint256", name: "tokenURI" },
                ],
            },
            [nft_contract_address, tokenId]
        );

        const transactionParameters = {
            to: hostContract,
            from: window.ethereum.selectedAddress,
            data: encodedFunction,
        };
        const txt = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return txt;
    }

    async function placeOffering(_hostContract, _tokenId, _price) {
        // const params = {
        //     hostContract: _hostContract,
        //     offerer: window.ethereum.selectedAddress,
        //     tokenId: _tokenId,
        //     price: _price,
        // };
        // const signedTransaction = await _placeOffering(params);
        // const fulfillTx = await web3.eth.sendSignedTransaction(
        //     signedTransaction.rawTransaction
        // );
        // return fulfillTx;
    }

    async function _placeOffering(params)
    {
        // console.log("_placeOffering() Executed!");
        // const hostContract = params.hostContract;
        // const offerer = params.offerer;
        // const tokenId = params.tokenId;
        // const price = params.price;
        // const nonceOperator = web3.eth.getTransactionCount(nft_market_place_address);
        // const functionCall = marketPlace.methods.placeOffering(offerer,hostContract,tokenId,web3.utils.toWei(price,"ether")).encodeABI();
        // const transactionBody = {
        //     to: nft_market_place_address,
        //       nonce:nonceOperator,
        //       data:functionCall,
        //       gas:400000,
        //       gasPrice:web3.utils.toWei("1", "gwei")
        // }

        // console.log(" ** nonceOperator is ....");
        // console.log(nonceOperator);
        // console.log("trasactionBody is.. ");
        // console.log(transactionBody);
        // console.log("coordinatorKey is.. ");
        // console.log(coordinatorKey);
        // const signedTransaction = await web3.eth.accounts.signTransaction(transactionBody, coordinatorKey);
        // console.log("_placeOffering() Ended!, signedTransaction is ...");
        // console.log(signedTransaction);
        // return signedTransaction;
    }    

    if (tokenId != null) {
        return (
            <>
                <p># your token ID : {web3.utils.hexToNumber(tokenId)}</p>
                <p>itemDetailPage item ID : {id}</p>
                <img src={nft?.imageURI} />
                <input
                    id="price"
                    type="text"
                    class="form-control"
                    placeholder="price"
                    aria-label="URL"
                    aria-describedby="basic-addon1"
                />
                <button onClick={offerNFT}>판매하기</button>
            </>
        );
    } else {
        return (
            <>
                <p>
                    로딩중입니다. 로딩이 길어질 경우 아래의 경우일 수 있으니
                    확인해주세요
                </p>
                <hr />
                <p>1. 해당 컨트랙트가 종료되지 않았을 경우</p>
                <p>
                    2. DB가 오래된 버전을 사용해 데이터를 포함하지 않고 있을
                    경우
                </p>
                <p>
                    3. 모종의 문제로 DB에는 올라갔으나 체인상에 등재되지 않은
                    경우
                </p>
            </>
        );
    }
}

export default MyCollectionItemSell;
