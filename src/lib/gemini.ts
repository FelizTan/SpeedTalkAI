/**
 * Gemini API client. The user provides the key in Settings; we never store it
 * server-side. Errors are translated to friendly Vietnamese messages.
 */

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiCallOptions {
  apiKey: string;
  systemPrompt?: string;
  contents: GeminiContent[];
  maxOutputTokens?: number;
  temperature?: number;
  model?: string;
}

export class GeminiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GeminiError";
  }
}

export const friendlyErrorMessage = (e: unknown): string => {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "Không có kết nối mạng. Vui lòng thử lại.";
  }
  if (e instanceof GeminiError) {
    if (e.status === 429) return "API đã đạt giới hạn. Thử lại sau 1 phút.";
    if (e.status === 400 || e.status === 401 || e.status === 403) {
      return "API Key không hợp lệ. Kiểm tra lại trong Cài Đặt.";
    }
  }
  return "Có lỗi xảy ra. Vui lòng thử lại.";
};

export const callGemini = async ({
  apiKey,
  systemPrompt,
  contents,
  maxOutputTokens = 200,
  temperature = 0.8,
  model = "gemini-1.5-flash",
}: GeminiCallOptions): Promise<string> => {
  if (!apiKey) throw new GeminiError("missing-api-key", 401);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { maxOutputTokens, temperature },
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GeminiError("network-error");
  }

  if (!response.ok) {
    throw new GeminiError(`gemini-${response.status}`, response.status);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new GeminiError("invalid-response");
  }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new GeminiError("empty-response");
  return text.trim();
};

/** Split AI reply into main text + Vietnamese "💡 Gợi ý:" feedback (if present). */
export const splitAiHint = (text: string): { main: string; hint: string | null } => {
  const idx = text.indexOf("💡 Gợi ý:");
  if (idx === -1) return { main: text.trim(), hint: null };
  return {
    main: text.slice(0, idx).trim(),
    hint: text.slice(idx + "💡 Gợi ý:".length).trim(),
  };
};
