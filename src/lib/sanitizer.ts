/**
 * HTML Sanitizer for CMS content security.
 * Prevents XSS attacks by removing script tags, event handlers, and dangerous protocols.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  let sanitized = html;

  // 1. Remove script tags and contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove iframe, object, embed, style tags and contents
  sanitized = sanitized.replace(/<(iframe|object|embed|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "");

  // 3. Remove inline event handler attributes (e.g., onload=, onerror=, onclick=, onmouseover=)
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 4. Remove javascript:, data:, and vbscript: protocols from href/src attributes
  sanitized = sanitized.replace(/(href|src)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, '$1="#"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*(?:'data:[^']*'|"data:[^"]*"|data:[^\s>]+)/gi, '$1="#"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*(?:'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]+)/gi, '$1="#"');

  return sanitized.trim();
}

/**
 * Validates whether a URL is safe for internal/external links.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmed = url.trim();
  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
