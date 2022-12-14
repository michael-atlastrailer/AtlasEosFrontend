import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'

export interface Products {
  atlas_id: string
  vendor_code: string
  vendor_name: string
  description: string
  booking: string
  status: string
  created_date: string
}

@Component({
  selector: 'app-vendor-order-form',
  templateUrl: './vendor-order-form.component.html',
  styleUrls: ['./vendor-order-form.component.scss'],
})
export class VendorOrderFormComponent implements OnInit {
  tableView = true
  loader = false
  allVendors: any
  selectedVendorName = ''
  selectedVendorCode = ''
  vendorProductData: any
  noItemFound = false
  incomingData: any

  sortDir = false
  productData: any

  displayedColumns: string[] = [
    'atlas_id',
    'vendor_code',
    'description',
    'regular',
    'booking',
  ]

  dataSource = new MatTableDataSource<Products>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  constructor(
    private httpService: HttpRequestsService,
    private toastr: ToastrService,
    private tokenStore: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.getAllVendors()
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

  getProductByVendorId() {
    this.loader = true
    this.tableView = false

    this.httpService
      .httpGetRequest('/admin/get-vendor-products/' + this.selectedVendorCode)
      .then((result: any) => {
        this.loader = false
        this.tableView = true
        if (result.status) {
          this.vendorProductData = result.data
          this.noItemFound = result.data.length < 0 ? true : false
          this.incomingData = result.data
          this.dataSource = new MatTableDataSource<Products>(result.data)

          this.productData = result.data

          this.dataSource.paginator = this.paginator
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  vendorSelected(data: any) {
    // this.selectedVendorName = data
    this.selectedVendorCode = data
    for (let i = 0; i < this.allVendors.length; i++) {
      const element = this.allVendors[i]
      if (element.vendor_code == data) {
        this.selectedVendorName = element.vendor_name
      }
    }
  }

  // vendorSelected(data: any) {
  //   this.selectedVendorCode = data.vendor_code
  //   this.selectedVendorName = data.vendor_name
  // }

  getAllVendors() {
    this.httpService
      .httpGetRequest('/admin/get-all-vendors')
      .then((result: any) => {
        this.loader = false
        this.tableView = true

        if (result.status) {
          this.allVendors = result.data
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  getDealerCart() {
    this.httpService
      .httpGetRequest('/admin/get-price-override/')
      .then((result: any) => {
        this.loader = false
        this.tableView = true

        if (result.status) {
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
