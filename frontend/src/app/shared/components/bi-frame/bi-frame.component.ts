import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-bi-frame',
  standalone: true,
  imports: [],
  template: `
    <div class="bi-frame-wrap">
      <iframe [src]="safeUrl" class="bi-iframe" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .bi-frame-wrap {
      background: #fff; border: 1px solid #e8edf6; border-radius: 20px;
      /* Crop the bottom ~40px : Power BI's own in-report page navigator strip,
         redundant with our sidebar which already switches pages. */
      overflow: hidden; height: calc(100vh - 148px); min-height: 500px;
      animation: bi-in .4s cubic-bezier(.4,0,.2,1);
    }
    @keyframes bi-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .bi-iframe { width: 100%; height: calc(100% + 44px); border: none; display: block; margin-bottom: -44px; }
  `]
})
export class BiFrameComponent {
  @Input() set url(value: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  safeUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}
}
