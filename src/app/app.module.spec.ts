/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AppModule } from './app.module';

describe('AppModule', () => {
  let module: AppModule;

  beforeEach(() => {
    module = new AppModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});
