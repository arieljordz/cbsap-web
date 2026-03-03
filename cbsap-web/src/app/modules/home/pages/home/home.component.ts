import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { NoticeComponent } from '../notice/notice.component';
import { AssignedInvoiceComponent } from '../assigned-invoice/assigned-invoice.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [NoticeComponent, AssignedInvoiceComponent, NgIf],
})
export class HomeComponent implements OnInit {
  hideQueues: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
