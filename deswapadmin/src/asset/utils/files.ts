import axios from "axios";

export const pinFileToIPFS = async (file: Blob) => {
    const formData = new FormData();
    formData.append("file", file);

    const headers = {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
        "Content-Type": "multipart/form-data",
    };

    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'upload du fichier sur IPFS :", error);
        return null;
    }
};