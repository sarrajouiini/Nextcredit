import {
  Component, OnInit, OnDestroy, effect, ElementRef,
  signal, NgZone, inject
} from '@angular/core';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { TourService, TourStep } from '../../../core/services/tour.service';
import { TranslationService } from '../../../core/services/translation.service';

interface Rect { top: number; left: number; width: number; height: number; }

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [NgIf, NgClass, NgFor],
  template: `
    <div class="tour-backdrop" *ngIf="tour.active()" (click)="onBackdropClick($event)">

      <!-- SVG spotlight mask -->
      <svg class="tour-svg" *ngIf="spotRect && currentStep()?.selector">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white"/>
            <rect
              [attr.x]="spotRect.left - pad"
              [attr.y]="spotRect.top - pad"
              [attr.width]="spotRect.width + pad*2"
              [attr.height]="spotRect.height + pad*2"
              rx="14"
              fill="black"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(11,22,50,0.82)" mask="url(#spotlight-mask)"/>
      </svg>

      <!-- Dark full overlay for welcome step -->
      <div class="tour-full-dark" *ngIf="!currentStep()?.selector"></div>

      <!-- Animated ring around target -->
      <div class="tour-ring"
           *ngIf="spotRect && currentStep()?.selector"
           [style.top.px]="spotRect.top - pad"
           [style.left.px]="spotRect.left - pad"
           [style.width.px]="spotRect.width + pad*2"
           [style.height.px]="spotRect.height + pad*2">
      </div>

      <!-- Tooltip card -->
      <div class="tour-card"
           [ngClass]="cardClass()"
           [style.top.px]="cardPos.top"
           [style.left.px]="cardPos.left"
           *ngIf="currentStep()">

        <!-- Progress bar -->
        <div class="tour-progress-bar">
          <div class="tour-progress-fill" [style.width.%]="progressPct()"></div>
        </div>

        <!-- Step counter -->
        <div class="tour-step-counter">
          <span class="tour-step-dot" *ngFor="let s of dotArray(); let i = index"
                [class.active]="i === tour.step()"></span>
        </div>

        <!-- Icon -->
        <div class="tour-card-icon">
          <i class="bi" [class]="currentStep()!.icon"></i>
        </div>

        <!-- Title -->
        <h3 class="tour-card-title">
          {{ ts.isEn() ? currentStep()!.titleEn : currentStep()!.titleFr }}
        </h3>

        <!-- Description -->
        <p class="tour-card-desc">
          {{ ts.isEn() ? currentStep()!.descEn : currentStep()!.descFr }}
        </p>

        <!-- Actions -->
        <div class="tour-card-actions">
          <button class="tour-skip" (click)="tour.finish()">
            {{ ts.isEn() ? 'Skip' : 'Passer' }}
          </button>
          <div class="tour-nav">
            <button class="tour-prev" (click)="tour.prev()" *ngIf="tour.step() > 0">
              <i class="bi bi-arrow-left"></i>
            </button>
            <button class="tour-next" (click)="tour.next()">
              {{ isLast() ? (ts.isEn() ? 'Finish ✓' : 'Terminer ✓') : (ts.isEn() ? 'Next' : 'Suivant') }}
              <i class="bi bi-arrow-right" *ngIf="!isLast()"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .tour-backdrop {
      position: fixed; inset: 0; z-index: 9000;
      pointer-events: all;
    }
    .tour-svg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none;
    }
    .tour-full-dark {
      position: absolute; inset: 0;
      background: rgba(11,22,50,0.88);
      pointer-events: none;
    }

    /* Animated ring around highlighted element */
    .tour-ring {
      position: absolute;
      border-radius: 14px;
      border: 2.5px solid #89B4E8;
      box-shadow: 0 0 0 4px rgba(137,180,232,0.25), 0 0 20px rgba(137,180,232,0.4);
      pointer-events: none;
      animation: ring-pulse 1.8s ease-in-out infinite;
      transition: top 0.4s cubic-bezier(.4,0,.2,1),
                  left 0.4s cubic-bezier(.4,0,.2,1),
                  width 0.4s cubic-bezier(.4,0,.2,1),
                  height 0.4s cubic-bezier(.4,0,.2,1);
    }
    @keyframes ring-pulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(137,180,232,0.25), 0 0 20px rgba(137,180,232,0.4); }
      50%       { box-shadow: 0 0 0 8px rgba(137,180,232,0.12), 0 0 36px rgba(137,180,232,0.6); }
    }

    /* Tooltip card */
    .tour-card {
      position: absolute;
      width: 320px;
      background: #fff;
      border-radius: 20px;
      padding: 0;
      box-shadow: 0 24px 64px rgba(11,22,50,.32), 0 4px 16px rgba(11,22,50,.12);
      overflow: hidden;
      animation: card-in 0.35s cubic-bezier(.4,0,.2,1);
      transition: top 0.4s cubic-bezier(.4,0,.2,1), left 0.4s cubic-bezier(.4,0,.2,1);
      pointer-events: all;
    }
    @keyframes card-in {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* When centered (welcome step) */
    .tour-card.center {
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 380px;
    }

    .tour-progress-bar {
      height: 3px;
      background: #f0f4fb;
    }
    .tour-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1E6FD9, #89B4E8);
      transition: width 0.4s ease;
    }

    .tour-step-counter {
      display: flex; gap: 5px; justify-content: center;
      padding: 12px 20px 0;
    }
    .tour-step-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #e8edf6; transition: all .3s;
    }
    .tour-step-dot.active { background: #1E6FD9; transform: scale(1.3); }

    .tour-card-icon {
      width: 52px; height: 52px;
      background: linear-gradient(135deg, #152247, #1E6FD9);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; color: #fff;
      margin: 14px auto 12px;
    }

    .tour-card-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800; font-size: 17px;
      color: #152247; text-align: center;
      margin: 0 20px 10px;
    }
    .tour-card-desc {
      font-size: 13.5px; color: #6b7488; line-height: 1.65;
      text-align: center; margin: 0 20px 18px;
    }

    .tour-card-actions {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 20px;
      border-top: 1px solid #f0f4fb;
      background: #f8faff;
    }
    .tour-skip {
      background: none; border: none; font-size: 12.5px;
      color: #9aa1b3; cursor: pointer; padding: 4px 8px;
      border-radius: 8px; transition: color .15s;
    }
    .tour-skip:hover { color: #ef4444; }
    .tour-nav { display: flex; align-items: center; gap: 8px; }

    .tour-prev {
      width: 34px; height: 34px; border-radius: 10px;
      border: 1.5px solid #e8edf6; background: #fff;
      color: #152247; display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 13px; transition: all .15s;
    }
    .tour-prev:hover { border-color: #1E6FD9; color: #1E6FD9; }

    .tour-next {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 11px; border: none;
      background: linear-gradient(135deg, #152247, #1E6FD9);
      color: #fff; font-size: 13px; font-weight: 700;
      cursor: pointer; transition: opacity .15s;
    }
    .tour-next:hover { opacity: .88; }
  `]
})
export class TourComponent implements OnInit, OnDestroy {
  tour = inject(TourService);
  ts   = inject(TranslationService);

