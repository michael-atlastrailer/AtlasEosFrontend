import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import Swal from 'sweetalert2'

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

  mostSalesDealerLoader = true
  mostSalesDealerTableView = false

  MostSalesVendorLoader = true
  MostSalesVendorTableView = false
  deactivateVendorLoader = false
  deactivateDealerLoader = false
  deactivateVendorText = true
  deactivateDealerText = true

  deactivateDealerBtnStatus = true
  deactivateVendorBtnStatus = true

  activateVendorBtnStatus = true
  activateDealerBtnStatus = true

  showActivateVendorBtn = false
  showActivateDealerBtn = false

  constructor(
    private getData: HttpRequestsService,
    private toatsr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getProgramCountDown()
    this.getMostSalesDealer()
    this.getMostSalesVendor()
    this.getallAnalysis()
    this.getUsersStatus()
  }

  async confirmBox(msg: string) {
    return await Swal.fire({
      title: msg,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        return true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false
      } else {
        return false
      }
    })
  }

  async activateAllDealer() {
    let confirm = await this.confirmBox('You are about to activate all dealers')

    if (confirm) {
      this.activateDealerBtnStatus = false
      this.getData
        .httpGetRequest('/admin/activate-dealers')
        .then((result: any) => {
          this.activateDealerBtnStatus = true
          if (result.status) {
            this.showActivateDealerBtn = false
          }
          this.toatsr.success(result.message, 'success')
        })
        .catch((err) => {
          this.activateDealerBtnStatus = true
        })
    }
  }

  async activateAllVendors() {
    let confirm = await this.confirmBox('You are about to activate all vendors')

    if (confirm) {
      this.activateVendorBtnStatus = false
      this.getData
        .httpGetRequest('/admin/activate-vendors')
        .then((result: any) => {
          this.activateVendorBtnStatus = true
          if (result.status) {
            this.showActivateVendorBtn = false
          }
          this.toatsr.success(result.message, 'success')
        })
        .catch((err) => {
          this.activateVendorBtnStatus = true
        })
    }
  }

  getUsersStatus() {
    this.getData
      .httpGetRequest('/admin/get-all-users-status')
      .then((result: any) => {
        //this.mostSalesDealerLoader = false
        /// this.mostSalesDealerTableView = true
        if (result.status) {
          for (let index = 0; index < result.data.length; index++) {
            const userStatus = result.data[index]

            if (userStatus.role == '3' && userStatus.status == 1) {
              this.showActivateVendorBtn = true
            } else {
              this.showActivateVendorBtn = false
            }

            if (userStatus.role == '4' && userStatus.status == 1) {
              this.showActivateDealerBtn = true
            } else {
              this.showActivateDealerBtn = false
            }
          }
          ///  this.mostSalesDealerData = result.data
        } else {
        }
      })
      .catch((err) => {
        /// this.mostSalesDealerLoader = false
        ///this.mostSalesDealerTableView = true
      })
  }

  async deactivateAllDealers() {
    let confirm = await this.confirmBox(
      'You are about to deactivate all dealers',
    )

    if (confirm) {
      this.deactivateDealerBtnStatus = false
      this.getData
        .httpGetRequest('/admin/deactivate-dealers')
        .then((result: any) => {
          this.deactivateDealerBtnStatus = true
          if (result.status) {
            this.showActivateDealerBtn = true
          }
          this.toatsr.success(result.message, 'success')
        })
        .catch((err) => {
          this.deactivateDealerBtnStatus = true
        })
    }
  }

  async deactivateAllVendors() {
    let confirm = await this.confirmBox(
      'You are about to deactivate all vendors',
    )

    if (confirm) {
      this.deactivateVendorBtnStatus = false
      this.getData
        .httpGetRequest('/admin/deactivate-vendors')
        .then((result: any) => {
          this.deactivateVendorBtnStatus = true
          if (result.status) {
            this.showActivateVendorBtn = true
          }
          this.toatsr.success(result.message, 'success')
        })
        .catch((err) => {
          this.deactivateVendorBtnStatus = true
        })
    }
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
        $('#days').html('0')
        $('#hours').html('00')
        $('#minutes').html('00')
        $('#seconds').html('00')
      } else {
        $('#days').html(days)
        $('#hours').html(hours)
        $('#minutes').html(minutes)
        $('#seconds').html(seconds)
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

  getMostSalesDealer() {
    this.getData
      .httpGetRequest('/admin/most-sales-dealers-admin-dashboard')
      .then((result: any) => {
        this.mostSalesDealerLoader = false
        this.mostSalesDealerTableView = true
        if (result.status) {
          this.mostSalesDealerData = result.data
        } else {
        }
      })
      .catch((err) => {
        this.mostSalesDealerLoader = false
        this.mostSalesDealerTableView = true
      })
  }

  getMostSalesVendor() {
    this.getData
      .httpGetRequest('/admin/most-sales-vendor-admin-dashboard')
      .then((result: any) => {
        this.MostSalesVendorLoader = false
        this.MostSalesVendorTableView = true
        if (result.status) {
          this.mostSalesVendorData = result.data
        } else {
        }
      })
      .catch((err) => {
        this.MostSalesVendorLoader = false
        this.MostSalesVendorTableView = true
      })
  }

  getallAnalysis() {
    this.getData
      .httpGetRequest('/admin/analysis-admin-dashboard')
      .then((result: any) => {
        this.loader = false
        this.tableView = true
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
          ///  this.mostSalesVendorData = result.data.most_sales_vendor
          ///  this.mostSalesDealerData = result.data.most_sale_dealer
          //this.allCategoryData = result.data;
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
        this.tableView = true
      })
  }

  keepcounting() {}
}
