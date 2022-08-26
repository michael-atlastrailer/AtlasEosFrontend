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
  @ViewChild('audioTag') private audioTag!: ElementRef

  currentTimeDate = ''

  constructor(
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,

    private router: Router,
    private postData: HttpRequestsService,
  ) {}
  ngOnInit(): void {
    this.chatService.getNotification().subscribe((data: any) => {
      console.log(data)
      this.toaster.success('you have a new message', 'Chat Notification')
      this.audioTag.nativeElement.play()
    })

    var today = new Date()
    var date =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    var dateTime = date + ' ' + time

    this.currentTimeDate = dateTime

    this.checkProgramState()

    setInterval(() => {
      this.checkProgramState()
    }, 10000)
  }

  checkProgramState() {
    let data = {
      timer: this.currentTimeDate,
    }

    this.postData
      .httpPostRequest('/dealer/check-program-state', data)
      .then((result: any) => {
        if (result.status) {
          this.tokeStore.signOut()
          this.router.navigate(['/'])
          this.toaster.error(`${result.message}`, 'Info')
        } else {
        }
      })
      .catch((err) => {})
  }
}
