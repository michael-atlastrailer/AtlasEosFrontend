import { Component, OnInit } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-special-orders',
  templateUrl: './special-orders.component.html',
  styleUrls: ['./special-orders.component.scss'],
})
export class SpecialOrdersComponent implements OnInit {
  tableView = true
  loader = false
  userData: any
  privilegedVendors: any
  selectedVendorName = ''
  selectedVendorCode = ''
  vendorProductData: any
  showSelectOption = true
  hiddenSelectedVendor = ''
  specialOrder: any
  noOrderFound = false
  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenData.getUser()
    if (this.userData.privileged_vendors != null) {
      let privilegeVenArray = this.userData.privileged_vendors.split(',')
      if (privilegeVenArray.length > 0) {
        this.getPrivilegedVendors()
        this.showSelectOption = true
      }
    } else {
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
      this.selectedVendorCode = this.userData.vendor_code
      this.getVendorSpecialOrders()
      // this.getSingleVendorPurchasers()
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

  getVendorSpecialOrders() {
    this.tableView = false
    this.loader = true

    this.httpServer
      .httpGetRequest(
        '/vendor/get-special-orders-by-vendor/' + this.selectedVendorCode,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.tableView = true
          this.specialOrder = result.data
          this.noOrderFound = result.data.length > 0 ? false : true
        } else {
        }
      })
      .catch((err) => {})
  }

  getVendorPurchasers() {
    if (this.selectedVendorCode != '') {
      this.selectedVendorName = this.hiddenSelectedVendor

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
            // this.incomingData = result.data
            // this.noDataFound = result.data.length > 0 ? false : true
            if (result.data.length > 0) {
            }
          } else {
          }
        })
        .catch((err) => {})
    } else {
      console.log('tesrtss')
    }
  }

  getSingleVendorPurchasers() {
    // this.selectedState = true
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
        } else {
        }
      })
      .catch((err) => {})
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
