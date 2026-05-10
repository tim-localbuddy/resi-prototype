import { setGlobalOptions } from "firebase-functions/v2";

// Set concurrency and region globally
setGlobalOptions({ maxInstances: 10, region: "europe-west1" });

export { getDocuments } from "./getDocuments";
export { askAi } from "./askAi";
export { getUploadUrl, markDocumentUploaded, getDownloadUrl } from "./documents";
