import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getDiscoveryClient } from "./lib/utils";
import { db } from "./lib/admin";

async function getUserProfile(uid: string): Promise<{ properties: Record<string, string> }> {
  const doc = await db.collection("users").doc(uid).get();
  if (doc.exists) {
    const data = doc.data()!;
    return { properties: data.properties || {} };
  }
  return { properties: {} };
}

// Map of role to their specific Vertex AI Search Engine App ID
const ROLE_ENGINE_MAP: Record<string, string> = {
  "resident": "bofast-property1-resident_1779138279729",
  "committee": "bofast-property1-committee_1779138780050",
  "agent": "bofast-property1-agent_1779138846826",
};

export const askAi = onCall({ region: "europe-west1", cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated to use AI.");
  }

  const { query, sessionId } = request.data;
  if (!query) {
    throw new HttpsError("invalid-argument", "Query is required.");
  }

  try {
    const client = await getDiscoveryClient();

    // Agent Builder config
    const projectId = process.env.GCLOUD_PROJECT || "prj-p-bofast";
    const location = "eu";

    // Retrieve user's role to determine correct Engine ID
    const profile = await getUserProfile(request.auth.uid);
    const propertyId = Object.keys(profile.properties)[0] || 'property1';
    const role = profile.properties[propertyId] || "resident";

    const engineId = ROLE_ENGINE_MAP[role];
    if (!engineId) {
      throw new HttpsError("failed-precondition", `No Search Engine configured for role: ${role}`);
    }

    // Build the conversation resource name manually.
    // Using '-' as conversation ID activates auto-session mode —
    // the API creates a new conversation automatically, no createSession needed.
    const engineBase = `projects/${projectId}/locations/${location}/collections/default_collection/engines/${engineId}`;
    const conversationName = sessionId || `${engineBase}/conversations/-`;

    const [response] = await client.converseConversation({
      name: conversationName,
      query: { input: query },
      summarySpec: {
        summaryResultCount: 3,
        includeCitations: true,
      },
    });

    return {
      reply: response.reply?.summary?.summaryText || "I'm sorry, I couldn't find an answer.",
      references: response.reply?.summary?.summaryWithMetadata?.references?.map((ref) => ({
        title: ref.title,
        uri: ref.uri
      })) || [],
      relatedQuestions: response.relatedQuestions || [],
      // Return the real conversation name so the frontend can continue this conversation
      sessionId: response.conversation?.name ?? sessionId,
    };
  } catch (error: unknown) {
    console.error("Error in askAi:", error);
    throw new HttpsError("internal", "AI Assistant failed to respond.", (error as Error).message);
  }
});
