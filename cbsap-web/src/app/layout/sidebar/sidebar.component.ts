import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: true,
    imports: [MenuComponent]
})
export class SidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {
    

  }
}
