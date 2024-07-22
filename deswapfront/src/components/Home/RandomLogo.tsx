import React from "react";
import "./RandomLogo.scss";

const logos = [
  "bitcoin.png",
  "ethereum.png",
  "ripple.png",
  "litecoin.png",
  "bitcoin-cash.png",
  "eos.png",
  "binance-coin.png",
  "tether.png",
  "stellar.png",
  "cardano.png",
];

const RandomLogo = () => {
  return (
    <div className="logo-container">
      {logos.map((logo, index) => (
        <img
          key={index}
          src={require(`../../assets/crypto-logos/${logo}`)}
          alt="Crypto Logo"
          className="logo"
        />
      ))}
    </div>
  );
};

export default RandomLogo;
