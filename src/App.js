import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = 'gapinvestor';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

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
    } else {
      console.log("No se ha encontrado ninguna billetera autorizada")
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
            <button onClick={null} className="cta-button connect-wallet-button">
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
