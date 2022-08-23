import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { Router } from '@angular/router'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ChatService } from 'src/app/core/services/chat.service'

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent implements OnInit {
  @ViewChild('overlay') overlay!: ElementRef
  adminData: any
  unreadMsgCount = 0
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private getData: HttpRequestsService,
    private chatService: ChatService,
  ) {}
  ngOnInit(): void {
    const query = window.matchMedia('(max-width: 700px)')
    this.adminData = this.tokenStorage.getUser()
    this.getUnreadMsg()

    setInterval(() => {
      this.getUnreadMsg()
    }, 10000)

    this.chatService.getNotification().subscribe((data: any) => {
        this.getUnreadMsg()
    })
  }

  getUnreadMsg() {
    this.getData
      .httpGetRequest('/chat/count-unread-msg/' + this.adminData.id)
      .then((result: any) => {
        if (result.status) {
          this.unreadMsgCount = result.data
        }
      })
      .catch((err) => {})
  }

  closeOverLay() {
    const query = window.matchMedia('(max-width: 700px)')
    if (query.matches) {
      this.overlay.nativeElement.click()
    }
  }

  logout() {
    this.tokenStorage.signOut()
    return this.router.navigate(['/'])
  }
}
