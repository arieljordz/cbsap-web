import {
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [
    PrimeImportsModule,
    NgSwitch,
    NgSwitchCase,
    NgFor,
    NgIf,
    NgSwitchDefault,
    NgClass,
    NgTemplateOutlet,
    YesnoPipe,
  ],
  templateUrl: './dynamic-grid.component.html',
  styleUrl: './dynamic-grid.component.scss',
})
export class DynamicGridComponent<T> implements OnInit, OnDestroy {
  @Input() config: GridConfig<T> | null = null;
  @Input() tableStyle?: { [key: string]: any };

  sortField: string = '';
  sortOrder: number = 1;
  pageSize = 10;
  pageNumber = 1;
  private hasSorted = false;

  @Output() load = new EventEmitter<{
    pageNumber: number;
    pageSize: number;
    sortField: string;
    sortOrder: number;
  }>();

  private subscription?: Subscription;
  @ViewChild(Table) table?: Table;

  constructor(
    private dynamicGridService: DynamicGridService<T>,
    private cdr: ChangeDetectorRef
  ) {}

  resetTable(): void {
    this.table?.reset();
    this.sortField = '';
    this.sortOrder = 1;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.hasSorted = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.dynamicGridService.gridConfig$.subscribe(
      (config) => {
        this.config = config;
        this.cdr.detectChanges();
      }
    );
    if (!this.tableStyle) {
      this.tableStyle = { 'min-width': '50rem' };
    }
  }

  ngAfterViewInit(): void{
    const parsed = JSON.parse(localStorage.getItem(this.config?.gridKey || '') || '{}');
    this.sortField = parsed.sortField ?? '';
    this.sortOrder = parsed.sortOrder ?? 1;
    this.pageSize = parsed.rows ?? 10;
    this.pageNumber = parsed.first / parsed.rows;
    var first = parsed.first;

    const initialEvent = {
      first: first,
      rows: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.loadData(initialEvent);
  }

  loadData(event: any): void {
    this.pageNumber =
      Math.floor((event.first ?? 0) / (event.rows ?? this.pageSize)) + 1;
    this.pageSize = event.rows ?? this.pageSize;

    if (!this.hasSorted && event.sortField) {
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder ?? -1;
      this.hasSorted = true;
    } else {
      this.sortField = event.sortField ?? this.sortField;
      this.sortOrder =
        typeof event.sortOrder === 'number' ? event.sortOrder : this.sortOrder;
    }
    if (this.config) {
      this.config.sortField = this.sortField;
      this.config.sortOrder = this.sortOrder;
      this.config.pageNumber = this.pageNumber;
      this.config.pageSize = this.pageSize;
    }

    this.load.emit({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    });
  }

  // first column in the row is excempted to clickable row intended to actions button
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
