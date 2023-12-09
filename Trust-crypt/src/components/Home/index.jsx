import Header from "@/components/Header";
import PasswordList from "@/components/PasswordList";
import { useState, useEffect } from "react";
import AddPassword from "@/components/AddPassword";
import EditPassword from "@/components/EditPassword";
import { authenticate, create_wallet } from "../../hooks/useOkto";
const VITE_OKTO_API_KEY = import.meta.env.VITE_OKTO_API_KEY;
const VITE_OKTO_OAUTH_ID_TOKEN = import.meta.env.VITE_OKTO_OAUTH_ID_TOKEN;
const VITE_OKTO_PIN = import.meta.env.VITE_OKTO_PIN;

function Index() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [credentialsArr, setCredentialsArr] = useState([]);
  const [logMessage, setLogMessage] = useState("");
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [editingCredentials, setEditingCredentials] = useState("");
  const [searchInput, setSearchInput] = useState("");

  chrome.runtime.onMessage.addListener((data) => {
    console.log("log from opo", data);
  });

  const handleConnectWallet = async () => {
    try {
      const { auth_token, refresh_auth_token, device_token } =
        await authenticate(
          VITE_OKTO_API_KEY,
          VITE_OKTO_OAUTH_ID_TOKEN,
          VITE_OKTO_PIN
        );
      const wallets = await create_wallet(VITE_OKTO_API_KEY, auth_token);
      console.log(wallets);
      setWallet(wallets[0]);
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
        {!wallet ? (
          <button type="primary" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <Header setIsAddModalOpen={setIsAddModalOpen} />
            <PasswordList setIsEditModalOpen={setIsEditModalOpen} />
            {isAddModalOpen ? (
              <AddPassword
                value={[isAddModalOpen, setIsAddModalOpen]}
                wallet={wallet}
              />
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
