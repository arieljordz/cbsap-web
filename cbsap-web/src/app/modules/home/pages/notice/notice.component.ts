import { LoaderService } from './../../../../core/services/shared/loader.service';
import { Component, ElementRef, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ResponseResult } from 'src/app/core/model/common';
import { Notice } from 'src/app/core/model/dashboard/index';
import { DashboardService } from 'src/app/core/services';
import { NoticeEditorComponent } from './notice-editor.component';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, Scroll } from '@angular/router';
import { Divider } from 'primeng/divider';
import { DateTimeFormatPipe } from '../../../../shared/pipes/datetimeformat.pipe';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { AvatarModule } from "primeng/avatar";
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';


@Component({
    selector: 'app-notice',
    templateUrl: './notice.component.html',
    styleUrls: ['./notice.component.scss'],
    providers: [DialogService],
    standalone: true,
    imports: [
    Button,
    Tooltip,
    NgIf,
    RouterLink,
    DateTimeFormatPipe,
    CarouselModule,
    AvatarModule,
    BadgeModule,
    DialogModule
    
],
})
export class NoticeComponent implements OnInit {
  private destroySubject: Subject<void> = new Subject();
  loading:boolean=false;
  notices:Notice[]=[];

  visible: boolean = false;  
  responsiveOptions: any[] | undefined;
  
  showReadMore:boolean = false;
  newMessageCount = signal(0);
  readMoreData:WritableSignal<Notice | null> = signal(null);

  readMore(notice:Notice) {
      this.showReadMore = true;
      this.readMoreData.set(notice);      
  }

   
  constructor(  
    private dialogService: DialogService,
    private dashboardService:DashboardService,
    private loaderService : LoaderService
   
  ) {}
  
  ngOnInit(): void {   
      this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 4,
                numScroll: 2
            },
            {
                breakpoint: '591px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '381px',
                numVisible: 2,
                numScroll: 1
            }
        ];
     
    
    this.getNotices();
   
  }


   
   getInitials(userName: string): string {
      if (!userName) {
        return '';
      }
      return userName
        .split(' ')
        .map(namePart => namePart[0])
        .join('')
        .toUpperCase();
}

  addMessage() {
    const ref = this.dialogService.open(NoticeEditorComponent, {
      header: 'Add message',
      width: '30vw',
      modal:true,
      closable: true,
      breakpoints: {
          '960px': '45vw',
          '640px': '50vw'
      },
    });

    ref.onClose.subscribe((success:boolean) => {      
      if (success){
        this.getNotices();
      }
    });
  }

  editNotice(notice:Notice) {
  
    const ref = this.dialogService.open(NoticeEditorComponent, {
      header: 'Edit message',
      width: '30vw',
      modal:true,
      closable: true,
      breakpoints: {
          '960px': '45vw',
          '640px': '50vw'
      },
      data: { notice: notice },
    });

    ref.onClose.subscribe((success:boolean) => {      
      if (success){
        this.getNotices();
      }
    });
  }

  //   checkOverflow() {
  //   const el = this.contentElement.nativeElement;
  //   // Overflow exists if scrollHeight > offsetHeight
  //   this.hasOverflow = el.scrollHeight > el.offsetHeight;
    
  //   // Manually trigger change detection to avoid 'ExpressionChangedAfterItHasBeenCheckedError'
  //   this.cdr.detectChanges();
  // }
  
  getNotices(){
    this.dashboardService.getNotices()
    .pipe(takeUntil(this.destroySubject))
    .subscribe({
      next: (result: ResponseResult<Notice[]>) => {
        if (result.isSuccess) {
          this.notices = result.responseData!.sort((a, b) => Number(b.isNew) - Number(a.isNew));
          const count = this.notices.filter(x=>x.isNew).length;
          this.newMessageCount.set(count);
        }
      },
      error: (error) => this.onError(error),
    });
  }

  onError(error: any) {
    //handle error
  }
  
}
