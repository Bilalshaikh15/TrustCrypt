import ModalComponent from "../Modal";
import { ethers } from "ethers";
import { pinDataToIPFS } from "../../lib/pinDataToIPFS";
import LitJsSdk from "@lit-protocol/sdk-browser";
import { execute_raw_transaction } from "../../hooks/useOkto";
import { useState } from "react";
import Lit from "../../lib/lit";
const lit = new Lit({ autoConnect: true });
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
  const [credentials, setCredentials] = useState({
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
  // generateTxnData();
  const handleAddPassword = async () => {
    console.log("wallet", wallet);
    const auth =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2luZGN4X2lkIjoiMGFmZTdhYjMtNDI2NS00M2UxLTliYmItNGQxZTU5NzY5MmJmIiwidXNlcl9pZCI6IjBhZmU3YWIzLTQyNjUtNDNlMS05YmJiLTRkMWU1OTc2OTJiZiIsInNoYXJlZF9pZCI6bnVsbCwicG9ydGZvbGlvRmFjdG9yIjoiMSIsInNlc3Npb25JZCI6IjhiZDg1YWRjLWQ1ODQtNGE0My1hMDZkLTY2Nzk2ZDJhNmM3YiIsInVzZXJfbG9naW5fdmVuZG9yX2lkIjoiZGJhZGYyYTctMzk0OC00MmY3LThkYjgtODQxMzdmNTk4YmVjIiwicyI6IndlYiIsInVzZXJBZ2VudCI6IkdvLWh0dHAtY2xpZW50LzEuMSIsInNpcCI6Ijo6ZmZmZjoxMjcuMC4wLjYiLCJsb2dpbl9tZWRpdW0iOiJHX0FVVEgiLCJpYXQiOjE3MDIxMzYzMjksImV4cCI6MTcwMzAwMDMyOX0.JFugilxv8UdLm9FOBgUnpISHiYQU7uaahgjoizpl8e0";
    // TODO: remove auth hardcoded
    const { api_key, network_name, from, to, tx_data, value } =
      await generateTxnData();
    console.log("🚀  beforeeeee:");

    try {
      const credentialsString = JSON.stringify(credentials);
      console.log("credentialsString", credentialsString);
      const { encryptedString, encryptedSymmetricKey } =
        await lit.encryptString(credentialsString, accessControlConditions);
      console.log("encryptedString", encryptedString);
      console.log("acls-->", accessControlConditions);
      // save encryptedString and encryptedSymmetricKey to ipfs
      // convert stringblob to base64 string
      const encryptedStringBase64 = await LitJsSdk.blobToBase64String(
        encryptedString
      );
      console.log("encryptedStringBase64", encryptedStringBase64);
      console.log("encryptedSymmetricKey", encryptedSymmetricKey);
      const response = await pinDataToIPFS({
        encryptedString: encryptedStringBase64,
        encryptedSymmetricKey,
      });
      console.log("response", response);
      setLogMessage(
        `Credentials encrypted and saved to IPFS: ${response.IpfsHash}`
      );
      setLog({
        type: "info",
        message: "Credentials encrypted and saved to IPFS",
        description: response.IpfsHash,
      });
      console.log("Save/Update Ipfs hash-->", response.IpfsHash);
      // save ipfs hash to smart contract
      if (credentials?.id) {
        // update
        const tx = await contract.updateKey(credentials.id, response.IpfsHash);
        console.log("Update Tx-->", tx.hash);
        setLog({
          type: "info",
          message: "Credentials update submitted. waiting for confirmation",
          description: tx.hash,
        });
        await tx.wait();
        setLoading(false);
        setIsEditModalOpen(false);
        // refresh credentials after 20 seconds
        setTimeout(() => {
          console.log("Refreshing credentials");
          getCredentials();
        }, 20000);
        return setLog({
          type: "success",
          message: "Credentials updated successfully",
          description: "Refreshes in 20 seconds..",
        });
      }
      const tx = await contract.addKey(response.IpfsHash);
      console.log("Add Tx-->", tx.hash);
      setLog({
        type: "info",
        message: "Transaction submitted. Waiting for confirmation.",
        description: tx.hash,
      });
      await tx.wait();
      setLog({
        type: "success",
        message: "Credentials saved successfully",
        description: "Refreshes in 20 seconds..",
      });
      setIsAddModalOpen(false);
      setLoading(false);
      // refresh credentials after 20 seconds
      setTimeout(() => {
        console.log("Refreshing credentials");
        getCredentials();
      }, 20000);
    } catch (error) {
      console.log("Something went wrong While saving credentials", error);
      setLog({
        type: "error",
        message: "Something went wrong While saving credentials",
        description: error.message,
      });
      setLoading(false);
    }

    // const res = await execute_raw_transaction(
    //   api_key,
    //   auth,
    //   network_name,
    //   from,
    //   to,
    //   tx_data,
    //   value
    // );

    // console.log("🚀 ~ file: index.jsx:61 ~ handleAddPassword ~ res:", res);
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
              setCredentials({
                siteURL: e.target.value,
                ...credentials,
              })
            }
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input
            onChange={(e) =>
              setCredentials({
                username: e.target.value,
                ...credentials,
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
              setCredentials({
                password: e.target.value,
                ...credentials,
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
