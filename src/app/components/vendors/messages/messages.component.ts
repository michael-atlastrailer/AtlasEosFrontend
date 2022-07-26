import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  allUsers: any
  selectedUserData: any
  messages: any[] = []
  loggedInUser: any

  msg = ''
  uniqueUserId!: string
  userId!: string
  vendorCode!: string
  coworkersData: any
  userData: any
  userSelected = false
  coworkerLoader = true
  chatHistoryLoader = false
  userHasBeenSelected = false
  allDealers: any
  selectedDealerUser: any
  showUnreadMsg = false
  unreadMsgData: any
  adminUserData: any
  noCoworkerFound = false
  incomingDealerData: any
  showDropdown = false
  noDealerUsersFound = false
  showTyping = false

  adminMsgCount = 0
  dealerMsgCount = 0
  vendorMsgCount = 0

  @ViewChild('chatWrapper') private chatWrapper!: ElementRef
  @ViewChild('audioTag') private audioTag!: ElementRef
  @ViewChild('dummyInput') dummyInput!: ElementRef

  constructor(
    private postData: HttpRequestsService,
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,
  ) {}
  ngOnInit(): void {
    this.getAllDealers()
    this.chatService.getMessages().subscribe((message: string) => {
      if (message != '') {
        this.startCounter()
        this.getUnreadMsgBasedOnRole()
        setTimeout(() => {
          this.scrollToElement()
        }, 80)
      }

      if (this.userHasBeenSelected) {
        this.getMsgAsync()
      }

      this.messages.push(message)
    })

    this.chatService.getTyping().subscribe((message: string) => {
      if (message != '') {
        this.showTyping = true

        setTimeout(() => {
          this.showTyping = false
        }, 3380)
      }
    })

    this.loggedInUser = this.tokeStore.getUser()
    let user = this.tokeStore.getUser()
    this.userData = this.tokeStore.getUser()

    this.userId = user.id
    let userId = user.id + user.first_name
    this.uniqueUserId = userId
    this.vendorCode = user.vendor_code

    this.getVendorCoworkers()

    this.chatService.openChatConnection(userId)
    this.getUnreadMsg()
    this.getAllDamin()
    this.getUnreadMsgBasedOnRole()

    setInterval(() => {
      this.getUnreadMsg()
      this.getUnreadMsgBasedOnRole()
      this.getAllDamin()
    }, 10000)
  }

  startCounter() {
    setInterval(() => {
      this.getUserChatAsync()
    }, 10000)
  }

  getUnreadMsgBasedOnRole() {
    this.postData
      .httpGetRequest('/chat/count-unread-msg-role/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.adminMsgCount = result.data.admin
          this.dealerMsgCount = result.data.dealer
          this.vendorMsgCount = result.data.vendor
        } else {
        }
      })
      .catch((err) => {})
  }

  getUserChatAsync() {
    this.postData
      .httpGetRequest(
        '/get-user-chat/' + this.userId + '/' + this.selectedUserData.id,
      )
      .then((result: any) => {
        if (result.status) {
          if (result.data.length > 0) {
            this.messages = result.data
          }
        } else {
        }
      })
      .catch((err) => {})
  }

  trackKeyPress(event: any) {
    let data = {
      user: this.selectedUserData.id + this.selectedUserData.first_name,
      msg: this.msg,
    }

    this.chatService.sendTypingNotify(data)
  }

  toggleVendors() {
    if (this.showDropdown) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingDealerData.company_name = filterValue.trim().toLowerCase()
    this.allDealers = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    return this.incomingDealerData.filter(function (item: any) {
      return regex.test(item.company_name)
    })
  }

  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  convertWildcardStringToRegExp(expression: string) {
    var terms = expression.split('*')

    var trailingWildcard = false

    var expr = ''
    for (var i = 0; i < terms.length; i++) {
      if (terms[i]) {
        if (i > 0 && terms[i - 1]) {
          expr += '.*'
        }
        trailingWildcard = false
        expr += this.escapeRegExp(terms[i])
      } else {
        trailingWildcard = true
        expr += '.*'
      }
    }

    if (!trailingWildcard) {
      expr += '.*'
    }

    return new RegExp('^' + expr + '$', 'i')
  }

  getAllDamin() {
    this.postData
      .httpGetRequest('/get-all-admin-users/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.adminUserData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getUnreadMsg() {
    // this.selectedDealerUser = []
    this.postData
      .httpGetRequest('/vendor/get-vendor-unread-msg/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.showUnreadMsg = result.data.length > 0 ? true : false

          this.unreadMsgData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllSelectedDealerUsers(data: any) {
    if (this.showDropdown) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
    }
    this.dummyInput.nativeElement.value = data.company_name

    this.coworkerLoader = true
    this.selectedDealerUser = []
    this.postData
      .httpGetRequest(
        '/vendor/get-selected-company-dealers/' +
          data.account_id +
          '/' +
          this.userId,
      )
      .then((result: any) => {
        this.coworkerLoader = false
        if (result.status) {
          this.getUnreadMsg()

          this.selectedDealerUser = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllDealers() {
    this.postData
      .httpGetRequest('/vendor/get-dealers')
      .then((result: any) => {
        if (result.status) {
          this.allDealers = result.data
          this.incomingDealerData = result.data
          this.noDealerUsersFound = result.data.length > 0 ? false : true
        } else {
        }
      })
      .catch((err) => {})
  }

  bellNotification() {}

  scrollToElement(): void {
    this.chatWrapper.nativeElement.scroll({
      top: this.chatWrapper.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }

  sendMsg() {
    if (this.msg != '') {
      this.startCounter()
      let data = {
        user: this.selectedUserData.id + this.selectedUserData.first_name,
        msg: this.msg,
        sender: this.userData.id + this.userData.first_name,
        time_ago: 'just now',
      }

      this.storeChatDatabase()
      this.messages.push(data)
      this.chatService.sendMsgEvent(data)
      setTimeout(() => {
        this.scrollToElement()
      }, 80)
      this.msg = ''
    }
  }

  getUserChat() {
    this.postData
      .httpGetRequest(
        '/get-user-chat/' + this.userId + '/' + this.selectedUserData.id,
      )
      .then((result: any) => {
        console.log(result)
        this.chatHistoryLoader = false
        this.getVendorAsync()

        if (result.status) {
          if (result.data.length > 0) {
            this.messages = result.data
            setTimeout(() => {
              this.scrollToElement()
            }, 100)
          }
        } else {
        }
      })
      .catch((err) => {})
  }

  storeChatDatabase() {
    let data = {
      chatFrom: this.userId,
      chatTo: this.selectedUserData.id,
      msg: this.msg,
      role: this.userData.role,
      chatUser: this.selectedUserData.id + this.selectedUserData.first_name,
      uniqueId:
        this.userData.id +
        this.userData.first_name +
        this.selectedUserData.id +
        this.selectedUserData.first_name,
    }

    this.postData
      .httpPostRequest('/store-chat', data)
      .then((result: any) => {
        console.log(result)
        if (result.status) {
          //  this.toastr.success(result.message, `Successful`)
        } else {
          ////this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {})
  }

  selectedUser(data: any) {
    this.selectedUserData = data
    this.userSelected = true
    this.chatHistoryLoader = true
    this.userHasBeenSelected = true
    this.messages = []
    this.getUserChat()
  }

  generateSocketId() {
    let data = {
      id: this.selectedUserData.id,
      chatId: this.selectedUserData.chat_id,
    }
  }

  getVendorCoworkers() {
    this.postData
      .httpGetRequest(
        '/vendor/get-vendor-coworkers/' + this.vendorCode + '/' + this.userId,
      )
      .then((result: any) => {
        if (result.status) {
          this.coworkerLoader = false
          this.coworkersData = result.data
          this.noCoworkerFound = result.data.length > 0 ? false : true
        } else {
        }
      })
      .catch((err) => {})
  }

  getMsgAsync() {
    this.postData
      .httpGetRequest(
        '/get-user-chat/' + this.userId + '/' + this.selectedUserData.id,
      )
      .then((result: any) => {
        this.chatHistoryLoader = false
        this.getVendorAsync()
      })
      .catch((err) => {})
  }

  getVendorAsync() {
    this.postData
      .httpGetRequest(
        '/vendor/get-vendor-coworkers/' + this.vendorCode + '/' + this.userId,
      )
      .then((result: any) => {
        if (result.status) {
          this.coworkersData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }
}
