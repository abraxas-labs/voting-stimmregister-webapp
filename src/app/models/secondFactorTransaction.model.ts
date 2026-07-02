/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  SecondFactorTransactionModel as SecondFactorTransactionProto,
  SecondFactorTransactionProvider as SecondFactorTransactionProviderProto,
} from '@abraxas/voting-stimmregister-proto';
import { SecondFactorTransactionProvider } from '@abraxas/voting-lib';

export interface SecondFactorTransaction {
  id: string;
  availableProviders: SecondFactorTransactionProvider[];
  nevis?: {
    correlationCode: string;
    qrCode: string;
  };
}

export function mapSecondFactorTransaction(
  secondFactorTransaction?: SecondFactorTransactionProto
): SecondFactorTransaction | undefined {
  if (!secondFactorTransaction) {
    return;
  }

  const obj = secondFactorTransaction.toObject();
  return {
    id: obj.id!,
    nevis: obj.nevis as SecondFactorTransaction['nevis'],
    availableProviders:
      obj.availableProviders?.map((x) => {
        switch (x) {
          case SecondFactorTransactionProviderProto.SECOND_FACTOR_TRANSACTION_PROVIDER_NEVIS:
            return SecondFactorTransactionProvider.NEVIS;
          case SecondFactorTransactionProviderProto.SECOND_FACTOR_TRANSACTION_PROVIDER_OTP:
            return SecondFactorTransactionProvider.OTP;
          default:
            return SecondFactorTransactionProvider.UNSPECIFIED;
        }
      }) ?? [],
  };
}
