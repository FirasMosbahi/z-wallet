import axios from "axios";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
export const createImage = async (description) => {
  const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
  const response = await axios({
    url: URL,
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      inputs: description,
      options: { wait_for_model: true },
    }),
    responseType: "arraybuffer",
  });
  console.log(response);
  const type = response.headers["content-type"];
  const data = response.data;
  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data;
  console.log(img);
  return [data, img];
};

export const uploadImage = async (imageData, imageDescription, imageName) => {
  const nftstorage = new NFTStorage({
    token: "4d285830.7c9a2d0565564014b36843fb144f3557",
  });
  const { ipnft } = await nftstorage.store({
    image: new Blob([imageData], { type: "image/png" }),
    name: imageName,
    description: imageDescription,
  });
  console.log(ipnft);
  const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
  return url;
};
export async function getURL(url) {
  let imageDataURL;

  await axios
    .get(url)
    .then((response) => {
      const metadata = response.data;
      const imageUrl = metadata.image;
      imageDataURL = imageUrl;
    })
    .catch((error) => {
      console.error("Error fetching metadata:", error);
    });
  const ipfsGatewayUrl = imageDataURL.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );
  const response = await axios.get(ipfsGatewayUrl);
  const text = response.data;
  return text;
}