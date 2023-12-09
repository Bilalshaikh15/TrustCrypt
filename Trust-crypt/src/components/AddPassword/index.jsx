import ModalComponent from "../Modal";
import { ethers } from "ethers";

import { execute_raw_transaction } from "../../hooks/useOkto";
import { useState } from "react";
const contractABI = [
  "function addKey(string _ipfsHash)",
  "function getMyKeys() view returns (tuple(uint256 id, string ipfsHash, bool isDeleted)[])",
  "function softDeleteKey(uint256 _id)",
  "function updateKey(uint256 _id, string _ipfsHash)",
];
const POLYGON_RPC_URL = import.meta.env.VITE_MUMBAI_RPC_URL;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your contract address

const Index = ({ modalStatus, wallet }) => {
  const [isModalOpen, setModalOpen] = modalStatus;
  const [addModalData, setAddModalData] = useState({
    siteURL: null,
    username: null,
    password: null,
  });
  console.log("wallet ===", wallet);
  const generateTxnData = async () => {
    // Encode the function call
    const iface = new ethers.utils.Interface(contractABI);

    console.log("🚀 ~ file: index.jsx:26 ~ generateTxnData ~ iface:", iface);

    const generatedTxData = iface.encodeFunctionData("addKey", ["_ipfsHash"]);

    console.log("🚀 ~ file: index.jsx:21 ~ generateTxnData ~ data:", data);
    const transactionData = {
      api_key: import.meta.vite.VITE_OKTO_API_KEY,
      auth: import.meta.vite.VITE_OKTO_API_KEY,
      network_name: wallet.network_name,
      from: wallet.address,
      to: import.meta.env.VITE_CONTRACT_ADDRESS,
      tx_data: generatedTxData,
      value: JSON.stringify(addModalData),
    };
    // const res = execute_raw_transaction(transactionData);
    // console.log(res);

    // // Create the transaction object
    // const tx = {
    //   to: contractAddress,
    //   data: data,
    //   nonce: await signer.getTransactionCount(),
    //   gasLimit: ethers.utils.hexlify(300000), // Set gas limit
    //   gasPrice: ethers.utils.parseUnits("50", "gwei"), // Set gas price
    // };

    // // Sign the transaction
    // const signedTx = await signer.signTransaction(tx);

    // // Send the transaction
    // const txResponse = await provider.sendTransaction(signedTx);
    // console.log("Transaction hash:", txResponse.hash);
  };
  generateTxnData();
  const handleAddPassword = () => {
    console.log("wallet", wallet);

    // execute_raw_transaction(
    //     import.meta.env.VITE_OKTO_API_KEY,
    //   auth,
    //   network_name,
    //   from,
    //   to,
    //   tx_data,
    //   value
    // );
  };
  return (
    <ModalComponent modalStatus={[isModalOpen, setModalOpen]}>
      <div className="w-60 h-30">
        <h1 className="text-2xl">Add Password</h1>
        <div className="py-5">
          {" "}
          Site:
          <input
            className=" px-3 border-black"
            type="text"
            placeholder="Site Name"
            onChange={(e) =>
              setAddModalData({
                siteURL: e.target.value,
                ...addModalData,
              })
            }
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input
            onChange={(e) =>
              setAddModalData({
                username: e.target.value,
                ...addModalData,
              })
            }
            className=" px-3"
            type="text"
            placeholder="username"
          />
        </div>
        <div className="py-5">
          {" "}
          Password :
          <input
            onChange={(e) =>
              setAddModalData({
                password: e.target.value,
                ...addModalData,
              })
            }
            className=" px-3"
            type="text"
            placeholder="Password"
          />
        </div>
      </div>
      <div className="w-full">
        <button
          onClick={() => setModalOpen(false)}
          className="p-2 rounded-xl text-left float-left bg-red-500"
        >
          cancel
        </button>
        <button
          onClick={handleAddPassword}
          className=" float-right text-right bg-green-500 p-2 rounded-xl"
        >
          Add
        </button>
      </div>
    </ModalComponent>
  );
};

export default Index;
