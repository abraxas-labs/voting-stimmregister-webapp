/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Person } from "../../../models/person/person";

@Component({
  selector: "app-person-address",
  templateUrl: "./person-address.component.html",
  styleUrls: ["./person-address.component.scss"]
})
export class PersonAddressComponent implements AfterViewInit {

  @ViewChild("address")
  public addressComponent?: ElementRef;

  @Input()
  public person!: Person;

  public addressText: string = "";

  constructor(private readonly cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this.addressText = this.addressComponent!.nativeElement.innerText ?? "";
    this.cd.detectChanges();
  }
}
