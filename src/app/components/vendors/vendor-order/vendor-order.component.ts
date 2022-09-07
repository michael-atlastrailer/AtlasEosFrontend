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
  privilageStatus = false
  showSelectOption = true

  sortDir = false
  productData: any
  allVendorData: any

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

    if (this.userData.privileged_vendors != null) {
      let privilegeVenArray = this.userData.privileged_vendors.split(',')
      if (privilegeVenArray[1] != '') {
        this.getPrivilegedVendors()
        this.showSelectOption = true
      } else {
        this.selectedVendorName = this.userData.company_name
        this.showSelectOption = false
        this.selectedVendorCode = privilegeVenArray[0]
        this.getVendorOrders()
        this.getAllVendors()
      }
    } else {
      this.selectedVendorName = this.userData.company_name
      this.showSelectOption = false
      this.selectedVendorCode = this.userData.vendor_code
      this.getVendorOrders()
    }

    // if (this.userData.privileged_vendors) {
    //   this.getPrivilegedVendors()
    //   this.showSelectOption = true
    // } else {
    //   this.getVendorOrders()
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

  sortDataAlt() {
    //// const data = this.dataSource.data.slice()
    const data = this.productData.slice()
    this.sortDir = !this.sortDir

    this.dataSource = data.sort((a: any, b: any) => {
      let item = 'vendor_product_code'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir)
        case 'vendor_product_code':
          return compare(
            a.vendor_product_code,
            b.vendor_product_code,
            this.sortDir,
          )

        default:
          return 0
      }
    })
  }

  sortById() {
    //// const data = this.dataSource.data.slice()
    const data = this.productData.slice()
    this.sortDir = !this.sortDir

    this.dataSource = data.sort((a: any, b: any) => {
      let item = 'id'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir)
        case 'id':
          return compare(a.id, b.id, this.sortDir)

        default:
          return 0
      }
    })
  }

  sortData(sort: Sort) {
    const data = this.productData.slice()
    if (!sort.active || sort.direction === '') {
      this.dataSource = data
      return
    }

    this.dataSource = data.sort((a: any, b: any) => {
      // const isAsc = sort.direction === 'asc'

      const isAsc = !true

      switch (sort.active) {
        case 'atlas_id':
          return compare(a.id, b.id, isAsc)
        case 'vendor':
          return compare(a.vendor_product_code, b.vendor_product_code, isAsc)

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
          if (result.status) {
            this.tableView = true
            this.incomingData = result.data
            this.productData = result.data
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

  getVendorOrders() {
    this.loader = true
    this.tableView = false
    this.httpServer
      .httpGetRequest(
        '/vendor/get-vendor-order-data/' + this.userData.vendor_code,
      )
      .then((result: any) => {
        this.loader = false
        this.tableView = true
        if (result.status) {
          this.incomingData = result.data
          this.productData = result.data

          this.dataSource = new MatTableDataSource<vendorProducts>(result.data)

          this.dataSource.paginator = this.paginator
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
        } else {
        }
      })
      .catch((err) => {})
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
