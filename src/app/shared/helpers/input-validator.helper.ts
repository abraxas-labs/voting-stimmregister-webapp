/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export class InputValidatorHelper {
  public static getNumeric(): RegExp {
    return /^\d+$/;
  }

  public static getAlpha(): string {
    return '^[A-Za-z\\u0080-\\uFFFF ./-]{0,7}$';
  }

  public static getSimpleSlText(): string {
    return "^[A-Za-z0-9\\u0080-\\uFFFF ',-./]{0,200}$";
  }

  public static getComplexSlText(): string {
    return '^[A-Za-z0-9\\u0080-\\uFFFF _!?+-@,.:\'()/—"«»;&–`´’+*%]{0,200}$';
  }

  public static getExactDate(): RegExp {
    return /^\d{4}-\d{2}-\d{2}/;
  }
}
