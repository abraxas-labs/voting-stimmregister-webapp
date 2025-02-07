/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-attribute-template',
  templateUrl: './person-attribute-template.component.html',
  styleUrls: ['./person-attribute-template.component.scss'],
})
export class PersonAttributeTemplateComponent {
  @Input()
  public title!: string;

  @Input()
  public content?: string;
}
