import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getDocumentServiceClient } from "./lib/utils";
import * as crypto from "crypto";

const PROJECT_ID = process.env.GCLOUD_PROJECT || "prj-p-bofast";
const LOCATION = "eu";
const BUCKET_NAME = "bofast-documents";

// Map of role to their specific Vertex AI Data Store ID
const ROLE_DATASTORE_MAP: Record<string, string> = {
  "resident": "bofast-property1-resident-docs_1779138306070",
  "committee": "bofast-property1-committee-docs_1779138805580",
  "director": "bofast-property1-committee-docs_1779138805580",
  "agent": "bofast-property1-agent-docs_1779138870420",
};

export const syncDocumentToDatastore = onDocumentWritten({
  document: "documents/{docId}",
  memory: "512MiB",
}, async (event) => {
  const after = event.data?.after;
  const before = event.data?.before;

  const client = await getDocumentServiceClient();
  const baseDocData = after?.data() || before?.data();

  /**
   * When running the app locally using the Firebase Local Emulator Suite,
   * Files are uploaded to the local Storage Emulator rather than real Google Cloud Storage (GCS) bucket (gs://bofast-documents/...).
   * However, Vertex AI Discovery Engine only has access to the real GCS bucket in the cloud. 
   * When the Cloud Function tells Vertex AI to import the document, Vertex AI looks in the real bucket and can't find the file.
   * Detect if it's running in the emulator and skip the Data Store sync.
   */
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    console.log("Running in emulator. Skipping Vertex AI Data Store sync for:", baseDocData?.filePath);
    return;
  }

  // Helper to get branch names for a list of roles
  const getBranchNamesForRoles = (roles: string[]) => {
    return roles
      .map(role => ROLE_DATASTORE_MAP[role])
      .filter(Boolean) // Filter out roles without a mapped datastore
      .map(datastoreId => `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${datastoreId}/branches/default_branch`);
  };

  // 1. Handle Document Deletion
  if (!after?.exists && before?.exists) {
    const docData = before.data();
    if (!docData) return;

    console.log(`Document deleted in Firestore. Removing from Data Stores: ${docData.filePath}`);

    try {
      const gcsUri = `gs://${BUCKET_NAME}/${docData.filePath}`;
      const docId = crypto.createHash("sha256").update(gcsUri).digest("hex").substring(0, 32);

      const branchNames = getBranchNamesForRoles(docData.readAccess || []);

      // Delete from all authorized datastores
      const deletePromises = branchNames.map(async (branchName) => {
        const documentName = `${branchName}/documents/${docId}`;
        try {
          await client.deleteDocument({ name: documentName });
          console.log(`Successfully deleted ${documentName}`);
        } catch (err: any) {
          if (err.code === 5 || err.message.includes('NOT_FOUND')) {
            console.log(`Document ${documentName} already removed from Data Store.`);
          } else {
            console.warn(`Failed to delete document from Data Store ${branchName}:`, err.message);
          }
        }
      });

      await Promise.all(deletePromises);
    } catch (err: any) {
      console.warn("Error during deletion process:", err.message);
    }
    return;
  }

  // 2. Handle Document Creation / Update (Import)
  if (after?.exists) {
    const docData = after.data();
    if (!docData) return;

    const prevData = before?.exists ? before.data() : null;

    // We only import if it just became 'ready' or if readAccess changed while ready
    const isNowReady = docData.status === "ready";
    const wasReady = prevData?.status === "ready";

    // Check if readAccess changed
    const currentReadAccess = JSON.stringify(docData.readAccess || []);
    const prevReadAccess = JSON.stringify(prevData?.readAccess || []);
    const accessChanged = currentReadAccess !== prevReadAccess;

    if (isNowReady && (!wasReady || accessChanged)) {
      console.log(`Document is ready or access changed. Syncing to Data Stores: ${docData.filePath}`);
      const gcsUri = `gs://${BUCKET_NAME}/${docData.filePath}`;

      // If access changed, we should technically remove it from datastores it no longer has access to,
      // and add it to new ones. For simplicity, we can do a diff.
      const prevRoles = prevData?.readAccess || [];
      const currRoles = docData.readAccess || [];

      const rolesToAdd = currRoles;
      const rolesToRemove = prevRoles.filter((r: string) => !currRoles.includes(r));

      // 1. Import to new / current roles
      const importBranchNames = getBranchNamesForRoles(rolesToAdd);
      for (const branchName of importBranchNames) {
        try {
          const [operation] = await client.importDocuments({
            parent: branchName,
            gcsSource: { 
              inputUris: [gcsUri],
              dataSchema: "content"
            },
            reconciliationMode: "INCREMENTAL",
          });
          console.log(`Import operation started for ${gcsUri} in ${branchName}: ${operation.name}`);
        } catch (err: any) {
          console.error(`Failed to start import operation for ${branchName}:`, err.message);
        }
      }

      // 2. Remove from roles that lost access
      if (rolesToRemove.length > 0) {
        const removeBranchNames = getBranchNamesForRoles(rolesToRemove);
        const docId = crypto.createHash("sha256").update(gcsUri).digest("hex").substring(0, 32);

        for (const branchName of removeBranchNames) {
          const documentName = `${branchName}/documents/${docId}`;
          try {
            await client.deleteDocument({ name: documentName });
            console.log(`Successfully removed access for ${documentName}`);
          } catch (err: any) {
            if (err.code === 5 || err.message.includes('NOT_FOUND')) {
              console.log(`Document ${documentName} already removed from Data Store.`);
            } else {
              console.warn(`Failed to remove access from Data Store ${branchName}:`, err.message);
            }
          }
        }
      }
    }
  }
});

