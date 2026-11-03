/**
 * Query-string encoding for the API's filter syntax: nested objects become bracket keys
 * (`created[gte]=…`), arrays repeat the key with `[]` (`expand[]=customer`), Dates become UTC
 * ISO-8601, and `undefined`/`null` values are dropped. Keys and values are percent-encoded.
 */
export type QueryValue =
  string | number | boolean | Date | null | undefined | QueryValue[] | { [key: string]: QueryValue };

export function encodeQuery(params: Record<string, QueryValue> | undefined): string {
  if (!params) return '';
  const search = new URLSearchParams();
  const add = (key: string, value: QueryValue): void => {
    if (value === undefined || value === null) return;
    if (value instanceof Date) {
      search.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      for (const item of value) add(`${key}[]`, item);
    } else if (typeof value === 'object') {
      for (const [sub, item] of Object.entries(value)) add(`${key}[${sub}]`, item);
    } else {
      search.append(key, String(value));
    }
  };
  for (const [key, value] of Object.entries(params)) add(key, value);
  const text = search.toString();
  return text ? `?${text}` : '';
}
