import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

import { ChatService } from 'src/app/core/services/chat.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'

declare var $: any

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit {
  @ViewChild('audioTag') private audioTag!: ElementRef

  @ViewChild('orderNotificationTone') private orderNotificationTone!: ElementRef

  firstName = ''
  lastName = ''
  fullName = ''

  checkerInterval: any
  startCounterChecker: any
  countDownTimer: any

  countDownData: any

  initalDays: number = 0
  initalHours: number = 0
  initalMinutes: number = 0
  initalSeconds: number = 0

  showSecondsExtrazero = false

  testStartTimer!: number
  testStopTimer!: number
  testTimeLeft!: number
  starterTimerTimestamp!: number
  endTimer = ''
  endTimerStamp!: number
  initalEndTime: any
  initalStartTime: any

  vendorData: any

  constructor(
    private chatService: ChatService,
    private tokeStore: TokenStorageService,
    private toaster: ToastrService,
    private getHttpData: HttpRequestsService,
  ) {}

  ngOnInit(): void {
    this.vendorData = this.tokeStore.getUser()
    this.fullName = this.vendorData.full_name
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

    this.getProgramCountDown()
  }

  startCheckerFund() {
    this.checkerInterval = setInterval(() => {
      let dd = new Date()
      let currentTime = dd.getTime()
      let dateInstance = new Date(this.initalStartTime)
      let intialStartTimer = dateInstance.getTime()

      if (currentTime >= intialStartTimer) {
        this.stopCounterChecker()
        this.startCountDownTimer()
      } else {
      }
    }, 1000)
  }

  stopCounterChecker() {
    clearInterval(this.checkerInterval)
  }

  stopCountdownTimer() {
    clearInterval(this.countDownTimer)
  }

  startCountDownTimer() {
    this.countDownTimer = setInterval(() => {
      let dd: any = new Date()
      let curTimer = dd.getTime()
      let createDate = new Date(this.initalEndTime)
      let endIntilaTime = createDate.getTime()

      // console.log(curTimer)

      let endTime = Date.parse(this.endTimer) / 1000
      let now: any = new Date()
      now = Date.parse(now) / 1000

      var timeLeft = endTime - now

      var days: any = Math.floor(timeLeft / 86400)
      var hours: any = Math.floor((timeLeft - days * 86400) / 3600)
      var minutes: any = Math.floor(
        (timeLeft - days * 86400 - hours * 3600) / 60,
      )
      var seconds: any = Math.floor(
        timeLeft - days * 86400 - hours * 3600 - minutes * 60,
      )

      if (hours < '10') {
        hours = '0' + hours
      }
      if (minutes < '10') {
        minutes = '0' + minutes
      }
      if (seconds < '10') {
        seconds = '0' + seconds
      }

      if (endIntilaTime < curTimer) {
        this.stopCountdownTimer()
        $('#days').html('0' + '<span> </span>')
        $('#hours').html('00' + '<span> </span>')
        $('#minutes').html('00' + '<span> </span>')
        $('#seconds').html('00' + '<span> </span>')
      } else {
        $('#days').html(days + '<span> </span>')
        $('#hours').html(hours + '<span> </span>')
        $('#minutes').html(minutes + '<span> </span>')
        $('#seconds').html(seconds + '<span> </span>')
      }
    }, 1000)
  }

  getProgramCountDown() {
    this.getHttpData
      .httpGetRequest('/get-countdown')
      .then((result: any) => {
        if (result.status) {
          this.countDownData = result.data
          this.endTimer = result.data.inital_end_timer
          this.initalEndTime = result.data.inital_end_timer
          this.initalStartTime = result.data.real_start_timer
          console.log(this.initalStartTime)
          // let dd = new Date(this.endTimer)
          // let fp = dd.getTime()
          // console.log(fp, 'seconse')
          // console.log(dd, 'fulll data nd time')
          // console.log(new Date().getTime())
          ////this.startTimeMe = result.

          this.endTimerStamp = result.data.end_timer_timestamp
          this.starterTimerTimestamp = result.data.start_timer_timestamp

          this.startCheckerFund()
        } else {
        }
      })
      .catch((err: any) => {
        ///this.loader = false
      })
  }
}
