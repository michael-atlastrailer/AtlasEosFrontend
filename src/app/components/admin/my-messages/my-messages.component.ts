import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ChatService } from 'src/app/core/services/chat.service'
import { io } from 'socket.io-client'
import { ScrollBottomDirective } from 'src/app/core/directives/scroll-bottom.directive'

declare var $: any

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss'],
})
export class MyMessagesComponent implements OnInit {
  tableView = true
  loader = false
  allUsers: any
  selectedUserData: any
  messages: any[] = []
  chats: string[] = []
  msg = ''
  uniqueUserId!: string
  userId!: string
  loggedInUser: any
  vendorCode!: string
  coworkersData: any
  userData: any
  userSelected = false
  coworkerLoader = true
  vendorLoader = true
  chatHistoryLoader = false
  userHasBeenSelected = false
  allDealers: any
  selectedDealerUser: any
  showUnreadMsg = false
  unreadMsgData: any
  adminUserData: any
  allVendors: any
  selectedVendorUsers: any
  vendorUnreadMsg: any
  showVenorUnreadMsg = false
  showDealerUnreadMsg = false
  dealerUnreadMsg: any
  showDropdown = false
  incomingDealerData: any
  noCoworkerFound = false
  dealerLoader = false
  showDealerDropdown = false
  incomingVendorData: any
  showVendorDropdown = false
  noDealerUsersFound = false
  noVendorUsersFound = false
  showSelectedBtn = false
  selectedUserUniqueId = ''
  showTyping = false
  @ViewChild('chatWrapper') private chatWrapper!: ElementRef
  @ViewChild('dummyDealerInput') private dummyDealerInput!: ElementRef
  @ViewChild('dummyVendorInput') private dummyVendorInput!: ElementRef

  @ViewChild('inputVendor') private inputVendor!: ElementRef

  @ViewChild('inputDealer') private inputDealer!: ElementRef

  coworkerMsgCount = 0
  dealerMsgCount = 0
  vendorMsgCount = 0

  constructor(
    private postData: HttpRequestsService,
    private tokeStore: TokenStorageService,
    private chatService: ChatService,
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
    this.getVendorUnreadMsg()
    this.getDealerUnreadMsg()
    this.getAllDamin()
    this.getAllVendors()
    this.getUnreadMsgBasedOnRole()
    setInterval(() => {
      this.getVendorUnreadMsg()
      this.getDealerUnreadMsg()
      this.getUnreadMsgBasedOnRole()
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
          this.coworkerMsgCount = result.data.admin
          this.dealerMsgCount = result.data.dealer
          this.vendorMsgCount = result.data.vendor
        } else {
        }
      })
      .catch((err) => {})
  }

  seeDate() {
    /// console.log(new Date())

    let d = new Date()
    let timer = d.getTime()
  }

  trackKeyPress(event: any) {
    let data = {
      user: this.selectedUserData.id + this.selectedUserData.first_name,
      msg: this.msg,
    }

    this.chatService.sendTypingNotify(data)
  }

  exportChatHistory() {
    $('#chat-export').table2excel({
      exclude: '.noExl',
      name: 'chat-history',
      filename: 'chat-history',
      fileext: '.xlsx',
    })
  }

  toggleVendorDropDown() {
    if (this.showVendorDropdown) {
      this.showVendorDropdown = false
    } else {
      this.showVendorDropdown = true
    }
  }

  toggleDealerDropDown() {
    if (this.showDealerDropdown) {
      this.showDealerDropdown = false
    } else {
      this.showDealerDropdown = true
    }
  }

  applyFilterVendor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingVendorData.vendor_name = filterValue.trim().toLowerCase()
    let filterExpression = '*' + filterValue
    var regex = this.convertWildcardStringToRegExp(filterExpression)
    this.allVendors = this.incomingVendorData.filter(function (item: any) {
      return regex.test(item.vendor_name)
    })
  }

  applyFilterDealer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingDealerData.company_name = filterValue.trim().toLowerCase()
    let filterExpression = '*' + filterValue

    var regex = this.convertWildcardStringToRegExp(filterExpression)
    this.allDealers = this.incomingDealerData.filter(function (item: any) {
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

  getAllSelectedVendorUsers(data: any) {
    this.vendorLoader = true
    this.selectedVendorUsers = []
    this.dummyVendorInput.nativeElement.value = data.vendor_name
    this.inputVendor.nativeElement.value = data.vendor_name

    this.toggleVendorDropDown()
    this.postData
      .httpGetRequest(
        '/dealer/get-selected-company-vendor/' +
          data.vendor_code +
          '/' +
          this.userId,
      )
      .then((result: any) => {
        this.vendorLoader = false
        if (result.status) {
          this.getVendorUnreadMsg()
          this.noVendorUsersFound = result.data.length > 0 ? false : true

          this.selectedVendorUsers = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllVendors() {
    this.postData
      .httpGetRequest('/dealer/get-vendors')
      .then((result: any) => {
        this.vendorLoader = false
        if (result.status) {
          this.allVendors = result.data
          this.incomingVendorData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllDamin() {
    this.postData
      .httpGetRequest('/get-all-admin-users/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.coworkerLoader = false

          this.noCoworkerFound = result.data.length > 0 ? false : true
          this.adminUserData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getDealerUnreadMsg() {
    this.postData
      .httpGetRequest('/admin/get-dealer-unread-msg/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.showDealerUnreadMsg = result.data.length > 0 ? true : false

          this.dealerUnreadMsg = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getVendorUnreadMsg() {
    this.postData
      .httpGetRequest('/admin/get-vendor-unread-msg/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.showVenorUnreadMsg = result.data.length > 0 ? true : false

          this.vendorUnreadMsg = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllSelectedDealerUsers(data: any) {
    this.toggleDealerDropDown()
    this.dealerLoader = true
    this.selectedDealerUser = []
    this.dummyDealerInput.nativeElement.value = data.company_name
    this.inputDealer.nativeElement.value = data.company_name

    this.postData
      .httpGetRequest(
        '/vendor/get-selected-company-dealers/' +
          data.account_id +
          '/' +
          this.userId,
      )
      .then((result: any) => {
        this.dealerLoader = false
        if (result.status) {
          this.getVendorUnreadMsg()

          this.selectedDealerUser = result.data
          this.noDealerUsersFound = result.data.length > 0 ? false : true
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

  getUserChat() {
    this.postData
      .httpGetRequest(
        '/get-user-chat/' + this.userId + '/' + this.selectedUserData.id,
      )
      .then((result: any) => {
        console.log(result)
        this.chatHistoryLoader = false
        this.showSelectedBtn = true
        this.getVendorAsync()
        this.getDealerUnreadMsg()
        this.getVendorUnreadMsg()

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
    this.selectedUserUniqueId = data.id + data.first_name

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
          this.coworkersData = result.data
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
