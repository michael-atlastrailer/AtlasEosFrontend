import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ChatService } from 'src/app/core/services/chat.service'
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-vendor-navbar',
  templateUrl: './vendor-navbar.component.html',
  styleUrls: ['./vendor-navbar.component.scss'],
})
export class VendorNavbarComponent implements OnInit {
  @ViewChild('overlay') overlay!: ElementRef
  vendorData: any
  adminData: any
  vendorName = ''
  unreadMsgCount = 0
  vendorCode = ''
  userId = ''
  notifyData: any
  bellCounter = 0
  activeColor = false
  menuStatus = false
  noNewOrderNotify = false

  switchStateLink = false
  userData: any

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private getData: HttpRequestsService,
    private chatService: ChatService,
  ) {
    let currentUrl = this.router.url
    if (
      currentUrl.includes('vendors/view-dealer-purchasers-summary') ||
      currentUrl.includes('vendors/view-dealer-summary/')
    ) {
      this.activeColor = true
    } else {
      this.activeColor = false
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        let url = event.url
        if (
          url.includes('vendors/view-dealer-purchasers-summary') ||
          url.includes('vendors/view-dealer-summary/')
        ) {
          this.activeColor = true
        } else {
          this.activeColor = false
        }
      })
  }
  ngOnInit(): void {
    const query = window.matchMedia('(max-width: 700px)')
    this.vendorData = this.tokenStorage.getUser()
    this.vendorCode = this.vendorData.full_name
    this.userId = this.vendorData.id

    this.getUnreadMsg()

    this.chatService.getNotification().subscribe((data: any) => {
      this.getUnreadMsg()
      setTimeout(() => {
        this.getUnreadMsg()
      }, 1000)
    })

    this.getVendorOrderBellNotify()

    setInterval(() => {
      // this.getUnreadMsg()
      this.getVendorOrderBellNotify()
    }, 10000)

    this.userData = this.tokenStorage.getUser()
    let switchState = this.userData.switch_state

    if (switchState == 1) {
      this.switchStateLink = true
    } else {
      this.switchStateLink = false
    }
  }

  goToPurchasers() {
    this.router.navigate(['/vendors/purchases-by-dealer'])
  }

  showMenu() {
    /// this.bellNotify.nativeElement.click()
    this.menuStatus = true
  }

  hideMenu() {
    this.menuStatus = false

    /// this.bellNotify.nativeElement.click()
  }
  getVendorOrderBellNotify() {
    this.getData
      .httpGetRequest('/vendor/get-vendor-order-bell-count/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.notifyData = result.data.notify
          this.bellCounter = result.data.count
          this.noNewOrderNotify = this.bellCounter == 0 ? true : false
        }
      })
      .catch((err) => {})
  }

  getUnreadMsg() {
    this.getData
      .httpGetRequest('/chat/count-unread-msg/' + this.vendorData.id)
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
