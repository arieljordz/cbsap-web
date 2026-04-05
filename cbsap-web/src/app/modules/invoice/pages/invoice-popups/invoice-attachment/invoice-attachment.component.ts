import { GetAllInvAttachmentDto } from './../../../../../core/model/invoicing/invoice-attachment/invoice-attachment.dto';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { ResponseResult } from '@core/model/common';
import {
  InvAttachmentDto,
  InvAttachmentFromDto,
} from '@core/model/invoicing/invoicing.index';
import { InvoiceAttachmentService } from '@core/services/invoicing/invoice-attachment.service';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-invoice-attachment',
  standalone: true,
  imports: [PrimeImportsModule, CommonModule, NgFor,],
  templateUrl: './invoice-attachment.component.html',
  styleUrl: './invoice-attachment.component.scss',
})
export class InvoiceAttachmentComponent implements OnInit {
  @ViewChild('fu') fileUpload!: FileUpload;
  attachments?: InvAttachmentDto[] = [];

  uploadUrl = this.attachmentService.getUploadUrl();
  invoiceID: number = 0;

  constructor(
    private attachmentService: InvoiceAttachmentService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;
  }
  ngOnInit(): void {
    this.getAttachments();
  }

  // onUpload(event: any): void {
  //   const uploaded = event.originalEvent.body as InvAttachmentFromDto;

  //   console.log(event);
  //   this.attachments.unshift(uploaded);
  // }
  beforeUpload(event: any): void {
    event.formData.append('InvoiceID', this.invoiceID.toString());
  }

  onCustomUpload(event: any) {
    const file: File = event.files[0];
    let attachment: InvAttachmentFromDto = {
      file: file,
      invoiceID: this.invoiceID,
    };

    this.attachmentService.upload(attachment).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.attachments?.unshift(res.responseData as InvAttachmentDto);
          this.fileUpload.clear();
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  download(id: number) {
    this.attachmentService.downloadAttachment(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'download';

        const utf8Match = disposition?.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match) {
          filename = decodeURIComponent(utf8Match[1]);
        } else {
          const asciiMatch = disposition?.match(/filename="?([^"]+)"?/i);
          if (asciiMatch) {
            filename = asciiMatch[1];
          }
        }

        const blob = response.body!;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      error: (err) => console.error('Download failed', err),
    });
  }

  getAttachments() {
    this.attachmentService.getAttachments(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.attachments = response?.responseData?.map((data) => {
            return data;
          });
        }
      },
      error: (error: ResponseResult<InvAttachmentDto[]>) => {
        // this.message.showToast(
        //   MessageSeverity.error.toString(),
        //   'Error on Adding Comment',
        //   error.messages?.[0],
        //   2000
        // );
      },
    });
  }
}
