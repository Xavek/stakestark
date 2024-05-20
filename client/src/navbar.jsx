import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <nav className="bg-gray-300 p-4 flex justify-between">
        <div className="flex items-center">
          <span className="text-slate-400 text-xl font-bold">StakeStark</span>
        </div>
        <div className="flex items-center ">
          {/*
          <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
          UploadAndMint
          </button>
          <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
            BuyNFT
          </button>
          <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
            MY NFTS
          </button>
        */}
          <ul className="flex items-start">
            {status === "disconnected" &&
              connectors.map((connector) => (
                <li key={connector.id}>
                  <button
                    onClick={() => connect({ connector })}
                    className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                  >
                    Connect To {connector.id}
                  </button>
                </li>
              ))}

            {status === "connected" && (
              <button
                className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                onClick={() => disconnect()}
              >
                {address}
              </button>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
