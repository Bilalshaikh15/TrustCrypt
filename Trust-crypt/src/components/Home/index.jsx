import Header from "@/components/Header";
import PasswordList from "@/components/PasswordList";
import { useState, useEffect } from "react";
import AddPassword from "@/components/AddPassword";
import EditPassword from "@/components/EditPassword";

function Index() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [credentialsArr, setCredentialsArr] = useState([]);
  const [logMessage, setLogMessage] = useState("");
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [editingCredentials, setEditingCredentials] = useState("");
  const [searchInput, setSearchInput] = useState("");

  chrome.runtime.onMessage.addListener((data) => {
    console.log("log from opo", data);
  });
  // useEffect(() => {
  //   if (provider) {
  //     console.log("window.ethereum", window.ethereum);
  //     window.ethereum.on("accountsChanged", () => window.location.reload());
  //     window.ethereum.on("chainChanged", () => window.location.reload());
  //     window.ethereum.on("connect", (info) =>
  //       console.log("connected to network", info)
  //     );
  //   }
  //   return () => {
  //     if (provider) {
  //       window.ethereum.removeAllListeners();
  //     }
  //   };
  // }, [provider]);

  const handleConnectWallet = async () => {
    try {
      if (window?.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Using account: ", accounts[0]);
        const provider = new Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId !== 80001) {
          setLog({
            type: "info",
            message: "Switching to Polygon Mumbai Testnet",
            description: "Please connect to Mumbai Testnet",
          });
          // switch to the polygon testnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
          });
        }
        console.log("chainId:", chainId);
        setProvider(provider);
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        const contract = new Contract(contractAddress, abi, signer);
        setContract(contract);
        setLog({
          type: "info",
          message: "Wallet connected successfully",
          description: "",
        });
      } else {
        console.log("Please use Web3 enabled browser");
        console.log("provider code", provider);
        setLog({
          type: "error",
          message: "Please use Web3 enabled browser",
          description: "",
        });
      }
    } catch (err) {
      console.log("Error connecting wallet", err);
      setLog({
        type: "error",
        message: "Something went wrong while connecting wallet!",
        description: "",
      });
    }
  };
  return (
    <>
      <div className="w-[350px] h-[600px]">
        {provider ? (
          <button type="primary" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <Header setIsAddModalOpen={setIsAddModalOpen} />
            <PasswordList setIsEditModalOpen={setIsEditModalOpen} />
            {isAddModalOpen ? (
              <AddPassword value={[isAddModalOpen, setIsAddModalOpen]} />
            ) : null}
            {isEditModalOpen ? (
              <EditPassword value={[isEditModalOpen, setIsEditModalOpen]} />
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
export default Index;
