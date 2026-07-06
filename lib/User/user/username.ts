const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "academyfind",

  "api",
  "auth",

  "login",
  "logout",
  "signup",
  "register",

  "profile",
  "profiles",

  "settings",

  "user",
  "users",

  "student",
  "students",

  "teacher",
  "teachers",

  "manager",
  "managers",

  "institute",
  "institutes",

  "blog",
  "blogs",

  "review",
  "reviews",

  "community",

  "notifications",

  "messages",
  "message",

  "chat",

  "search",

  "explore",

  "help",
  "support",

  "about",

  "privacy",

  "terms",

  "contact",

  "www",

  "mail",

  "cdn",

  "assets",

  "favicon",

  "robots",

  "sitemap",
] as const;

const USERNAME_REGEX =
  /^(?!_)(?!.*__)[a-z0-9_]{3,30}(?<!_)$/;

export function normalizeUsername(
  username: string
) {
  return username
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export function isReservedUsername(
  username: string
) {
  return RESERVED_USERNAMES.includes(
    username.toLowerCase() as (typeof RESERVED_USERNAMES)[number]
  );
}

export function isValidUsername(
  username: string
) {
  return USERNAME_REGEX.test(username);
}

export function validateUsername(
  username: string
):
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    } {
  const normalized =
    normalizeUsername(username);

  if (!isValidUsername(normalized)) {
    return {
      success: false,
      message:
        "Username must be 3–30 characters and can only contain lowercase letters, numbers and underscores.",
    };
  }

  if (isReservedUsername(normalized)) {
    return {
      success: false,
      message:
        "This username is reserved.",
    };
  }

  return {
    success: true,
  };
}

export function generateUsername(
  name: string
) {
  return normalizeUsername(name)
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");
}