import React, { useContext, useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { MotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Modal from "./Modal";
import { StakingContext } from "../../utils/hooks/Staking";
import MouseLightEffect from "../Home/MouseLightEffect";

enum Options {
    Hiden,
    Stake,
    Unstake,
}

export const Profile = () => {
    const [option, setOption] = useState<Options>(Options.Hiden);
    const [rewards, setRewards] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const [supply, setSupply] = useState<number>(0);
    const [dailyRewards, setDailyRewards] = useState<number>(0);

    const context = useContext(StakingContext);
    const { claim, earned, balanceOf, totalSupply, dailyRewardRate } = context!;

    useEffect(() => {
        async function fetchDatas() {
            let value = await earned();
            if (value) {
                setRewards(parseFloat(value));
            }
            value = await balanceOf();
            if (value) {
                setBalance(parseFloat(value));
            }
            value = await totalSupply();
            if (value) {
                setSupply(parseFloat(value));
            }
            value = await dailyRewardRate();
            if (value) {
                setDailyRewards(parseFloat(value));
            }
        }

        fetchDatas();
    }, [earned]);

    return (
        <div className="min-h-screen px-4 flex items-center pt-12 bg-dark-background text-white">
            <motion.div
                initial="initial"
                animate="animate"
                transition={{
                    staggerChildren: 0.05,
                }}
                className="mx-auto max-w-6xl grid grid-cols-12 gap-6"
            >
                <MouseLightEffect />
                <Block className="col-span-12 md:col-span-8 md:row-span-2 flex flex-col justify-between">
                    <div>
                        <h1 className="mb-4 text-4xl font-medium leading-tight text-gradient">
                            Stake your tokens{" "}
                            <span className="block text-gray-400">
                                to earn rewards and support us!
                            </span>
                        </h1>
                        <p className="flex items-center gap-1 text-gradient hover:underline">
                            {dailyRewards}% of tokens staked are distributed every day
                        </p>
                    </div>
                    <div className="flex gap-5 justify-center mt-8">
                        <button onClick={() => setOption(Options.Stake)} className="px-6 py-2 font-medium bg-gradient-to-r from-green-400 to-blue-500 text-white w-fit transition-all shadow-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-lg">
                            Stake crypto
                        </button>
                        <button onClick={claim} className="px-6 py-2 font-medium bg-gradient-to-r from-green-400 to-blue-500 text-white w-fit transition-all shadow-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-lg">
                            Claim rewards
                        </button>
                        <button onClick={() => setOption(Options.Unstake)} className="px-6 py-2 font-medium bg-gradient-to-r from-green-400 to-blue-500 text-white w-fit transition-all shadow-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-lg">
                            Unstake
                        </button>
                    </div>
                </Block>
                <Block className="col-span-12 text-3xl leading-snug mt-8">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="flex flex-col sm:flex-row items-center justify-around">
                            <Stat
                                num={supply}
                                decimals={2}
                                suffix="ETH"
                                subheading="Total supply"
                            />
                            <Stat
                                num={balance}
                                decimals={2}
                                suffix="ETH"
                                subheading="Your staked balance"
                            />
                            <Stat
                                num={rewards}
                                decimals={2}
                                suffix="ETH"
                                subheading="Your rewards"
                            />
                        </div>
                    </div>
                </Block>
            </motion.div>
            <Modal option={option} setOption={setOption} />
        </div >
    );
};

type BlockProps = {
    className?: string;
} & MotionProps;

const Block = ({ className, ...rest }: BlockProps) => {
    return (
        <motion.div
            variants={{
                initial: {
                    scale: 0.5,
                    y: 50,
                    opacity: 0,
                },
                animate: {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                },
            }}
            transition={{
                type: "spring",
                mass: 3,
                stiffness: 400,
                damping: 50,
            }}
            className={twMerge(
                "col-span-4 rounded-lg border border-gray-700 bg-gray-800 p-6",
                className
            )}
            {...rest}
        />
    );
};

interface Props {
    num: number;
    suffix: string;
    decimals?: number;
    subheading: string;
}

const Stat = ({ num, suffix, decimals = 0, subheading }: Props) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const isInView = useInView(ref);

    useEffect(() => {
        if (!isInView) return;

        if (num < 0.01 && num > 0) {
            ref.current!.textContent = "<0.01";
        } else {
            animate(0, num, {
                duration: 1,
                onUpdate(value) {
                    if (!ref.current) return;

                    ref.current.textContent = value.toFixed(decimals);
                },
            });
        }
    }, [num, decimals, isInView]);

    return (
        <div className="flex min-w-72 flex-col items-center py-8 sm:py-0">
            <p className="mb-2 text-center text-7xl font-semibold sm:text-6xl">
                <span ref={ref}></span>
                <span className="text-xl">
                    {suffix}
                </span>
            </p>
            <p className="max-w-48 text-center text-base text-gray-400">{subheading}</p>
        </div>
    );
};

export default Profile;
