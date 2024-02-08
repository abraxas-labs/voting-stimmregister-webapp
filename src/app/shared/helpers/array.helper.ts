/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export async function filterAsync<T>(arr: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const filterResults = await Promise.all(arr.map(predicate));
  return arr.filter((_, i) => filterResults[i]);
}
