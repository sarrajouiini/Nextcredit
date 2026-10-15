import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

/**
 * Inline SVG illustration for article covers — zero network dependency
 * (no external image host), so it always renders even offline / behind
 * restrictive firewalls. One distinct composition per `variant` (1-6).
 */
@Component({
  selector: 'app-article-cover',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  template: `
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="ac-svg" [ngSwitch]="variant">

      <!-- Variant 1 — AI / network nodes -->
      <ng-container *ngSwitchCase="1">
        <circle cx="90" cy="80" r="3" class="ac-dot" />
        <circle cx="200" cy="50" r="4" class="ac-dot" />
        <circle cx="320" cy="90" r="3" class="ac-dot" />
        <circle cx="140" cy="180" r="5" class="ac-dot" />
        <circle cx="280" cy="200" r="3" class="ac-dot" />
        <circle cx="60" cy="230" r="3" class="ac-dot" />
        <circle cx="350" cy="240" r="4" class="ac-dot" />
        <path d="M90 80 L200 50 L320 90 M200 50 L140 180 M320 90 L280 200 M140 180 L60 230 M140 180 L280 200 M280 200 L350 240" class="ac-line" />
        <circle cx="200" cy="150" r="34" class="ac-core" />
        <path d="M186 150 h28 M200 136 v28" class="ac-core-cross" />
      </ng-container>

      <!-- Variant 2 — Regulation / shield & scales -->
      <ng-container *ngSwitchCase="2">
        <path d="M200 60 L260 82 V150 C260 195 234 225 200 240 C166 225 140 195 140 150 V82 Z" class="ac-shield" />
        <path d="M200 95 L200 210" class="ac-line-thin" />
        <path d="M155 120 L200 105 L245 120" class="ac-line-thin" />
        <circle cx="155" cy="140" r="18" class="ac-ring-thin" />
        <circle cx="245" cy="140" r="18" class="ac-ring-thin" />
        <path d="M170 120 L140 120 L155 140 Z" class="ac-tri" />
        <path d="M230 120 L260 120 L245 140 Z" class="ac-tri" />
        <circle cx="90" cy="60" r="3" class="ac-dot" />
        <circle cx="320" cy="230" r="4" class="ac-dot" />
        <circle cx="330" cy="70" r="3" class="ac-dot" />
      </ng-container>

      <!-- Variant 3 — Inclusion / connected people -->
      <ng-container *ngSwitchCase="3">
        <circle cx="130" cy="130" r="24" class="ac-ring" />
        <circle cx="130" cy="130" r="10" class="ac-core-sm" />
        <circle cx="250" cy="90" r="19" class="ac-ring" />
        <circle cx="250" cy="90" r="8" class="ac-core-sm" />
        <circle cx="270" cy="200" r="21" class="ac-ring" />
        <circle cx="270" cy="200" r="9" class="ac-core-sm" />
        <circle cx="90" cy="220" r="16" class="ac-ring" />
        <circle cx="90" cy="220" r="7" class="ac-core-sm" />
        <path d="M130 130 L250 90 M130 130 L270 200 M130 130 L90 220 M250 90 L270 200" class="ac-line" />
        <circle cx="330" cy="140" r="3" class="ac-dot" />
        <circle cx="60" cy="90" r="3" class="ac-dot" />
      </ng-container>

      <!-- Variant 4 — Algorithms / layered diagram -->
      <ng-container *ngSwitchCase="4">
        <rect x="70" y="70" width="70" height="46" rx="10" class="ac-block" />
        <rect x="70" y="140" width="70" height="46" rx="10" class="ac-block" />
        <rect x="70" y="210" width="70" height="46" rx="10" class="ac-block" />
        <rect x="260" y="120" width="80" height="60" rx="12" class="ac-block-lg" />
        <path d="M140 93 L260 150 M140 163 L260 150 M140 233 L260 150" class="ac-line" />
        <circle cx="300" cy="150" r="14" class="ac-core-sm" />
        <circle cx="200" cy="40" r="3" class="ac-dot" />
        <circle cx="350" cy="240" r="4" class="ac-dot" />
      </ng-container>

      <!-- Variant 5 — Growth / rising bars -->
      <ng-container *ngSwitchCase="5">
        <rect x="90" y="190" width="30" height="60" rx="6" class="ac-bar" />
        <rect x="140" y="150" width="30" height="100" rx="6" class="ac-bar" />
        <rect x="190" y="110" width="30" height="140" rx="6" class="ac-bar" />
        <rect x="240" y="70" width="30" height="180" rx="6" class="ac-bar-accent" />
        <path d="M90 175 L140 135 L190 95 L270 55" class="ac-line-thin" />
        <circle cx="270" cy="55" r="6" class="ac-core-sm" />
        <circle cx="320" cy="90" r="3" class="ac-dot" />
        <circle cx="70" cy="90" r="3" class="ac-dot" />
      </ng-container>

      <!-- Variant 6 — Explainability / eye & rings -->
      <ng-container *ngSwitchCase="6">
        <ellipse cx="200" cy="150" rx="100" ry="56" class="ac-shield" />
        <circle cx="200" cy="150" r="38" class="ac-core" />
        <circle cx="200" cy="150" r="16" class="ac-core-sm" />
        <circle cx="200" cy="150" r="60" class="ac-ring-thin" />
        <circle cx="90" cy="70" r="3" class="ac-dot" />
        <circle cx="320" cy="220" r="4" class="ac-dot" />
        <circle cx="330" cy="80" r="3" class="ac-dot" />
        <circle cx="70" cy="230" r="3" class="ac-dot" />
      </ng-container>

    </svg>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .ac-svg { width: 100%; height: 100%; display: block; }
    .ac-dot { fill: rgba(255,255,255,.55); }
    .ac-line { stroke: rgba(255,255,255,.28); stroke-width: 1.5; fill: none; }
    .ac-line-thin { stroke: rgba(255,255,255,.3); stroke-width: 1.2; fill: none; }
    .ac-core { fill: rgba(255,255,255,.14); stroke: rgba(255,255,255,.4); stroke-width: 1.5; }
    .ac-core-sm { fill: rgba(255,255,255,.5); }
    .ac-core-cross { stroke: rgba(255,255,255,.7); stroke-width: 2; }
    .ac-ring { fill: rgba(255,255,255,.1); stroke: rgba(255,255,255,.35); stroke-width: 1.5; }
    .ac-ring-thin { fill: none; stroke: rgba(255,255,255,.25); stroke-width: 1.3; }
    .ac-shield { fill: rgba(255,255,255,.1); stroke: rgba(255,255,255,.35); stroke-width: 1.5; }
    .ac-tri { fill: rgba(255,255,255,.2); }
    .ac-block { fill: rgba(255,255,255,.12); stroke: rgba(255,255,255,.3); stroke-width: 1.2; }
    .ac-block-lg { fill: rgba(255,255,255,.16); stroke: rgba(255,255,255,.4); stroke-width: 1.5; }
    .ac-bar { fill: rgba(255,255,255,.16); }
    .ac-bar-accent { fill: rgba(255,255,255,.32); }
  `]
})
export class ArticleCoverComponent {
  @Input() variant: number = 1;
}
