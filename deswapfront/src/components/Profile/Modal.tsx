import { useContext } from "react";
import { StakingContext } from "../../utils/hooks/Staking";
import { ethers } from "ethers";

enum Options {
    Hiden,
    Stake,
    Unstake,
}

const Modal = ({ option, setOption }: { option: Options, setOption: (option: Options) => void }) => {
    const context = useContext(StakingContext);
    const { stake, unstake } = context!;

    if (option === Options.Hiden) {
        return null;
    }

    async function submit() {
        const value = (document.getElementById("value") as HTMLInputElement).value;
        if (option === Options.Stake) {
            const tx = await stake({ value: ethers.parseEther(value) });
            if (tx) {
                setOption(Options.Hiden);
            }
        } else {
            const tx = await unstake({ value: ethers.parseEther(value) });
            if (tx) {
                setOption(Options.Hiden);
            }
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/60 z-50">
            <div className="rounded-2xl flex flex-col items-center border w-full max-w-md border-gray-700 bg-dark-form p-6 shadow-lg" role="alert">
                <div className="flex items-center gap-4 mb-4">
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 p-2 text-white">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                clipRule="evenodd"
                                d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                                fillRule="evenodd"
                            />
                        </svg>
                    </span>

                    <p className="font-medium sm:text-lg text-white">Add an amount to {option === Options.Stake ? "stake" : "unstake"}</p>
                </div>

                <div className="relative mt-4 w-full">
                    <input id="value" type="number" className="w-full p-3 border border-gray-600 rounded-lg bg-dark-input text-white" />
                    <p className="text-gray-400 absolute top-1/2 right-4 -translate-y-1/2">ETH</p>
                </div>

                <div className="mt-6 flex gap-4">
                    <button onClick={submit} className="inline-block w-full rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-5 py-3 text-center text-sm font-semibold text-white">
                        {option === Options.Stake ? "Stake" : "Unstake"}
                    </button>

                    <button
                        onClick={() => setOption(Options.Hiden)}
                        className="inline-block w-full rounded-lg bg-gray-700 px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
