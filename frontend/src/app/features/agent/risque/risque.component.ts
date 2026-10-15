import { Component } from '@angular/core';

@Component({
  selector: 'app-risque',
  standalone: true,
  imports: [],
  template: `
    <iframe
      src="/api/comportement/risque-eleve"
      style="width:100%; height:calc(100vh - 80px); border:none; border-radius:16px;"
      title="Clients à risque élevé">
    </iframe>
  `
})
export class RisqueComponent {}
