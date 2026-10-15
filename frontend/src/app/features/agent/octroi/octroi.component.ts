import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-octroi',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  template: `
    <div class="oc-wrapper">
      <!-- Loading overlay -->
      <div class="oc-loading" *ngIf="frameLoading()">
        <div class="oc-spinner"></div>
        <span>{{ 'iframe.loading' | t }}</span>
      </div>
      <!-- iFrame -->
      <div class="oc-frame-box" [class.oc-fullscreen]="fs()">
        <button class="oc-fab" (click)="refresh()" [title]="'iframe.refresh' | t">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
        <button class="oc-fab oc-fab-fs" (click)="toggleFullscreen()" [title]="'iframe.fullscreen' | t">
          <i class="bi" [class.bi-fullscreen]="!fs()" [class.bi-fullscreen-exit]="fs()"></i>
        </button>
        <iframe
          #frame
          [src]="safeUrl"
          class="oc-iframe"
          frameborder="0"
          (load)="frameLoading.set(false)"
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .oc-wrapper { display: flex; flex-direction: column; height: calc(100vh - 116px); }

    .oc-loading {
      position: absolute; z-index: 10; inset: 0; display: flex;
      align-items: center; justify-content: center; gap: 12px;
      background: rgba(248,250,255,.85); backdrop-filter: blur(4px);
      font-size: 14px; color: #6b7488; border-radius: 18px;
    }
    .oc-spinner { width: 28px; height: 28px; border: 3px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .oc-frame-box {
      flex: 1; background: #fff; border-radius: 18px;
      border: 1px solid #e8edf6; overflow: hidden; position: relative;
    }
    .oc-fullscreen {
      position: fixed !important; inset: 0 !important; z-index: 1000 !important;
      border-radius: 0 !important; border: none !important;
    }
    .oc-iframe { width: 100%; height: 100%; border: none; display: block; }

    .oc-fab {
      position: absolute; bottom: 16px; z-index: 20;
      width: 38px; height: 38px; border-radius: 10px; border: 1px solid #e8edf6;
      background: rgba(255,255,255,.92); backdrop-filter: blur(4px);
      color: #152247; display: flex; align-items: center; justify-content: center;
      font-size: 15px; cursor: pointer; transition: all .15s;
      box-shadow: 0 4px 14px rgba(21,34,71,.1);
    }
    .oc-fab:hover { border-color: #1E6FD9; color: #1E6FD9; }
    .oc-fab { right: 60px; }
    .oc-fab-fs { right: 14px; }
  `]
})
export class OctroiComponent {
  safeUrl: SafeResourceUrl;
  frameLoading = signal(true);
  fs = signal(false);
  private rawUrl: string;

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {
    const token = this.authService.getAccessToken() || '';
    const base = environment.apiUrl.replace('/api', '');
    this.rawUrl = `${base}/api/octroi/ui?token=${encodeURIComponent(token)}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
  }

  refresh(): void {
    this.frameLoading.set(true);
    const t = this.rawUrl + '&_=' + Date.now();
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(t);
  }

  toggleFullscreen(): void { this.fs.set(!this.fs()); }
}
