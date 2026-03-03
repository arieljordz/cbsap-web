import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/core/services';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit, OnDestroy {
  loaderVisible = false;
  private subscription!: Subscription;
  constructor(public loaderService: LoaderService) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
   
    this.subscription = this.loaderService.isLoading$.subscribe(
      (loading) => (this.loaderVisible = loading)
    );
  }
}
