import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-vendor-summary',
  templateUrl: './vendor-summary.component.html',
  styleUrls: ['./vendor-summary.component.scss'],
})
export class VendorSummaryComponent implements OnInit {
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
  allVendorData: any
  vendorCode = ''
  noCode = true
  currentVendor = ''

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
    private route: ActivatedRoute,
  ) {
    this.userData = tokenData.getUser()
    this.getAllVendors()

    this.route.params.subscribe((params) => {
      if (params['code']) {
        this.vendorCode = params['code']
        this.selectedVendorCode = this.vendorCode
        this.getVendorPurchasers()
        console.log('we found de code')
      } else {
        console.log('we just came here and not code found')
      }
    })
  }

  ngOnInit(): void {}

  getVendorPurchasers() {
    if (this.selectedVendorCode != '') {
      this.TotalForVendorAmount = 0
      this.selectedState = true

      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest('/admin/vendor-summary/' + this.selectedVendorCode)
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
        this.selectedVendorName = element.vendor_name
      }
    }
  }

  getAllVendors() {
    this.httpServer
      .httpGetRequest('/admin/get-all-vendors')
      .then((result: any) => {
        if (result.status) {
          this.allVendorData = result.data
          if (this.vendorCode != '') {
            this.noCode = false
            for (let i = 0; i < this.allVendorData.length; i++) {
              const element = this.allVendorData[i]
              if (element.vendor_code == this.vendorCode) {
                this.selectedVendorName = element.vendor_name
                this.currentVendor = element.vendor_name
              }
            }
          } else {
            this.noCode = true
          }
        } else {
        }
      })
      .catch((err) => {})
  }
}
