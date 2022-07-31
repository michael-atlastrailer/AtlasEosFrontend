import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'atlas-eos'
  userData: any

  constructor(
    private tokenStorage: TokenStorageService,
    private chatServer: ChatService,
  ) {
    let userData = this.tokenStorage.getUser()
    let role = userData.role
    // this.userId = userData.id
    if (userData) {
      this.chatServer.openChatConnection(userData.id + userData.first_name)
    }
  }
}
