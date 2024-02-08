/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from "@angular/core";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"]
})
export class MainLayoutComponent {
  public isDetailSite() {
    return window.location.pathname.includes("person") || (window.location.pathname.includes("filter") && !window.location.pathname.includes("filters"));
  }
}
