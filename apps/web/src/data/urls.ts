export interface ShortenedUrl {
  id: string;
  longUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
}

export function generateFakeShortUrls(count: number): ShortenedUrl[] {
  return Array.from({ length: count }).map((_, i) => {
    const shortCode = `code${i + 1}`;
    return {
      id: crypto.randomUUID(),
      longUrl: `https://example.com/path/${i + 1}`,
      shortCode,
      clickCount: Math.floor(Math.random() * 2000),
      createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
      expiresAt:
        Math.random() > 0.5
          ? new Date(Date.now() + (i + 1) * 86_400_000).toISOString()
          : undefined,
    };
  });
}
