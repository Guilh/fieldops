import { readFileSync } from "node:fs";

// The template index. Every template in templates/ is registered here.
export const TEMPLATES = {
  "reminder-24h": "reminder-24h.txt",
} as const;

export type TemplateName = keyof typeof TEMPLATES;

export function render(name: TemplateName, values: Record<string, string>): string {
  const text = readFileSync(new URL(`../templates/${TEMPLATES[name]}`, import.meta.url), "utf8").trim();
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`Template ${name} needs a value for ${key}`);
    return value;
  });
}
