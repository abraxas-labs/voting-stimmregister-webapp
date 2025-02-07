/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-person-attribute-validation-template',
  templateUrl: './person-attribute-validation-template.component.html',
  styleUrls: ['./person-attribute-validation-template.component.scss'],
})
export class PersonAttributeValidationTemplateComponent implements AfterViewInit {
  @Input()
  public title!: string;

  @Input()
  public content?: string;

  @Input()
  public validationInfo?: string[] | null;

  private hideTimeoutId: any = null;
  private showTimeoutId: any = null;
  private popperInstance: any = null;

  @ViewChild('validationIcon') public validationIcon!: ElementRef;
  @ViewChild('tooltip') public tooltip!: ElementRef;
  @ViewChild('arrow') public arrow!: ElementRef;

  ngAfterViewInit() {
    if (this.validationIcon && this.tooltip?.nativeElement && this.arrow?.nativeElement) {
      const showEvents = ['mouseenter', 'focus'];
      const hideEvents = ['mouseleave', 'blur'];
      showEvents.forEach((event) =>
        this.validationIcon.nativeElement.addEventListener(event, () => {
          this.showTooltip();
        })
      );
      hideEvents.forEach((event) =>
        this.validationIcon.nativeElement.addEventListener(event, () => {
          this.hideTooltip();
        })
      );

      const arrowRef = this.arrow.nativeElement;
      if (!!arrowRef) {
        const styles = window.getComputedStyle(this.tooltip.nativeElement);
        arrowRef.children[0].style.background = styles.backgroundColor; // applies the color of the theme style
      }
    }
  }

  showTooltip() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId!);
      this.hideTimeoutId = null;
    }

    this.showTimeoutId = setTimeout(() => {
      this.tooltip.nativeElement.setAttribute('data-show', '');
      this.createPopper();
    }, 600);
  }

  hideTooltip() {
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }

    this.hideTimeoutId = window.setTimeout(() => {
      this.tooltip.nativeElement.removeAttribute('data-show');
      this.destroyPopper();
    }, 100);
  }

  createPopper() {
    const validationIcon: Element = this.validationIcon.nativeElement;
    const tooltip: any = this.tooltip.nativeElement;
    this.popperInstance = createPopper(validationIcon, tooltip, {
      placement: 'top',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'bottom'],
          },
        },
        {
          name: 'arrow',
          options: {
            padding: 5,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });
  }

  destroyPopper() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}
