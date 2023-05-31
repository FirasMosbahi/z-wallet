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
  const type = response.headers["content-type"];
  const data = response.data;
  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data; // <-- This is so we can render it on the page
  return [data, img];
};

export const uploadImage = async (imageData, imageDescription, imageName) => {
  const nftstorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE0YTM1ODMxNmE1MzRDNTkzNUMyNDgzNEQzOGNDM0E4ODA2M0MzNEEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MzQ4NTIyMDQ0MCwibmFtZSI6Ik5GVF9TVE9SQUdFIn0.XLfI7A5T6MSkJR2tHklaG_AyIHnne2AJM25M_pwL400",
  });
  const { ipnft } = await nftstorage.store({
    image: new Blob([imageData], { type: 'image/png' }),
    name: imageName,
    description: imageDescription,
  });
  const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
  return url;
};
export async function getURL(url)  {
  let imageDataURL;

  await axios.get(url)
    .then(response => {
      const metadata = response.data;
      const imageUrl = metadata.image;
      imageDataURL = imageUrl;
    })
    .catch(error => {
      console.error('Error fetching metadata:', error);

    });
  const ipfsGatewayUrl = imageDataURL.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const response = await axios.get(ipfsGatewayUrl);
  const text = response.data;
  return text;
}