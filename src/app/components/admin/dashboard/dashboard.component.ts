import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loader = true
  tableView = false

  mostSalesVendorData: any
  mostSalesDealerData: any

  totalOrder = 0
  totalDealer = 0
  totalProducts = 0
  totalCatalogue = 0
  totalCardedProduct = 0
  totalServicePart = 0
  recentOrders: any
  totalAmount = 0
  totalVendor = 0
  totalLoggedVendor = 0
  totalLoggedDealer = 0
  totalLoggedAdmin = 0
  timeSeconds = 59
  timeDays = 0
  timeHours: number = 24
  timeMinutes: number = 59
  interval: any

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

  constructor(private getData: HttpRequestsService) {}

  ngOnInit(): void {
    this.getDashboardData()
    this.getProgramCountDown()
  }

  arrangeTimer(data: any) {
    let initalDays = data.days
    let initalHours = data.hours
    let initalMinutes = data.minutes
    let initalSeconds = data.seconds
    this.timeDays = data.days

    if (data.hours > 24) {
      this.timeHours = 24
    } else {
      this.timeHours = data.hours
    }

    if (data.minutes > 59) {
      this.timeMinutes = 59
    } else {
      this.timeMinutes = data.minutes
    }

    if (data.seconds > 59) {
      this.timeSeconds = 59
    } else {
      this.timeSeconds = data.seconds
    }
  }

  startTimer(data: any) {
    let initalDays = data.days
    let initalHours = data.hours
    let initalMinutes = data.minutes
    let initalSeconds = data.seconds
    this.timeDays = data.days

    if (data.hours < 1) {
      this.timeHours = 0
    } else {
      if (data.hours > 24) {
        this.timeHours = 23
      } else {
        this.timeHours = data.hours
      }
    }

    if (data.minutes > 59) {
      this.timeMinutes = 59
    } else {
      this.timeMinutes = data.minutes
    }

    if (data.seconds != 0) {
      if (data.seconds > 59) {
        this.timeSeconds = 59
      } else {
        this.timeSeconds = data.seconds
      }
    } else {
      this.timeSeconds = data.seconds
    }

    this.interval = setInterval(() => {
      if (this.timeSeconds > 0) {
        this.timeSeconds--
      } else {
        if (data.seconds != 0) {
          this.timeSeconds = 59
        }

        if (this.timeMinutes < 1 && this.timeHours != 0) {
          this.timeMinutes = 59
          this.timeHours--
        }

        if (this.timeHours < 1 && this.timeDays != 0) {
          this.timeDays--
          this.timeHours = 23
        }

        if (this.timeMinutes > 0) {
          this.timeMinutes--
        }
      }

      if (
        this.timeSeconds == 0 &&
        this.timeMinutes == 0 &&
        this.timeHours == 0 &&
        this.timeDays == 0
      ) {
        this.pauseTimer()
      }

      let stringSeconds = this.timeSeconds
      let conventerStringSeconds = stringSeconds.toString()
      console.log(conventerStringSeconds.length)
      if (conventerStringSeconds.length == 1) {
        this.showSecondsExtrazero = true
      } else {
        this.showSecondsExtrazero = false
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval)
  }

  stopCountdownTimer() {
    clearInterval(this.countDownTimer)
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
        $('#days').html('0' + '<span> Days</span>')
        $('#hours').html('00' + '<span> Hours</span>')
        $('#minutes').html('00' + '<span> Minutes</span>')
        $('#seconds').html('00' + '<span> Seconds</span>')
      } else {
        $('#days').html(days + '<span> Days</span>')
        $('#hours').html(hours + '<span> Hours</span>')
        $('#minutes').html(minutes + '<span> Minutes</span>')
        $('#seconds').html(seconds + '<span> Seconds</span>')
      }
    }, 1000)
  }

  getProgramCountDown() {
    this.getData
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
      .catch((err) => {
        ///this.loader = false
      })
  }

  getDashboardData() {
    this.getData
      .httpGetRequest('/admin-dashboard')
      .then((result: any) => {
        this.tableView = true

        this.loader = false
        console.log(result)
        if (result.status) {
          this.totalCardedProduct = result.data.total_carded_products
          this.totalServicePart = result.data.total_service_parts
          this.totalProducts = result.data.total_products
          this.totalDealer = result.data.total_dealers
          this.totalCatalogue = result.data.total_catalogue_orders
          this.totalVendor = result.data.total_vendors

          this.totalLoggedVendor = result.data.total_logged_vendors
          this.totalLoggedDealer = result.data.total_logged_dealers
          this.totalLoggedAdmin = result.data.total_logged_admin

          this.totalAmount = result.data.total_amount
          this.totalOrder = result.data.total_item_ordered
          this.recentOrders = result.data.recent_orders
          this.mostSalesVendorData = result.data.most_sales_vendor
          this.mostSalesDealerData = result.data.most_sale_dealer
          //this.allCategoryData = result.data;
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  keepcounting() {}
}
