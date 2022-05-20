import { useState, useEffect, useContext } from "react";

import Web3Context from "./web3-context";
import web3 from "../connection/web3";
import CollectionContext from "./collection-context";
import NFTCollection from "../abis/NFTCollection.json";

const CollectionProvider = (props) => {
    //동기 처리 필요함
    const [contract, setContract] = useState();
    const [collection, setCollection] = useState([]);
    const web3Ctx = useContext(Web3Context);
    const nftContractAddress = "0xa3af175f9e44adce033a0e8fc949ab37a82fab2d";

    const loadContract = async () => {
        const temp = new web3.eth.Contract(
            NFTCollection.abi,
            nftContractAddress
        );
        setContract(temp);
        return temp;
    };

    const mintToken = async (tokenURI) => {
        const transactionParameters = {
            to: nftContractAddress,
            from: web3Ctx.account,
        };
        const tx = await contract.methods
            .safeMint(tokenURI)
            .send(transactionParameters);
        return tx;
    };

    const loadCollection = async () => {
        const totalSupply = await contract.methods.totalSupply().call();
        let temp = [];
        for (let i = 0; i < totalSupply; i++) {
            const hash = await contract.methods.tokenURIs(i).call();
            console.log(hash);
            try {
                const response = await fetch(hash);
                console.log(response);
                if (!response.ok) {
                    throw new Error("no response from tokenURI");
                }
                const metadata = await response.json();
                const owner = await contract.methods.ownerOf(i + 1).call();
                console.log(metadata);
                temp = [
                    ...temp,
                    {
                        id: i + 1,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image,
                        owner: owner,
                    },
                ];
                console.log(i, "completed");
            } catch {
                console.error("Wrong from loading collection");
            }
        }
        setCollection(temp);
        console.log(collection);
    };

    const collectionContext = {
        contract: contract,
        collection: collection,
        loadContract: loadContract,
        mintToken: mintToken,
        loadCollection: loadCollection,
    };

    return (
        <CollectionContext.Provider value={collectionContext}>
            {props.children}
        </CollectionContext.Provider>
    );
};

export default CollectionProvider;
