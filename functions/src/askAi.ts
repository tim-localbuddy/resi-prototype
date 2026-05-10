import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getDiscoveryClient } from "./lib/utils";

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
    const engineId = "bofast-custom-search-agent_1777933866483";

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
