/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, inject } from '@angular/core';
import { PersonWithDomainOfInfluences } from '../../models/person/person';
import { PersonService } from '../../services/person.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAttributeEnum } from '../../models/person/personAttributeEnum';
import { Sex } from '../../models/person/sex';

interface PersonAttribute {
  key: PersonAttributeEnum;
  label: string;
  upperLabel: string;
}

export enum PersonAddressType {
  MoveIn,
  ResidenceAddress,
}

@Component({
  selector: 'app-person',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss'],
  standalone: false,
})
export class PersonDetailComponent implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  public person!: PersonWithDomainOfInfluences;
  public personAddressTypes: PersonAddressType[] = [];
  public personAttributes: PersonAttribute[];
  public readonly addressTypes: typeof PersonAddressType = PersonAddressType;
  public readonly sex: typeof Sex = Sex;
  private readonly allPersonAttributes: PersonAttribute[];

  constructor() {
    this.personAttributes = this.allPersonAttributes = Object.values(PersonAttributeEnum).map((key) => {
      const label = this.translate.instant('person.attribute-label.' + key);
      return {
        key,
        label,
        upperLabel: label.toUpperCase(),
      };
    });
  }

  public async ngOnInit(): Promise<void> {
    const registerId: any = this.route.snapshot.paramMap.get('personRegisterId');

    this.person = await this.personService.getSingle(registerId);
    this.personAddressTypes = [PersonAddressType.ResidenceAddress];
    if (!this.person.moveInUnknown) {
      this.personAddressTypes.push(PersonAddressType.MoveIn);
    }

    this.filterAttributes('');
  }

  public filterAttributes(searchString: string) {
    searchString = searchString.toUpperCase();
    this.personAttributes = this.allPersonAttributes.filter((p) => p.upperLabel.includes(searchString));
  }

  public getPersonValidationErrors(attribute: PersonAttributeEnum): string[] | null {
    if (!this.person.validationErrors) {
      return null;
    }
    const result = Object.getOwnPropertyNames(this.person.validationErrors)
      .filter((n) => n.toUpperCase() == attribute.toUpperCase())
      .flatMap((name) => this.person.validationErrors?.[name]?.messages)
      .filter((value) => !!value);

    if (!(result?.length > 0)) return null;
    return <string[]>result;
  }
}
