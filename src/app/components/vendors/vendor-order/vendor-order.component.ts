import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'

export interface vendorProducts {
  atlas_id: string
  vendor: string
  description: string
  regular: string
  show: string
}

@Component({
  selector: 'app-vendor-order',
  templateUrl: './vendor-order.component.html',
  styleUrls: ['./vendor-order.component.scss'],
})
export class VendorOrderComponent implements OnInit {
  tableView = true
  loader = false
  userData: any
  privilegedVendors: any
  selectedVendorName!: string
  selectedVendorCode!: string
  vendorProductData: any
  incomingData: any

  displayedColumns: string[] = [
    'atlas_id',
    'vendor',
    'description',
    'regular',
    'show',
  ]

  dataSource = new MatTableDataSource<vendorProducts>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  pageSizes = [10, 40, 70]

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
  ) {
    this.userData = tokenData.getUser()
    this.getPrivilegedVendors()
  }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingData.atlas_id = filterValue.trim().toLowerCase()
    this.dataSource = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    //console.log('RegExp: ' + regex);
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.atlas_id)
    })
  }

  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  convertWildcardStringToRegExp(expression: string) {
    var terms = expression.split('*')

    var trailingWildcard = false

    var expr = ''
    for (var i = 0; i < terms.length; i++) {
      if (terms[i]) {
        if (i > 0 && terms[i - 1]) {
          expr += '.*'
        }
        trailingWildcard = false
        expr += this.escapeRegExp(terms[i])
      } else {
        trailingWildcard = true
        expr += '.*'
      }
    }

    if (!trailingWildcard) {
      expr += '.*'
    }

    return new RegExp('^' + expr + '$', 'i')
  }

  getVendorProducts() {
    if (this.selectedVendorCode) {
      this.tableView = false
      this.loader = true
      this.httpServer
        .httpGetRequest(
          '/vendor/get-vendor-products/' + this.selectedVendorCode,
        )
        .then((result: any) => {
          this.tableView = true
          this.loader = false
          console.log(result)
          if (result.status) {
            // this.vendorProductData = result.data

            this.tableView = true
            this.incomingData = result.data
            this.dataSource = new MatTableDataSource<vendorProducts>(
              result.data,
            )

            this.dataSource.paginator = this.paginator
          } else {
          }
        })
        .catch((err) => {})
    }
  }

  selectedVendor(data: any) {
    //console.log(data.value)
    this.selectedVendorCode = data.value
    for (let f = 0; f < this.privilegedVendors.length; f++) {
      const element = this.privilegedVendors[f]
      if (element.vendor_code == data.value) {
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
