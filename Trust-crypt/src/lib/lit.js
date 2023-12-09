import LitJsSdk from "@lit-protocol/sdk-browser";
import lighthouse from "@lighthouse-web3/sdk";

const client = new LitJsSdk.LitNodeClient({ debug: false });

class Lit {
  litNodeClient;
  constructor({ autoConnect = false }) {
    if (autoConnect) {
      this.connect();
    }
  }
  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(stringToEncrypt, accessControlConditions) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    console.log("before authsig");
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    console.log(
      "🚀 ~ file: lit.js:23 ~ Lit ~ encryptString ~ authSig:",
      authSig
    );

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringToEncrypt
    );

    // save encryption key to nodes
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: "mumbai",
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async encryptStringLightHouse(stringToEncrypt, publicKey) {
    /**
     * Use this function to upload an encrypted text string to IPFS.
     *
     * @param {string} apiKey - Your unique Lighthouse API key.
     * @param {string} publicKey - Your wallet's public key.
     * @param {string} signedMessage - A message you've signed using your private key.
     *
     * @return {object} - Details of the uploaded file on IPFS.
     */

    const apiKey = process.env.LIGHTHOUSE_API_KEY;
    const signedMessage = await LitJsSdk.checkAndSignAuthMessage({
      chain: "mumbai",
    });
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });

    const response = await lighthouse.textUploadEncrypted(
      stringToEncrypt,
      apiKey,
      publicKey,
      signedMessage
    );

    console.log(response);
  }

  async decryptString(
    encryptedSymmetricKey,
    encryptedString,
    accessControlConditions
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain: "mumbai",
      authSig,
    });

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    );
    return { decryptedString };
  }
}

export default Lit;

const c = new Lit(true);

c.encryptStringLightHouse(
  "I am Harsha",
  "0x66F877f485C296b2170868734E10585420E4e887"
);
