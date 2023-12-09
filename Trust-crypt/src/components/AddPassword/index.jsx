import ModalComponent from "../Modal";
import { ethers } from "ethers";

import { execute_raw_transaction } from "../../hooks/useOkto";
import { useState } from "react";
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "addKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyKeys",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isDeleted",
            type: "bool",
          },
        ],
        internalType: "struct KeyManager.Key[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "softDeleteKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "updateKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const POLYGON_RPC_URL = import.meta.env.VITE_MUMBAI_RPC_URL;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your contract address

const Index = ({ modalStatus, wallet, authToken }) => {
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

    const generatedTxData = iface.encodeFunctionData("addKey", [
      "QmSQycdNs3vMhQ6zSzzKteAW8k2xwA8oXc5Ks9VunBDW97",
    ]);

    console.log(
      "🚀 ~ file: index.jsx:21 ~ generateTxnData ~ data:",
      generatedTxData
    );
    const transactionData = {
      api_key: import.meta.env.VITE_OKTO_API_KEY,
      auth: authToken,
      network_name: wallet.network_name,
      from: wallet.address,
      to: import.meta.env.VITE_CONTRACT_ADDRESS,
      tx_data: generatedTxData,
      value: "0x",
    };
    return transactionData;
  };
  generateTxnData();
  const handleAddPassword = async () => {
    console.log("wallet", wallet);
    const { api_key, auth, network_name, from, to, tx_data, value } =
      await generateTxnData();
    console.log("🚀  beforeeeee:");

    const res = await execute_raw_transaction(
      api_key,
      auth,
      network_name,
      from,
      to,
      tx_data,
      value
    );

    console.log("🚀 ~ file: index.jsx:61 ~ handleAddPassword ~ res:", res);
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
            // onChange={(e) =>
            //   setAddModalData({
            //     siteURL: e.target.value,
            //     ...addModalData,
            //   })
            // }
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input
            // onChange={(e) =>
            //   // setAddModalData({
            //   //   username: e.target.value,
            //   //   ...addModalData,
            //   // })
            //   {}
            // }
            className=" px-3"
            type="text"
            placeholder="username"
          />
        </div>
        <div className="py-5">
          {" "}
          Password :
          <input
            // onChange={(e) =>
            //   setAddModalData({
            //     password: e.target.value,
            //     ...addModalData,
            //   })
            // }
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
