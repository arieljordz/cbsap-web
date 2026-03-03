import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuService } from 'src/app/core/services';
import { ResponseResult } from 'src/app/core/model/common';
import { MenuListDto } from 'src/app/core/model/menu/MenuListDto';
import { filter, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, MenuItemComponent],
   changeDetection: ChangeDetectionStrategy.Default
})
export class MenuComponent implements OnInit, OnDestroy {
 
  private menuService = inject(MenuService);
  private destroy$ = new Subject<void>();
  model: any[] = [];

  ngOnInit() {
    this.populateMenu();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  populateMenu() {
    this.menuService.currentRole$
      .pipe(
        filter((role) => role !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((role) => {
        this.getMenu(role!);
        return role;
      });

  }

  private getMenu(roleID?: number) {
    this.menuService.getMenu(roleID).pipe(take(1)).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.model = response.responseData as any;
        }
      },
      error: (error: ResponseResult<MenuListDto>) => {},
    });
  }
}
