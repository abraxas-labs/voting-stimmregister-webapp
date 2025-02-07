/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export class ConverterHelpers {
  public static splitCamelCaseToSnakeCase(name: string): string {
    const keys: string[] = name.split(/(?=[A-Z0-9_])/);
    let string = '';
    keys.forEach((key) => {
      if (!key.includes('_')) {
        string += '_' + key.toUpperCase();
      }
    });
    return string;
  }
}
