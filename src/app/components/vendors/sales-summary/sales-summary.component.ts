import { Component, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'

export interface vendorProducts {
  pro_id: string
  qty: string
  atlas_id: string
  vendor: string
  description: string
  regular: string
  booking: string
  total: string
  temp: string
}

declare var $: any

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

  printVendorCode = ''
  currenDateTime = ''

  // dataSource: any
  productData: any

  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'regular',
    'show',
    'total',
  ]

  sortDir = false

  dataSource = new MatTableDataSource<vendorProducts>()

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
      this.printVendorCode = this.selectedVendorCode
      this.getSingleVendorSummary()
      //console.log('no vendor')
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
    }
  }

  ngOnInit(): void {
    let d = new Date()
    let month = d.getMonth() + 1
    let mnth = month < 10 ? `0${month}` : month
    let dateT = d.getDate()
    let dd = dateT < 10 ? `0${dateT}` : dateT
    let comDate = dd + '-' + mnth + '-' + d.getFullYear()
    let hrs = d.getHours()
    let hours = hrs < 10 ? `0${hrs}` : hrs
    let mins = d.getMinutes()
    let minutes = mins < 10 ? `0${mins}` : mins
    let sec = d.getSeconds()
    let ampm = hrs >= 12 ? 'pm' : 'am'
    let comTime = hours + ':' + minutes + ':' + sec + ' ' + ampm
    this.currenDateTime = comDate + ' ' + comTime
  }

  sortDataAlt() {
    //// const data = this.dataSource.data.slice()

    const data = this.productData.slice()

    console.log(data)

    this.sortDir = !this.sortDir

    this.dataSource = data.sort((a: any, b: any) => {
      let item = 'vendor_product_code'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir)
        case 'vendor_product_code':
          return compare(a.vendor, b.vendor, this.sortDir)

        default:
          return 0
      }
    })
  }

  exportToExcel() {
    $('#export-table').table2excel({
      exclude: '.noExl',
      name: 'sales-summary',
      filename: 'sales-summary',
      fileext: '.xlsx',
    })
  }

  sortData(sort: Sort) {
    const data = this.productData.slice()
    if (!sort.active || sort.direction === '') {
      this.dataSource = data
      return
    }

    this.dataSource = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc'
      switch (sort.active) {
        case 'atlas_id':
          return compare(a.id, b.id, isAsc)
        case 'vendor':
          return compare(a.vendor, b.vendor, isAsc)

        default:
          return 0
      }
    })
  }

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

            this.productData = result.data
            this.tableView = true
            this.incomingData = result.data
            // this.dataSource = result.data
            this.noDataFound = result.data.length > 0 ? false : true

            this.dataSource = new MatTableDataSource<vendorProducts>(
              result.data,
            )

            // this.dataSource.paginator = this.paginator

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
          if (result.status) {
            this.totalAmount = 0

            this.tableView = true
            this.incomingData = result.data
            // this.dataSource = result.data
            this.productData = result.data
            this.noDataFound = result.data.length > 0 ? false : true

            this.dataSource = new MatTableDataSource<vendorProducts>(
              result.data,
            )

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
    this.printVendorCode = data
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

  // exportToExcel() {
  //   let javaDate = new Date()
  //   let currDate = javaDate.getDate()
  //   $('#export-sales-summary').table2excel({
  //     exclude: '.noExl',
  //     name: `${currDate}-sales-summary`,
  //     filename: `${currDate}-sales-summary`,
  //     fileext: '.xlsx',
  //   })
  // }

  getLocal(e: any) {
    return localStorage.getItem(e)
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
