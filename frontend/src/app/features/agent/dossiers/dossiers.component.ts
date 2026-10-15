import { Component } from '@angular/core';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [],
  template: `
    <iframe
      src="/api/octroi/dossiers-attente"
      style="width:100%; height:calc(100vh - 80px); border:none; border-radius:16px;"
      title="Dossiers en attente">
    </iframe>
  `
})
export class DossiersComponent {}
