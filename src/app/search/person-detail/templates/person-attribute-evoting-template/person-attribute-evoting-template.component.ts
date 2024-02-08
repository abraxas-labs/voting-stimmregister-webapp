/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-person-attribute-evoting-template',
  templateUrl: './person-attribute-evoting-template.component.html',
  styleUrls: ['./person-attribute-evoting-template.component.scss']
})
export class PersonAttributeEVotingTemplateComponent {

  @Input()
  public eVotingFlag!: boolean;

}
