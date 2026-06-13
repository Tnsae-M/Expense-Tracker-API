export function isPrismaDecimal(
  value: unknown,
): value is { toNumber: () => number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).toNumber === "function"
  );
}

export function serializePrismaResult<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializePrismaResult(item)) as unknown as T;
  }

  if (isPrismaDecimal(value)) {
    return Number(value.toNumber()) as unknown as T;
  }
  if (value instanceof Date) {
    return value as unknown as T;
  }
  if (typeof value === "object") {
    const normalized: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(
      value as Record<string, unknown>,
    )) {
      normalized[key] = serializePrismaResult(item as T);
    }
    return normalized as T;
  }

  return value;
}
