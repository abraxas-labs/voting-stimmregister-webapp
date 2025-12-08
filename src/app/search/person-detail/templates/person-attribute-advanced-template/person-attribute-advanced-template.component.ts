/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-attribute-advanced-template',
  templateUrl: './person-attribute-advanced-template.component.html',
  styleUrls: ['./person-attribute-advanced-template.component.scss'],
  standalone: false,
})
export class PersonAttributeAdvancedTemplateComponent {
  @Input()
  public title!: string;

  @Input()
  public content?: string;

  @Input()
  public valid!: boolean;
}
