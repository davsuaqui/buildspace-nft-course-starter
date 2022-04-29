import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import contratoNFT from './utils/contratoNFT.json';

// Constants
const TWITTER_HANDLE = 'gapinvestor';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x8F637bA7E42e20Ba64D78c9F7E03aCA8A190631B"

const App = () => {
  // Variable para guardar la billetera pública del usuario
  const [currentAccount, setCurrentAccount] = useState("");

  // Comprobamos si está conectada la wallet
  const checkIfWalletIsConnected = async () => {
    // Primero comprobamos que tenemos acceso a window.ethereum
    const { ethereum } = window;

    if (!ethereum){
      window.alert("Asegurate de tener Metamask")
      return;
    } else {
      console.log("Tenemos el objeto de ethereum", ethereum)
    }

    // Comprobamos si estamos autorizado a acceder a la billetera del usuario
    const cuentas = await ethereum.request({ method: 'eth_accounts' });

    // Un usuario puede tener varias cuentas autorizadas, cogemos la primera
    if (cuentas.length !== 0) {
      const cuenta = cuentas[0]
      console.log("Encontrada una billetera autorizada:", cuenta)
      setCurrentAccount(cuenta)
      setupEventListener()
    } else {
      console.log("No se ha encontrado ninguna billetera autorizada")
    }

    // Nos aseguramos de que está en la red correcta
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Conectado a la cadena " + chainId)

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("No está conectado a Rinkeby Test Network");
    }
  }

  // Implementamos el botón de conectar billetera
  const conectarWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Instala Metamask")
        return;
      }

      // Método para solicitar acceso a la cuenta
      const cuentas = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Conectada:", cuentas[0])
      setCurrentAccount(cuentas[0])
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Configuramos nuestro 'listener'
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contratoNFT.abi, signer)

        // Aquí capturamos el evento que nos lanza
        connectedContract.on("NuevoNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)

        });

        console.log("Event Listener configurado")
      } else {
        console.log("El objeto de Ethereum no existe")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Llamamos al contrato para hacer mint
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contratoNFT.abi, signer)

        console.log("Abriendo billetera para pagar el gas ...")
        let nftTxn = await connectedContract.mintNFT();

        console.log("Minando...por favor espere.")
        await nftTxn.wait();

        console.log(`Minado, ver transacción: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log('El objeto Ethereum no existe')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={conectarWallet} className="cta-button connect-wallet-button">
      Conectar wallet
    </button>
  );

  // Esto ejecuta nuestra función cuando se carga la página
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Mi Primera Colección NFT</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
             renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <p
            className='footer-text-1'
          >Desarrollado por </p>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
