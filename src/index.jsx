import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import CollectionProvider from "./providers/CollectionProvider";
import Web3Provider from "./providers/Web3Provider";
import MarketplaceProvider from "./providers/MarketplaceProvider";
import "bootstrap/dist/css/bootstrap.css";
import * as ReactDOMClient from "react-dom/client";
import { MoralisDappProvider } from "./providers/MoralisDappProvider/MoralisDappProvider";

const rootNode = document.getElementById("root");

ReactDOMClient.createRoot(rootNode).render(
    <MoralisProvider
        appId="xdtQW4Rhkc0GvRzudL16sGGaO2fadoqESl8fkwIJ"
        serverUrl="https://k4lt9sbz1oni.usemoralis.com:2053/server">
        <MoralisDappProvider>
            <Web3Provider>
                <CollectionProvider>
                    <MarketplaceProvider>
                        <React.StrictMode>
                            <App />
                        </React.StrictMode>
                    </MarketplaceProvider>
                </CollectionProvider>
            </Web3Provider>
        </MoralisDappProvider>
    </MoralisProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
