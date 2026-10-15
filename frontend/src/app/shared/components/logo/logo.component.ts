import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle extérieur -->
      <path d="M24 3 L45 42 L3 42 Z" fill="#152247"/>
      <!-- Triangle intérieur clair -->
      <path d="M24 13 L39 40 L9 40 Z" fill="#c8d8ef"/>
      <!-- Bande bleue horizontale -->
      <rect x="10" y="23" width="28" height="5" rx="1.5" fill="#1E6FD9"/>
      <!-- Barres graphique -->
      <rect x="14" y="28" width="6" height="11" rx="1" fill="#1E6FD9"/>
      <rect x="21" y="26" width="6" height="13" rx="1" fill="#152247"/>
      <rect x="28" y="30" width="6" height="9" rx="1" fill="#1E6FD9"/>
    </svg>
  `
})
export class LogoComponent {
  @Input() size = 40;
}
