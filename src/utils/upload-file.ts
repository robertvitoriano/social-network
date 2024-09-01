import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { deleteFile } from "./file";

export async function uploadFile({ file, bucketPath }): Promise<string> {
  const s3 = new AWS.S3();
  const tmpDir = path.resolve(__dirname, "../../tmp/");

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const filePath = path.resolve(tmpDir, file.filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath);
  const fileHash = crypto.randomBytes(16).toString("hex");
  const fileKey = `${bucketPath}/${fileHash}-${file.originalname}`;

  const { Location } = await s3
    .upload({
      ACL: "public-read",
      ContentDisposition: "attachment",
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      Body: fileContent,
      ContentType: file.mimetype,
    })
    .promise();

  await deleteFile(filePath);
  console.log({ Location });
  return Location;
}
