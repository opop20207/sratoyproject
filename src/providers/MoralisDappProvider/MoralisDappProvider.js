import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import Web3 from "web3";

const MoralisDappProvider = (props) => {
    const { Moralis, user } = useMoralis();
    const [walletAddress, setWalletAddress] = useState();
    const [chainId, setChainId] = useState();

    useEffect(() => {
        window.ethereum?.on("accountsChanged", (account) =>
            setWalletAddress(account)
        );

        window.ethereum?.on("chainChanged", (chain) => setChainId("chain"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setChainId(Web3.givenProvider?.chainId));
    useEffect(() => {
        setWalletAddress(
            Web3.givenProvider?.selectedAddress || user?.get("ethAddress")
        );
    }, [Web3, user]);

    return (
        <MoralisDappContext.Provider
            value={{
                walletAddress,
                chainId,
            }}>
            {props.children}
        </MoralisDappContext.Provider>
    );
};

function useMoralisDapp() {
    const context = React.useContext(MoralisDappContext);
    if (context == null) {
        throw new Error(
            "useMoralisDapp must be used within a MoralisDappProvider"
        );
    }
    return context;
}

export { MoralisDappProvider, useMoralisDapp };
