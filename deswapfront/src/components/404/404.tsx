import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const notFoundImage = require("../../utils/asset/images/404.png");

const NotFound = () => {
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

    return (
        <div className="bg-customLight min-h-screen flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
                <img src={notFoundImage} alt="404 Not Found"
                     className="w-30 h-26 mb-2"/> {/* w-10 y h-10 establecen el tamaño a 40x40 px */}
                <h1 className="text-center text-3xl uppercase text-white sm:text-4xl md:text-5xl font-black mt-4 mb-2"> {/* Tamaño más pequeño y margen superior ajustado */}
                    Not Found
                </h1>
                <p className="mb-6 mt-4 max-w-3xl text-center text-lg font-light text-black md:text-xs">
                    Something went wrong.
                </p>
                <Link to="/"
                      className="pointer-events-auto bg-green-500 px-4 py-2 text-xl font-bold uppercase text-white rounded-lg">
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
