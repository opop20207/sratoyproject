import { ThemeProvider } from "react-bootstrap";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { useContext } from "react";
import CollectionContext from "../../providers/collection-context";
import MarketplaceContext from "../../providers/marketplace-context";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import Web3Context from "../../providers/web3-context";
import "../../static/css/Create.css";

function CreateNft() {
    const { authenticate, isAuthenticated, Moralis } = useMoralis();
    const nft_contract_address = "0x3d05364012a5f131e3a32a68deba6c23041fb917"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
    const web3 = new Web3(Web3.givenProvider);
    const { walletAddress } = useMoralisDapp();
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);

    async function upload() {
        const fileInput = document.getElementById("file");
        const data = fileInput.files[0];
        const imageFile = new Moralis.File(data.name, data);
        document.getElementById("upload").setAttribute("disabled", null);
        document.getElementById("file").setAttribute("disabled", null);
        document.getElementById("name").setAttribute("disabled", null);
        document.getElementById("description").setAttribute("disabled", null);
        await imageFile.saveIPFS();

        const imageURI = imageFile.ipfs();
        const metadata = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            image: imageURI,
        };

        const metadataFile = new Moralis.File("metadata.json", {
            base64: btoa(JSON.stringify(metadata)),
        });
        await metadataFile.saveIPFS();

        const metadataURI = metadataFile.ipfs();
        const tx = await collectionCtx.mintToken(metadataURI);
        console.log(tx);

        const savedData = new Moralis.Object("NFTs");
        savedData.set("name", document.getElementById("name").value);
        savedData.set(
            "description",
            document.getElementById("description").value
        );
        savedData.set("imageURI", imageURI);
        savedData.set("ownerOf", walletAddress);
        savedData.set("createdBy", walletAddress);
        savedData.set("tx", tx);

        await savedData.save();
    }

    async function mintToken(_uri) {
        const encodedFunction = web3.eth.abi.encodeFunctionCall(
            {
                name: "mintToken",
                type: "function",
                inputs: [
                    {
                        type: "string",
                        name: "tokenURI",
                    },
                ],
            },
            [_uri]
        );

        const transactionParameters = {
            to: nft_contract_address,
            from: walletAddress,
            data: encodedFunction,
        };
        const txt = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log(txt);
        return txt;
    }

    async function notify(_txt) {
        document.getElementById(
            "resultSpace"
        ).innerHTML = `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction ${_txt}">`;
    }

    function readImage(e) {
        console.log("ghcnfdhlsk");
        // ?????? ????????? ????????? ?????? ??????

        console.log(e.target);
        // ????????? ???????????? ?????? (??????)
        // FileReader ???????????? ??????
        const reader = new FileReader();
        // ???????????? ????????? ??? ??????
        reader.onload = (e) => {
            const previewImage = document.getElementById("preview-image");
            previewImage.src = e.target.result;
        };
        // reader??? ????????? ????????? ??????
        reader.readAsDataURL(e.target.files[0]);
    }
    // input file??? change ????????? ??????

    if (!isAuthenticated) {
        return (
            <div>
                <h1>????????????????????? ??????</h1>
                <button onClick={() => authenticate()}>Connect MetaMask</button>
            </div>
        );
    }

    return (
        <div class="container">
            <h1>Mint NFT</h1>

            <div class="mb-3">
                <div class="form-group">
                    <div class="input-group mb-3">
                        <input
                            id="name"
                            type="text"
                            class="form-control"
                            placeholder="NFT Name"
                            aria-label="URL"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <div class="input-group mb-3">
                        <input
                            id="description"
                            type="text"
                            class="form-control"
                            placeholder="Description"
                            aria-label="URL"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                    <img id="preview-image" />
                    <div class="input-group mb-3">
                        <input
                            type="file"
                            name="file"
                            id="file"
                            class="inputfile"
                            onChange={readImage}
                        />
                        <label for="file">Choose a file</label>
                    </div>
                </div>
                <div>
                    <button
                        class="btn btn-primary"
                        id="upload"
                        onClick={upload}>
                        Upload and Mint
                    </button>
                </div>

                <div class="input-group mb-3" id="resultSpace"></div>
            </div>
        </div>
    );
}

export default CreateNft;
