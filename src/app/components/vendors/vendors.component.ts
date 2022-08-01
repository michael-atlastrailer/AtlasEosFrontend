import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit {
  @ViewChild('audioTag') private audioTag!: ElementRef

  @ViewChild('orderNotificationTone') private orderNotificationTone!: ElementRef

  constructor(
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,
  ) {}
  ngOnInit(): void {
    this.chatService.getNotification().subscribe((data: any) => {
      this.toaster.success('you have a new message', 'Chat Notification')
      this.audioTag.nativeElement.play()
    })

    this.chatService.getOrderReceived().subscribe((data: any) => {
      this.toaster.success(
        'you have received a new order',
        'Order Notification',
      )

      this.orderNotificationTone.nativeElement.play()
    })
  }
}
