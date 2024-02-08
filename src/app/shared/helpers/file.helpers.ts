/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export class FileHelpers {
  public static base64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = Buffer.from(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.subarray(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.subarray(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  public static getFileExtension(fileName: string): string {
    const indexOfDelimeter = fileName.lastIndexOf('.');
    return indexOfDelimeter === -1 ? '' : fileName.substr(fileName.lastIndexOf('.'));
  }
}
