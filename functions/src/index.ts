import { setGlobalOptions } from "firebase-functions/v2";

// Set concurrency and region globally
setGlobalOptions({
  maxInstances: 10,
  region: "europe-west1",
  invoker: "public"
});

export { askAi, getAiStatus } from "./askAi";
export { getUploadUrl, markDocumentUploaded, getDownloadUrl, deleteDocument } from "./documents";
export { syncDocumentToDatastore } from "./datastoreSync";
