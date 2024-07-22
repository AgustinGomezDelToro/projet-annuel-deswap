import "./Home.scss";
import { motion } from "framer-motion";
import RandomLogo from "./RandomLogo"; // Import the RandomLogo component
import MouseLightEffect from "./MouseLightEffect"; // Import the MouseLightEffect component

const Home = () => {
    return (
        <div className="home-container futuristic-background">
            <MouseLightEffect />
            <div className="z-10 mt-20 md:mt-0 md:absolute md:left-5 md:top-[40%] w-full md:w-1/2">
                <h1 className="font-bold text-6xl md:text-7xl mb-4 text-center md:text-left text-neon">
                    Welcome to
                    <motion.label 
                        className="text-highlight"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    > DeSwap</motion.label>
                </h1>
                <p className="text-neon-subtext text-3xl px-4 md:px-0 md:text-4xl md:w-10/12 italic text-center md:text-left">
                    Empowering the future, one decentralized exchange at a time.
                </p>
            </div>

            <RandomLogo />
        </div>
    );
}

export default Home;
