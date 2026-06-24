import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "./lib/admin";
import { FieldValue } from "firebase-admin/firestore";
import { IssueStatus, IssueUrgency, IssueCategory, ALLOWED_STATUSES } from "./types/issues.js";

async function getUserProfile(uid: string): Promise<{ firstName?: string, lastName?: string, properties?: Record<string, string> }> {
  const doc = await db.collection("users").doc(uid).get();
  if (doc.exists) {
    const data = doc.data()!;
    return {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      properties: data.properties || {}
    };
  }
  return {};
}

export const logIssue = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { title, description, category, urgency } = request.data;
  if (!title) {
    throw new HttpsError("invalid-argument", "Title is required.");
  }

  try {
    const profile = await getUserProfile(request.auth.uid);
    const name = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || request.auth.token.email || "Resident";
    // Derive the propertyId from the first key in the user's properties map (e.g. "property1")
    const propertyId = Object.keys(profile.properties || {})[0] || null;

    const docRef = await db.collection("issues").add({
      title,
      description: description || "",
      category: (category as IssueCategory) || IssueCategory.Maintenance,
      urgency: (urgency as IssueUrgency) || IssueUrgency.Low,
      status: IssueStatus.Open,
      property: propertyId,
      loggedByUid: request.auth.uid,
      loggedByName: name,
      loggedByRole: "Resident",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error in logIssue:", error);
    throw new HttpsError("internal", error.message || "Failed to log issue.");
  }
});

export const updateIssueStatus = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { issueId, newStatus } = request.data;
  if (!issueId || !newStatus) {
    throw new HttpsError("invalid-argument", "issueId and newStatus are required.");
  }
  if (!ALLOWED_STATUSES.includes(newStatus as IssueStatus)) {
    throw new HttpsError("invalid-argument", `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`);
  }

  try {
    const profile = await getUserProfile(request.auth.uid);

    const roles = Object.values(profile.properties || {});
    if (!roles.includes("agent") && !roles.includes("director")) {
      throw new HttpsError("permission-denied", "Only agents and directors are authorized to update issue statuses.");
    }

    await db.collection("issues").doc(issueId).update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error in updateIssueStatus:", error);
    throw new HttpsError("internal", error.message || "Failed to update status.");
  }
});
