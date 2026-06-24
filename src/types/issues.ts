/**
 * Shared issue constants — Frontend side.
 * Uses 'as const' objects instead of enums to comply with erasableSyntaxOnly.
 * Keep values in sync with functions/src/types/issues.ts on the Cloud Functions side.
 */

export const IssueStatus = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  AiFlagged: "AI Flagged",
} as const;
export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssueUrgency = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Urgent: "Urgent",
} as const;
export type IssueUrgency = (typeof IssueUrgency)[keyof typeof IssueUrgency];

export const IssueCategory = {
  Maintenance: "Maintenance",
  Safety: "Safety",
  CommunalArea: "Communal Area",
  Noise: "Noise",
  Other: "Other",
} as const;
export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

/** Valid statuses an agent is allowed to transition an issue to. */
export const ALLOWED_STATUSES: IssueStatus[] = [
  IssueStatus.Open,
  IssueStatus.InProgress,
  IssueStatus.Resolved,
  IssueStatus.AiFlagged,
];
