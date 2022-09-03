import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'
import { ActivatedRoute } from '@angular/router'

declare var $: any

@Component({
  selector: 'app-purchases-dealer',
  templateUrl: './purchases-dealer.component.html',
  styleUrls: ['./purchases-dealer.component.scss'],
})
export class PurchasesDealerComponent implements OnInit {
  tableView = true
  loader = false
  userData: any
  privilegedVendors: any
  selectedVendorName = ''
  selectedVendorCode = ''
  vendorProductData: any
  incomingData: any
  sn = 0
  selectedState = false

  noDataFound = false
  TotalForVendorAmount: number = 0
  showSelectOption = true
  vendor = ''
  hiddenSelectedVendor = ''

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
    private route: ActivatedRoute,
  ) {
    this.userData = tokenData.getUser()
    ///this.getPrivilegedVendors()

    if (this.userData.privileged_vendors != null) {
      let privilegeVenArray = this.userData.privileged_vendors.split(',')
      console.log(privilegeVenArray.length, 'Checking it out')
      if (privilegeVenArray.length > 0) {
        this.getPrivilegedVendors()
        this.showSelectOption = true
      }
    } else {
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
      this.selectedVendorCode = this.userData.vendor_code
      this.getSingleVendorPurchasers()
    }

    // let privilegeVenArray = this.userData.privileged_vendors.split(',')
    // console.log(privilegeVenArray.length, 'Checking it out')
    // if (privilegeVenArray.length > 0) {
    //   this.getPrivilegedVendors()
    //   this.showSelectOption = true
    // } else {
    //   this.selectedVendorName = this.userData.company_name
    //   this.showSelectOption = false
    //   this.selectedVendorCode = this.userData.vendor_code
    //   this.getSingleVendorPurchasers()
    // }

    // if (this.userData.privileged_vendors) {

    // } else {
    //   this.selectedVendorCode = this.userData.vendor_code
    //   this.getSingleVendorPurchasers()
    //   //console.log('no vendor')

    // }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.vendor = params['vendor']
      this.selectedVendorCode = this.vendor
      this.changeBellNotificationStatus()

      if (this.vendor != undefined) {
        this.getVendorPurchasers()
      }
    })
  }

  changeBellNotificationStatus() {
    this.httpServer
      .httpGetRequest(
        '/vendor/change-bell-notify-status/' +
          this.userData.id +
          '/' +
          this.selectedVendorCode,
      )
      .then((result: any) => {})
      .catch((err) => {})
  }

  downloadPurchasersExcel() {
    let javaDate = new Date()
    let currDate = javaDate.getDate()
    $('#export-purchaser').table2excel({
      exclude: '.noExl',
      name: `${currDate}-purchasers-dealer`,
      filename: `${currDate}-purchasers-dealer`,
      fileext: '.xlsx',
    })
  }

  getSingleVendorPurchasers() {
    // this.selectedState = true
    this.TotalForVendorAmount = 0
    this.tableView = false
    this.loader = true
    this.httpServer
      .httpGetRequest(
        '/vendor/get-purchases-dealers/' + this.selectedVendorCode,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.tableView = true
          this.incomingData = result.data
          this.noDataFound = result.data.length > 0 ? false : true
          if (result.data.length > 0) {
            for (let index = 0; index < result.data.length; index++) {
              const each = result.data[index]
              this.TotalForVendorAmount += parseFloat(each.amount)
            }
          }
        } else {
        }
      })
      .catch((err) => {})
  }

  getVendorPurchasers() {
    if (this.selectedVendorCode != '') {
      this.selectedVendorName = this.hiddenSelectedVendor

      this.TotalForVendorAmount = 0

      this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-purchases-dealers/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          console.log(result)
          if (result.status) {
            this.tableView = true
            this.incomingData = result.data
            this.noDataFound = result.data.length > 0 ? false : true
            if (result.data.length > 0) {
              for (let index = 0; index < result.data.length; index++) {
                const each = result.data[index]
                this.TotalForVendorAmount += parseFloat(each.amount)
              }
            }
          } else {
          }
        })
        .catch((err) => {})
    } else {
      console.log('tesrtss')
    }
  }

  selectedVendor(data: any) {
    // this.selectedVendorName = data
    this.selectedVendorCode = data
    for (let i = 0; i < this.privilegedVendors.length; i++) {
      const element = this.privilegedVendors[i]
      if (element.vendor_code == data) {
        this.hiddenSelectedVendor = element.vendor_name
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
          console.log(result.data)
        } else {
        }
      })
      .catch((err) => {})
  }
}
