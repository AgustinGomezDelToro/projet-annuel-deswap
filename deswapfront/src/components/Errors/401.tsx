import ConnectButton from "../../utils/hooks/connectWallet";
import "./Unauthorized.scss";
import MouseLightEffect from "../Home/MouseLightEffect";

const Unauthorized = () => {
    return (
        <div className="unauthorized-container">
            <MouseLightEffect />
            <div className="unauthorized-content">
                <h1 className="unauthorized-title">
                    401 - Unauthorized
                </h1>
                <p className="unauthorized-message">
                    You have to connect your wallet to access this page. Please connect your wallet to continue.
                </p>
                <div className="unauthorized-connect">
                    <ConnectButton />
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
