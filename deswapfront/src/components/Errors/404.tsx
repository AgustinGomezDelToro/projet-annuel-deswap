import React, { MouseEventHandler, useEffect, useState } from "react";
import { useAnimate } from "framer-motion";
import { Link } from "react-router-dom";
import MouseLightEffect from "../Home/MouseLightEffect";

const NotFound = () => {
    const [scope, animate] = useAnimate();

    const [size, setSize] = useState({ columns: 0, rows: 0 });

    useEffect(() => {
        generateGridCount();
        window.addEventListener("resize", generateGridCount);

        return () => window.removeEventListener("resize", generateGridCount);
    }, []);

    const generateGridCount = () => {
        const columns = Math.floor(document.body.clientWidth / 75);
        const rows = Math.floor(document.body.clientHeight / 75);

        setSize({
            columns,
            rows,
        });
    };

    const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
        // @ts-ignore
        const id = `#${e.target.id}`;
        animate(id, { background: "#DDDDDD" }, { duration: 1.5 });
    };

    const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
        // @ts-ignore
        const id = `#${e.target.id}`;
        animate(id, { background: "#B7B78A" }, { duration: 0.15 });
    };

    return (
        <div className="bg-colors-gray1">
            <MouseLightEffect />
            <div
                ref={scope}
                className="grid h-screen w-full grid-cols-[repeat(auto-fit,_minmax(75px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(75px,_1fr))]"
            >
                {[...Array(size.rows * size.columns)].map((_, i) => (
                    <div
                        key={i}
                        id={`square-${i}`}
                        onMouseLeave={handleMouseLeave}
                        onMouseEnter={handleMouseEnter}
                        className="h-full w-full border-[1px] border-colors-gray2"
                    />
                ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
                <h1 className="text-center text-7xl font-black uppercase text-colors-white1 sm:text-8xl md:text-9xl">
                    404 - Not Found
                </h1>
                <p className="mb-6 mt-4 max-w-3xl text-center text-lg font-light text-colors-black2 md:text-xl">
                    The page you are looking for might have been removed, had its name
                    changed or is temporarily unavailable.
                </p>
                <Link to="/" className="pointer-events-auto bg-colors-green1 px-4 py-2 text-xl font-bold uppercase text-colors-white1 ">
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;