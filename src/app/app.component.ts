import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'
declare var $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'atlas-eos'
  userData: any
  resizedStatus = false
  @ViewChild('langcheck') langlang!: ElementRef
  constructor(
    private tokenStorage: TokenStorageService,
    private chatServer: ChatService,
  ) {
    this.setLang()
    let userData = this.tokenStorage.getUser()
    let role = userData.role
    // this.userId = userData.id
    if (userData) {
      this.chatServer.openChatConnection(userData.id + userData.first_name)
    }
  }
  setLang() {
    setInterval(() => {
      console.log('resixehappend', $('#langcheck').width())
      if ($('#langcheck').width() > 220) {
        localStorage.setItem('lang', 'fr')
      } else {
        localStorage.setItem('lang', 'en')
      }
    }, 2000)
  }
  shad() {
    setInterval(() => {
      console.log(
        'lang jquery',
        $('#langcheck').html(),
        this.langlang.nativeElement,
      )
      let elem = this.langlang.nativeElement.innerText
      console.log('lang =', elem, elem == 'catch', $('#langcheck').innerText)
      if (elem == 'catch') {
        //     console.log('lang =', 'true');
        localStorage.setItem('lang', 'en')
      } else {
        //console.log('lang =', 'false');
        localStorage.setItem('lang', 'fr')
      }
    }, 1000)
  }
}
