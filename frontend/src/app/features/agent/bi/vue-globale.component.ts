import { Component } from '@angular/core';
import { BiFrameComponent } from '../../../shared/components/bi-frame/bi-frame.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-bi-vue-globale',
  standalone: true,
  imports: [BiFrameComponent],
  template: `<app-bi-frame [url]="url"></app-bi-frame>`
})
export class BiVueGlobaleComponent {
  url = environment.powerBiDashboards.vueGlobale;
}
