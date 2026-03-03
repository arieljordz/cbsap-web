import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private messageService: MessageService) {}

  showToast(
    severity: string,
    summary: string,
    detail?: string,
    life: number = 3000
  ) {
    this.messageService.clear('tc'); 

    this.messageService.add({
      key: 'tc',
      severity,
      summary,
      detail,
      life
    });
  }
}
