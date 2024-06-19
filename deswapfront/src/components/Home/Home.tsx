import "./Home.scss";
import { tokens } from "../../utils/asset/tokens";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="bg-customLight flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="font-bold text-4xl md:text-5xl mb-4 text-colors-black1">
                    Welcome to
                    <label className="text-colors-green1"> DeSwap</label>
                </h1>
                <p className="text-colors-black2 text-xl md:text-2xl mb-6 italic">
                    Innovating the world of finance, inspired by ESGI.
                </p>
                <Link to="/swap" className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    Go to Swap
                </Link>
            </div>
        </div>
    );
}

export default Home;
