const BLOCKED_PATTERNS = [
  /(\+91[\s-]?)?[6-9]\d{9}/,
  /(?:https?:\/\/)?(?:wa\.me|t\.me)\//i,
];

export function moderateContent(
  text: string,
): { ok: true } | { ok: false; reason: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return { ok: false, reason: "Contains prohibited contact information" };
    }
  }

  return { ok: true };
}
