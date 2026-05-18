import { v1beta } from "@google-cloud/discoveryengine";
import * as path from "path";
import * as fs from "fs";

export async function getDiscoveryClient() {
  const keyPath = path.join(__dirname, "../../../.secrets", "service-account.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("service-account.json not found");
  }

  return new v1beta.ConversationalSearchServiceClient({
    keyFilename: keyPath,
    apiEndpoint: "eu-discoveryengine.googleapis.com",
  });
}

export async function getDocumentServiceClient() {
  const keyPath = path.join(__dirname, "../../../.secrets", "service-account.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("service-account.json not found");
  }

  return new v1beta.DocumentServiceClient({
    keyFilename: keyPath,
    apiEndpoint: "eu-discoveryengine.googleapis.com",
  });
}
