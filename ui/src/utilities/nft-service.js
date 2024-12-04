import axios from "axios";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-north-1", // Replace with your AWS Region
});

const s3 = new AWS.S3();

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
  return [data, img];
};

export const uploadImage = async (imageData, imageDescription, imageName) => {
  console.log(imageName);
  console.log(imageDescription);
  console.log(imageData);

  // Strip the `data:image/jpeg;base64,` prefix if it exists
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

  // Convert the Base64 string into a binary buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Define the S3 upload parameters
  const params = {
    Bucket: "blockchain-project", // Replace with your S3 bucket name
    Key: imageName, // The name of the file in S3
    Body: buffer, // The binary image data
    ContentType: "image/jpeg", // Use the correct MIME type
    Metadata: {
      description: imageDescription, // Add metadata
    },
  };

  try {
    const result = await s3.upload(params).promise();
    console.log("Image uploaded to S3:", result.Location);
    return result.Location; // Return the S3 URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};
