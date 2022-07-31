import { Injectable } from '@angular/core'
import { io } from 'socket.io-client'
import { Observable } from 'rxjs'
import { TokenStorageService } from './token-storage.service'
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = 'http://localhost:3000'
  //// private url = 'https://atlas-chat-server.glitch.me'
  /// private url = 'https://gainful-ten-utahraptor.glitch.me'
  private socket: any
  userData: any

  constructor(
    private tokenStorage: TokenStorageService,
    private toaster: ToastrService,
  ) {
    this.connectToSocketIo()
    this.userData = this.tokenStorage.getUser()
  }

  connectToSocketIo() {
    let socketUrl
    this.socket = io(this.url)
    this.socket.on('connect', () => {
      socketUrl = this.socket.id
      this.tokenStorage.storeSocketId(socketUrl)
    })
  }

  openChatConnection(user: string) {
    this.socket.emit('connected', user)
  }

  sendTypingNotify(data: any) {
    this.socket.emit('typing-msg', {
      user: data.user,
    })
  }

  sendMsgEvent(data: any) {
    this.socket.emit('send-msg', {
      user: data.user,
      msg: data.msg,
      sender: data.sender,
      time_ago: data.time_ago,
    })
  }

  sendMessage(message: string) {
    this.socket.emit('new-message', message)
  }

  getTestMsg = () => {
    return Observable.create((observer: any) => {
      this.socket.on('data', (message: any) => {
        console.log(message)
        observer.next(message)
      })
    })
  }

  sendOrderNotification(data: any) {
    for (let g = 0; g < data.length; g++) {
      const cur = data[g]
      this.socket.emit('send-order-notification', {
        user: cur,
        sender: this.userData.id + this.userData.first_name,
      })
    }
  }

  getOrderReceived = () => {
    return Observable.create((observer: any) => {
      this.socket.on('vendor-recevied', (message: any) => {
        observer.next(message)
      })
    })
  }

  getNotification() {
    return Observable.create((observer: any) => {
      this.socket.on('notification', (data: any) => {
        console.log(data)
        observer.next(data)
      })
    })

    this.socket.on('notification', (data: any) => {
      this.toaster.success('you have a new message', 'Chat Notification')
      console.log(data)
      //observer.next(message)
    })
  }

  getTyping = () => {
    return Observable.create((observer: any) => {
      this.socket.on('typing', (message: any) => {
        observer.next(message)
      })
    })
  }

  getMessages = () => {
    return Observable.create((observer: any) => {
      this.socket.on('msgRec', (message: any) => {
        observer.next(message)
      })
    })
  }
}
