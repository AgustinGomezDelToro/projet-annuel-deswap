import "./Tokens.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Token from "../../services/Tokens";
import { TokenInterface } from "../../interfaces/Tokens";
import MouseLightEffect from "../Home/MouseLightEffect";

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
    <div className="tokens-container">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="tokens-header">All tokens</h1>
        <table className="tokens-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Token name</th>
              <th>Address</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Trades</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => {
              return (
                <TableRows
                  key={token.ID}
                  token={token}
                />
              );
            })}
          </tbody>
        </table>
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
      <MouseLightEffect />
      <td className="pl-4 w-8 text-colors-black2">
        {token.ID}
      </td>

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
        <span>
          ${token.price}
        </span>
      </td>

      <td className="p-4">
        <span>
          {/* ${token.volume.toLocaleString("en-US", {})} */}
        </span>
      </td>

      <td className="p-4">
        <span>
        </span>
      </td>
    </motion.tr>
  );
};

export default Tokens;
