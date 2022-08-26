import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.css'],
})
export class DealersComponent implements OnInit {
  @ViewChild('audioTag') private audioTag!: ElementRef;

  constructor(
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,
    private router: Router
  ) {
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: any) => {
    //     this.PrevRouteService.previousUrl = this.PrevRouteService.currentUrl;
    //     this.PrevRouteService.currentUrl = event.url;
    //   });
  }
  ngOnInit(): void {
    this.chatService.getNotification().subscribe((data: any) => {
      console.log(data);
      this.toaster.success('you have a new message', 'Chat Notification');
      this.audioTag.nativeElement.play();
    });
  }
}
