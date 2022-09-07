import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'

declare var $: any

@Component({
  selector: 'app-sales-detailed',
  templateUrl: './sales-detailed.component.html',
  styleUrls: ['./sales-detailed.component.scss'],
})
export class SalesDetailedComponent implements OnInit {
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
  showDownload = false
  allVendorData: any

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
  ) {
    this.userData = tokenData.getUser()
    /// this.getPrivilegedVendors()

    if (this.userData.privileged_vendors != null) {
      let privilegeVenArray = this.userData.privileged_vendors.split(',')
      if (privilegeVenArray[1] != '') {
        this.getPrivilegedVendors()
        this.showSelectOption = true
      } else {
        this.selectedVendorName = this.userData.company_name
        this.showSelectOption = false
        this.selectedVendorCode = privilegeVenArray[0]
        this.getSingleVendorSalesDetailed()
        this.getAllVendors()
      }
    } else {
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
      this.selectedVendorCode = this.userData.vendor_code
      this.getSingleVendorSalesDetailed()
    }

    // if (this.userData.privileged_vendors) {
    //   this.getPrivilegedVendors()
    //   this.showSelectOption = true
    // } else {
    //   this.selectedVendorCode = this.userData.vendor_code
    //   this.getSingleVendorSalesDetailed()
    //   //console.log('no vendor')
    //   this.selectedVendorName = this.userData.company_name
    //   this.showSelectOption = false
    // }
  }

  ngOnInit(): void {}

  getAllVendors() {
    this.httpServer
      .httpGetRequest('/get-all-vendors')
      .then((result: any) => {
        if (result.status) {
          this.allVendorData = result.data
          for (let i = 0; i < this.allVendorData.length; i++) {
            const ji = this.allVendorData[i]
            if (ji.vendor_code == this.selectedVendorCode) {
              this.selectedVendorName = ji.vendor_name
            }
          }
        } else {
        }
      })
      .catch((err) => {})
  }

  exportToExcel() {
    let javaDate = new Date()
    let currDate = javaDate.getDate()
    $('#export-sales-detailed').table2excel({
      exclude: '.noExl',
      name: `${currDate}-export-sales-detailed`,
      filename: `${currDate}-export-sales-detailed`,
      fileext: '.xlsx',
    })
  }

  getSingleVendorSalesDetailed() {
    if (this.selectedVendorCode) {
      this.showDownload = true

      this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-sales-by-item-detailed/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          if (result.status) {
            this.tableView = true
            this.incomingData = result.data.res
            this.noDataFound = result.data.res.length > 0 ? false : true
            if (result.data.length > 0) {
              for (let index = 0; index < result.data.res.length; index++) {
                const each = result.data.res[index]
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
      this.showDownload = true

      this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-sales-by-item-detailed/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          if (result.status) {
            this.tableView = true
            this.incomingData = result.data.res
            this.noDataFound = result.data.res.length > 0 ? false : true
            if (result.data.length > 0) {
              for (let index = 0; index < result.data.res.length; index++) {
                const each = result.data.res[index]
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
