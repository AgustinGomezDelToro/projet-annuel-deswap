import "./Header.scss";
import logo from "../../utils/asset/logo.png";
import { Link } from "react-router-dom";
import ConnectButton from "../../utils/hooks/connectWallet";

const Header = () => {
    return (
        <header className="fixed w-full z-50 futuristic-header">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <Link to="/" className="flex items-center text-xl font-light text-neon">
                            <span className="ml-2 text-highlight">DeSwap</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6">
                                <li>
                                    <Link to="/swap" className="nav-link">Swap</Link>
                                </li>
                                <li>
                                    <Link to="/tokens" className="nav-link">Tokens</Link>
                                </li>
                                <li>
                                    <Link to="/pools" className="nav-link">Pools</Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="nav-link">Profile</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-xs">
                            <ConnectButton />
                        </div>

                        <div className="block md:hidden">
                            <button className="rounded p-2 text-neon transition hover:text-highlight">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
