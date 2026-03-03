import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

@Component({
  selector: 'app-invoice-image-viewer',
  standalone: true,
  imports: [NgIf, PrimeImportsModule, NgClass],
  templateUrl: './invoice-image-viewer.component.html',
  styleUrl: './invoice-image-viewer.component.scss',
  host: {
    class: 'h-full w-full flex flex-col',
  },
})
export class InvoiceImageViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() invoiceId!: number;
  pdfUrl?: SafeResourceUrl;
  loading: boolean = false;
  private objectUrl?: string;

  constructor(
    private sanitizer: DomSanitizer,
    private invoiceService: InvoiceDetailService
  ) {}

  ngOnInit() {
    this.loadInvoicePdf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceId'] && !changes['invoiceId'].firstChange) {
      this.loadInvoicePdf();
    }
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  loadInvoicePdf() {
    this.loading = true;
    this.invoiceService.getInvoicePdf(this.invoiceId).subscribe({
      next: (blob) => {
        if (this.objectUrl) {
          URL.revokeObjectURL(this.objectUrl);
        }
        const pdfUrl = URL.createObjectURL(blob);
        this.objectUrl = pdfUrl;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
        this.loading = false;
      },
      error: () => {
        console.error('Error loading invoice PDF');
        this.pdfUrl = undefined;
        this.loading = false;
      },
    });
  }
}
