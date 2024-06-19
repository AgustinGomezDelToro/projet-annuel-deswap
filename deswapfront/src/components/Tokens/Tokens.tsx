import "./Tokens.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo1 from "../../utils/asset/images/logo1.png";
import Token from "../../services/Assets";
import { TokenInterface } from "../../interfaces/Tokens";
import { Link } from "react-router-dom";

const Tokens = () => {
  const [tokens, setTokens] = useState<TokenInterface[]>([]);

  useEffect(() => {
    async function fetchDatas() {
      const tokens = await new Token().getAll();
      console.log(tokens);
      setTokens(tokens);
    }

    fetchDatas();
  }, []);

  return (
      <div className="w-full min-h-screen pt-24 bg-customLight">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold p-4 text-colors-green1">All tokens</h1>
            <Link to={"/Create"} className="bg-colors-green1 text-white font-medium text-sm px-3 py-2 mr-4 rounded-lg">+ New token</Link>
          </div>
          <table className="w-full bg-white shadow-lg rounded-lg">
            <thead>
            <tr className="border-b-[1px] border-colors-gray1 text-colors-black2 text-sm uppercase">
              <th className="pl-4 w-8">#</th>
              <th className="text-start p-4 font-medium">Token name</th>
              <th className="text-start p-4 font-medium">Address</th>
              <th className="text-start p-4 font-medium">Price</th>
              <th className="text-start p-4 font-medium">Volume</th>
            </tr>
            </thead>
            <tbody>
            {tokens.map((token) => (
                <TableRows key={token.ID} token={token} />
            ))}
            </tbody>
          </table>
        </div>
        <div className="absolute w-32 bottom-0 right-12 drop-shadow-lg coin-spin">
          <img src={logo1} alt="logo1" className="w-full h-full" />
        </div>
      </div>
  );
};

interface TableRowsProps {
  token: TokenInterface;
}

const TableRows = ({ token }: TableRowsProps) => {
  return (
      <motion.tr
          layoutId={`row-${token.ID}`}
          className="text-sm border-b border-colors-white2 hover:bg-colors-white2 transition-all ease-in-out duration-100"
      >
        <td className="pl-4 w-8 text-colors-black2">{token.ID}</td>
        <td className="p-4 flex items-center gap-3">
          <img
              src={`https://ipfs.io/ipfs/${token.logo}`}
              alt="token logo"
              className="w-10 h-10 rounded-full object-cover object-top shrink-0"
          />
          <div>
            <span className="block mb-1 font-medium">{token.name}</span>
            <span className="block text-xs text-slate-500">{token.symbole}</span>
          </div>
        </td>
        <td className="p-4">
        <span>
          {token.address.slice(0, 5)}...{token.address.slice(-5)}
        </span>
        </td>
        <td className="p-4 font-medium">
          <span>${token.price}</span>
        </td>
        <td className="p-4">
        <span>
          {/* ${token.volume.toLocaleString("en-US", {})} */}
        </span>
        </td>
      </motion.tr>
  );
};

export default Tokens;
