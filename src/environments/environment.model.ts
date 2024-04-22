/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthenticationConfig, AuthorizationConfig, UserConfig } from '@abraxas/base-components';

export interface Environment {
  production: boolean;
  env: string;
  authenticationConfig: AuthenticationConfig &
    Required<Pick<AuthenticationConfig, 'clientId' | 'issuer' | 'scope'>>;
  authorizationConfig: AuthorizationConfig;
  userConfig: UserConfig;
  serviceUrl: string;
  restApiEndpoint: string;
  maxEvoterSharePercentage: number;
  thresholdEvoterSharePercentage: number;
}
