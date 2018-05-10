import { Component, Input } from '@angular/core';
import { BfSettingsService } from '../../settings.service';

@Component({
  selector: 'bf-footer',
  styleUrls: ['./footer.component.less'],
  template: `
    <p class="footer">
      &copy; {{ settings.app.year }} {{ settings.app.name }} 版权所有
      <br> {{ settings.app.description }}
    </p>
  `
})
export class BfFooterComponent {
  @Input() padding = false;

  constructor(public settings: BfSettingsService) {
  }
}
