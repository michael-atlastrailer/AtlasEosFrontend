import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.scss'],
})
export class SalesSummaryComponent implements OnInit {
  tableView = true
  loader = false
  userData: any
  privilegedVendors: any
  selectedVendorName!: string
  selectedVendorCode!: string
  vendorProductData: any
  incomingData: any
  sn = 0
  selectedState = false

  noDataFound = false
  totalAmount: number = 0
  showSelectOption = true

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
  ) {
    this.userData = tokenData.getUser()
    ////this.getPrivilegedVendors()

    if (this.userData.privileged_vendors) {
      this.getPrivilegedVendors()
      this.showSelectOption = true
    } else {
      this.selectedVendorCode = this.userData.vendor_code
      this.getSingleVendorSummary()
      //console.log('no vendor')
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
    }
  }

  ngOnInit(): void {}

  getSingleVendorSummary() {
    if (this.selectedVendorCode) {
      // this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-sales-by-item-summary/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          console.log(result)
          if (result.status) {
            this.totalAmount = 0

            this.tableView = true
            this.incomingData = result.data
            this.noDataFound = result.data.length > 0 ? false : true
            if (result.data.length > 0) {
              for (let index = 0; index < result.data.length; index++) {
                const each = result.data[index]
                this.totalAmount += parseFloat(each.total)
              }
            }
          } else {
          }
        })
        .catch((err) => {})
    }
  }

  getSalesSummary() {
    if (this.selectedVendorCode) {
      this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-sales-by-item-summary/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          console.log(result)
          if (result.status) {
            this.totalAmount = 0

            this.tableView = true
            this.incomingData = result.data
            this.noDataFound = result.data.length > 0 ? false : true
            if (result.data.length > 0) {
              for (let index = 0; index < result.data.length; index++) {
                const each = result.data[index]
                this.totalAmount += parseFloat(each.total)
              }
            }
          } else {
          }
        })
        .catch((err) => {})
    }
  }

  selectedVendor(data: any) {
    this.selectedVendorCode = data
    for (let i = 0; i < this.privilegedVendors.length; i++) {
      const element = this.privilegedVendors[i]
      if (element.vendor_code == data) {
        this.selectedVendorName = element.vendor_name
      }
    }
  }

  getPrivilegedVendors() {
    this.httpServer
      .httpGetRequest(
        '/vendor/get-privileged-vendors/' +
          this.userData.id +
          '/' +
          this.userData.vendor_code,
      )
      .then((result: any) => {
        console.log(result)
        if (result.status) {
          this.privilegedVendors = result.data
        } else {
        }
      })
      .catch((err) => {})
  }
}
