import "./Header.scss";
import logo from "../../utils/asset/logo.png";
import { Link } from "react-router-dom";
import ConnectButton from "../../utils/hooks/connectWallet";

const Header = () => {
    return (
        <header className="fixed w-full z-50">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <a className="flex items-end text-xl font-light text-colors-black1" href="/">
                            <img src={logo} alt="logo" className="w-20 h-20 mt-3 object-cover" />
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center ml-20 gap-6">
                                <li>
                                    <Link to={"/Swap"} className="text-black-Bd-900 font-bold transition hover:text-gray-500"> Swap </Link>
                                </li>

                                <li>
                                    <Link to={"/Tokens"} className="text-black-Bd-900 font-bold transition hover:text-gray-500"> Tokens </Link>
                                </li>

                                <li>
                                    <Link to={"/Pools"} className="text-black-Bd-900 font-bold transition hover:text-gray-500"> Pools </Link>
                                </li>

                                <li>
                                    <Link to={"/Profile"} className="text-black-Bd-900 font-bold transition hover:text-gray-500"> Profile </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4 hidden md:block text-xs">
                            <div className="connectButton">
                                    <ConnectButton />
                            </div>
                        </div>

                        <div className="block md:hidden">
                            <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
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