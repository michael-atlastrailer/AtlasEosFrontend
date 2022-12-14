import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core'
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

  msg: string = ''
  uniqueUserId!: string
  userId!: string
  dealerCode!: string
  coworkersData: any
  userData: any
  userSelected = false
  coworkerLoader = true
  chatHistoryLoader = false
  userHasBeenSelected = false
  allVendors: any
  unreadMsgData: any
  showUnreadMsg = false
  selectedVendorUser: any
  adminUserData: any
  noVendorUsersFound = false
  noCoworkerFound = false
  vendorUserLoader = false
  adminUserLoader = true
  incomingVendorData: any

  selectedUserUniqueId = ''

  showDropdown = false
  showTyping = false

  @ViewChild('chatWrapper') private chatWrapper!: ElementRef
  @ViewChild('audioTag') private audioTag!: ElementRef
  @ViewChild('dropdownSection') dropdownSection!: ElementRef

  @ViewChild('dummyInput') dummyInput!: ElementRef

  adminMsgCount = 0
  dealerMsgCount = 0
  vendorMsgCount = 0
  InterSetter: any
  userVendorRecentChat: any
  showRecentChatUsers = false

  constructor(
    private postData: HttpRequestsService,
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,
    private render: Renderer2,
  ) {}
  ngOnInit(): void {
    this.getAllVendors()
    this.loggedInUser = this.tokeStore.getUser()
    let user = this.tokeStore.getUser()
    this.userData = this.tokeStore.getUser()

    this.userId = user.id

    let userIdChat = user.id + user.first_name
    this.uniqueUserId = user.id + user.first_name
    this.dealerCode = user.account_id

    this.getVendorCoworkers()
    this.chatService.openChatConnection(userIdChat)

    this.chatService.getNotification().subscribe((data: any) => {
      this.getUnreadMsgBasedOnRole()
      this.getVendorAsync()
      this.getUnreadMsg()
      this.getAllDamin()
    })

    this.chatService.getMessages().subscribe((message: any) => {
      if (message != '') {
        this.startCounter()

        // this.getUserChatAsync()
        // this.InterSetter = setInterval(() => {
        //   this.getUserChatAsync()
        // }, 10000)

        if (this.userHasBeenSelected) {
          setTimeout(() => {
            this.scrollToElement()
          }, 80)
        }
      }
      if (this.userHasBeenSelected) {
        this.getMsgAsync()
      }

      if (this.selectedUserUniqueId == message.sender) {
        this.messages.push(message)
      }
    })

    this.getUnreadMsg()
    this.getAllDamin()
    this.getUnreadMsgBasedOnRole()
    this.getUserRecentChatHistory()

    this.chatService.getTyping().subscribe((message: string) => {
      if (message != '') {
        this.showTyping = true

        setTimeout(() => {
          this.showTyping = false
        }, 3380)
      }
    })
  }

  ngOnDestroy() {
    this.selectedUserData = ''
  }

  getUserRecentChatHistory() {
    this.postData
      .httpGetRequest('/chat/get-chat-history/' + this.userId + '/3')
      .then((result: any) => {
        this.showRecentChatUsers = true
        if (result.status) {
          this.userVendorRecentChat = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  resmoveSelected() {
    this.selectedUserData = ''
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
        '/get-user-chat-async/' + this.selectedUserData.id + '/' + this.userId,
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

  toggleVendors() {
    if (this.showDropdown) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
    }
  }

  trackKeyPress(event: any) {
    if (event.key == 'Enter') {
      this.sendMsg()
      event.preventDefault()
    }
    let data = {
      user: this.selectedUserData.id + this.selectedUserData.first_name,
      msg: this.msg,
    }

    this.chatService.sendTypingNotify(data)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingVendorData.vendor_name = filterValue.trim().toLowerCase()
    this.allVendors = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    return this.incomingVendorData.filter(function (item: any) {
      return regex.test(item.vendor_name)
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
        this.adminUserLoader = false
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
      .httpGetRequest('/dealer/get-dealer-unread-msg/' + this.userId)
      .then((result: any) => {
        if (result.status) {
          this.showUnreadMsg = result.data.length > 0 ? true : false
          this.unreadMsgData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getAllVendors() {
    this.postData
      .httpGetRequest('/dealer/get-vendors')
      .then((result: any) => {
        if (result.status) {
          this.allVendors = result.data
          this.incomingVendorData = result.data
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

    this.dummyInput.nativeElement.value = data.vendor_name

    this.noVendorUsersFound = false
    this.vendorUserLoader = true
    this.selectedVendorUser = []
    this.postData
      .httpGetRequest(
        '/dealer/get-selected-company-vendor/' +
          data.vendor_code +
          '/' +
          this.userId,
      )
      .then((result: any) => {
        this.vendorUserLoader = false
        if (result.status) {
          this.noVendorUsersFound = result.data.length > 0 ? false : true
          this.selectedVendorUser = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  scrollToElement(): void {
    this.chatWrapper.nativeElement.scroll({
      top: this.chatWrapper.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }

  sendMsg() {
    if (this.msg != '') {
      // this.getUserChatAsync()
      // this.InterSetter = setInterval(() => {
      //   this.getUserChatAsync()
      // }, 10000)

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
        '/get-user-chat/' + this.selectedUserData.id + '/' + this.userId,
      )
      .then((result: any) => {
        console.log(result)
        this.chatHistoryLoader = false
        this.getVendorAsync()
        this.getUnreadMsg()
        this.getUnreadMsgBasedOnRole()
        this.getAllDamin()

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
    this.selectedUserUniqueId = data.id + data.first_name

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
        '/dealer/get-dealer-coworkers/' + this.dealerCode + '/' + this.userId,
      )
      .then((result: any) => {
        if (result.status) {
          this.coworkerLoader = false
          this.coworkersData = result.data
          this.noCoworkerFound = result.data.length > 0 ? false : true

          this.allUsers = result.data
        } else {
        }
      })
      .catch((err) => {})
  }

  getMsgAsync() {
    this.postData
      .httpGetRequest(
        '/get-user-chat-async/' + this.selectedUserData.id + '/' + this.userId,
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
        '/dealer/get-dealer-coworkers/' + this.dealerCode + '/' + this.userId,
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