  pad = 10;
  spotRect: Rect | null = null;
  cardPos = { top: 0, left: 0 };
  private _centered = false;

  private resizeObs!: ResizeObserver;

  constructor(private zone: NgZone) {
    effect(() => {
      if (this.tour.active()) {
        const step = this.tour.steps[this.tour.step()];
        // small delay so animation feels smooth between steps
        setTimeout(() => this.positionFor(step), 50);
      }
    });
  }

  ngOnInit(): void {
    this.resizeObs = new ResizeObserver(() => {
      if (this.tour.active()) {
        const step = this.tour.steps[this.tour.step()];
        this.positionFor(step);
      }
    });
    this.resizeObs.observe(document.body);
  }

  ngOnDestroy(): void { this.resizeObs?.disconnect(); }

  currentStep(): TourStep | null {
    return this.tour.active() ? this.tour.steps[this.tour.step()] : null;
  }

  isLast(): boolean { return this.tour.step() === this.tour.total - 1; }

  progressPct(): number { return ((this.tour.step() + 1) / this.tour.total) * 100; }

  dotArray(): any[] { return Array(this.tour.total); }

  cardClass(): Record<string, boolean> {
    return { center: this._centered };
  }

  positionFor(step: TourStep): void {
    this._centered = false;
    if (!step.selector) {
      this.spotRect = null;
      this._centered = true;
      return;
    }
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) { this.spotRect = null; this._centered = true; return; }

    const r = el.getBoundingClientRect();
    this.spotRect = { top: r.top, left: r.left, width: r.width, height: r.height };

    const cardW = 320, cardH = 260, margin = 18;
    const vw = window.innerWidth, vh = window.innerHeight;

    if (step.position === 'right') {
      let left = r.right + margin;
      let top  = r.top + r.height / 2 - cardH / 2;
      if (left + cardW > vw - 10) left = r.left - cardW - margin;
      top = Math.max(10, Math.min(top, vh - cardH - 10));
      this.cardPos = { top, left };
    } else if (step.position === 'bottom') {
      this.cardPos = {
        top:  r.bottom + margin,
        left: Math.min(r.left, vw - cardW - 10),
      };
    } else {
      this.cardPos = {
        top:  vh / 2 - cardH / 2,
        left: vw / 2 - cardW / 2,
      };
      this._centered = true;
    }
  }

  onBackdropClick(e: MouseEvent): void {
    // only close if clicking the dark area, not the card
    const target = e.target as HTMLElement;
    if (!target.closest('.tour-card') && !target.closest('.tour-ring')) {
      // don't close on backdrop click — user must use buttons
    }
  }
}
