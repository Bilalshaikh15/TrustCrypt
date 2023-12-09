export const pinDataToIPFS = async (data) => {
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: import.meta.env.VITE_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env
          .VITE_PUBLIC_PINATA_API_SECRET_KEY,
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
};
