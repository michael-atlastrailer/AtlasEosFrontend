import {
  Component,
  OnInit,
  DoCheck,
  ElementRef,
  ViewChildren,
} from '@angular/core'
import { ViewChild } from '@angular/core'

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  title: ApexTitleSubtitle
}
declare var $: any
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  promotionalLoader = true
  promotionalData = false
  promotionalStatus = false
  promotionalAds: any
  allCategoryData: any
  public chartOptions: any
  countDownDate = new Date('June 25, 2022 15:37:25').getTime()
  count: any = 34
  countDownElement = <HTMLInputElement>(
    document.getElementById('calc_table_amount')
  )
  pdfSrc =
    'https://atlasbookingprogram.com/assets/2022%20Booking%20Program%20Terms%20&%20Conditions.pdf'
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

  constructor(private getData: HttpRequestsService) {
    this.getAllVendors()
    this.fetchFlyerAlt()
    this.chartOptions = {
      series: [
        {
          name: 'Sales summary',
          data: [30, 1500, 35000],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: '',
      },
      colors: {},
      xaxis: {
        categories: ['Day 1', 'Day 2', 'Day 3'],
      },
      yaxis: {
        categories: [
          '0',
          '5000',
          '10000',
          '15000',
          '20000',
          '25000',
          '30000',
          '35000',
          '40000',
          '45000',
        ],
      },
    }
    this.getProgramCountDown()
  }
  ngOnInit(): void {}

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
        /// this.startCountDownTimer()
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

      // if (endIntilaTime < curTimer) {
      //   this.stopCountdownTimer()
      //   $('#days').html('0' + '<span> </span>')
      //   $('#hours').html('00' + '<span> </span>')
      //   $('#minutes').html('00' + '<span> </span>')
      //   $('#seconds').html('00' + '<span> </span>')
      // } else {
      //   $('#days').html(days + '<span> </span>')
      //   $('#hours').html(hours + '<span> </span>')
      //   $('#minutes').html(minutes + '<span> </span>')
      //   $('#seconds').html(seconds + '<span> </span>')
      // }
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

  getAllVendors() {
    this.getData
      .httpGetRequest('/promotional_fliers/vendors')
      .then((result: any) => {
        console.log(result)
        if (result.status) {
          this.allCategoryData = result.data
        } else {
        }
      })
      .catch((err) => {})
  }
  fetchFlyer(data: any) {
    console.log(data.target.value)
    this.promotionalLoader = true
    this.promotionalData = false
    this.promotionalStatus = false

    let id = data.target.value
    console.log(id, 'id')
    this.getData
      .httpGetRequest('/show-promotional-flier-by-id/' + id)
      .then((result: any) => {
        console.log(result, 'promotion')

        this.promotionalLoader = false
        if (result.status) {
          // this.promotionalData = result.data.length > 0 ? true : false;
          // this.promotionalStatus = result.data.length <= 0 ? true : false;
          this.promotionalAds = result.data
          this.promotionalData = true
        } else {
        }
      })
      .catch((err) => {
        this.promotionalLoader = false
        this.promotionalData = true
      })
  }
  fetchFlyerAlt() {
    ///console.log(data.target.value);
    this.promotionalLoader = true
    this.promotionalData = false
    this.promotionalStatus = false

    let id = 1
    console.log(id, 'id')
    this.getData
      .httpGetRequest('/show-promotional-flier-by-id/' + id)
      .then((result: any) => {
        console.log(result, 'promotion')

        this.promotionalLoader = false
        if (result.status) {
          // this.promotionalData = result.data.length > 0 ? true : false;
          // this.promotionalStatus = result.data.length <= 0 ? true : false;
          this.promotionalAds = result.data
          this.promotionalData = true
        } else {
        }
      })
      .catch((err) => {
        this.promotionalLoader = false
        this.promotionalData = true
      })
  }
}
