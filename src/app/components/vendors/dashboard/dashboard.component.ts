import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loader = true
  tableView = false
  mostPurchasers: any
  totalOrder = 0
  totalSales = 0
  userData: any
  orderReceived = 0
  selectedVendorCode = ''
  constructor(
    private getData: HttpRequestsService,
    private tokenStore: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()

    console.log(this.userData.vendor_code, 'testing vendor')

    ///this.getPrivilegedVendors()
    if (this.userData.privileged_vendors) {
      ///this.getPrivilegedVendors()
      ///this.showSelectOption = true
      this.getDashboardAnalysisData()
      this.getDashboardMostPurchaserData()
    } else {
      this.selectedVendorCode = this.userData.vendor_code

      this.getSingleDashboardAnalysisData()
      this.getSingleDashboardMostPurchaserData()

      ///this.selectedVendorName = this.userData.company_name
      ////this.showSelectOption = false
    }
  }

  getSingleDashboardMostPurchaserData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-single-dashboard-most-purchaser/' +
          this.userData.vendor_code,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.mostPurchasers = result.data
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getSingleDashboardAnalysisData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-single-dashboard-analysis/' + this.userData.vendor_code,
      )
      .then((result: any) => {
        if (result.status) {
          this.totalSales = result.data.total_sales
          this.orderReceived = result.data.total_orders
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getDashboardMostPurchaserData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-single-dashboard-most-purchaser/' +
          this.userData.vendor_code,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.mostPurchasers = result.data
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getDashboardAnalysisData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-dashboard-analysis/' +
          this.userData.vendor_code +
          '/' +
          this.userData.id,
      )
      .then((result: any) => {
        if (result.status) {
          this.totalSales = result.data.total_sales
          this.orderReceived = result.data.total_orders
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }
}
