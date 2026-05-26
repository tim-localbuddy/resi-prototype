import { v1beta } from "@google-cloud/discoveryengine";
import * as path from "path";
import * as fs from "fs";

export async function getDiscoveryClient() {
  const keyPath = path.join(__dirname, "../../.secrets", "service-account.json");

  return new v1beta.ConversationalSearchServiceClient({
    keyFilename: fs.existsSync(keyPath) ? keyPath : undefined,
    apiEndpoint: "eu-discoveryengine.googleapis.com",
  });
}

export async function getDocumentServiceClient() {
  const keyPath = path.join(__dirname, "../../../.secrets", "service-account.json");

  return new v1beta.DocumentServiceClient({
    keyFilename: fs.existsSync(keyPath) ? keyPath : undefined,
    apiEndpoint: "eu-discoveryengine.googleapis.com",
  });
}
