/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AssessmentActionType } from './assessmentActionType';

export class AssessmentEditorActionModel {
  constructor(
    public actionType: AssessmentActionType,
    public formValue?: any
  ) {}
}
