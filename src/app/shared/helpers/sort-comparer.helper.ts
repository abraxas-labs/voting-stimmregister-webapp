/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export default class SortComparerHelper {
  static SimpleStringCompare(t1?: string, t2?: string): any {
    if (!t1 || !t2) {
      return 0;
    }

    return t1.localeCompare(t2);
  }

  static SimpleNumberCompare(n1?: number, n2?: number): any {
    if (!n1 || !n2) {
      return 0;
    }

    return n1 - n2;
  }
}
