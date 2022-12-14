import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatSort, Sort } from '@angular/material/sort'

declare var $: any

export interface VendorData {
  vendor_id: string
  vendor_name: string
  status: string
  created_date: string
}

@Component({
  selector: 'app-all-vendors',
  templateUrl: './all-vendors.component.html',
  styleUrls: ['./all-vendors.component.scss'],
})
export class AllVendorsComponent implements OnInit {
  tableView = false
  loader = true
  allVendor: any

  sortDir = false
  productData: any

  displayedColumns: string[] = [
    'vendor_id',
    'vendor_name',
    'status',
    // 'created_at',
    'action',
  ]

  dataSource = new MatTableDataSource<VendorData>()
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild('paginatorFirst') paginatorFirst!: MatPaginator
  @ViewChild('paginatorSecond') paginatorSecond!: MatPaginator

  // ngAfterViewInit() {
  //     this.dataSource.paginator = this.paginatorFirst;;
  //     this.dataSourceWithObjectColumn.paginator = this.paginatorSecond;;
  // }

  incomingData: any
  // dataSource: any
  // dataSource: any
  loaderData = [9, 8, 6]
  pageSizes = [100, 200, 400]

  vendorForm!: FormGroup

  editVendorData: any

  manualChecker = false
  btnLoader = false
  btnText = true
  vendorId!: number
  dataSourceWithObjectColumn: any

  @ViewChild('closeButton') closeButton!: ElementRef

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getVendors()
    this.buildDealerForm()
  }

  sortByNumber() {
    //// const data = this.dataSource.data.slice()
    const data = this.productData.slice()
    this.sortDir = !this.sortDir

    this.dataSource = data.sort((a: any, b: any) => {
      let item = 'number'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir)
        case 'number':
          return compare(a.vendor_code, b.vendor_code, this.sortDir)

        default:
          return 0
      }
    })
  }

  sortByName() {
    //// const data = this.dataSource.data.slice()
    const data = this.productData.slice()
    this.sortDir = !this.sortDir

    this.dataSource = data.sort((a: any, b: any) => {
      let item = 'name'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir)
        case 'name':
          return compare(a.vendor_name, b.vendor_name, this.sortDir)

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorFirst
    this.dataSource.paginator = this.paginatorSecond
  }

  get vendorFormControls() {
    return this.vendorForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'vendorName' &&
      this.vendorFormControls.vendorName.hasError('required')
    ) {
      return 'enter vendor name'
    } else if (
      instance === 'vendorCode' &&
      this.vendorFormControls.vendorCode.hasError('required')
    ) {
      return 'enter vendor code'
    } else {
      return
    }
  }

  submit() {
    this.btnText = false
    this.btnLoader = true
    this.vendorForm.value.vendorId = this.vendorId

    this.postData
      .httpPostRequest('/edit-vendor-data', this.vendorForm.value)
      .then((result: any) => {
        console.log(result)
        this.btnText = true
        this.btnLoader = false

        if (result.status == true) {
          this.toastr.success('Successful', result.message)
          this.getVendors()
          this.closeButton.nativeElement.click()
        } else {
          this.toastr.error('Server Error', 'Try again')
        }
      })
      .catch((err) => {
        this.btnText = true
        this.btnLoader = false
        this.toastr.error('Try again', 'Something went wrong')
      })
  }

  buildDealerForm(): void {
    this.vendorForm = this.fb.group({
      vendorName: ['', [Validators.required]],
      vendorCode: ['', [Validators.required]],
    })
  }

  editVendor(data: any) {
    console.log(data)
    this.editVendorData = data
    this.vendorId = data.id

    this.vendorForm = this.fb.group({
      vendorName: [data.vendor_name, [Validators.required]],
      vendorCode: [data.vendor_code, [Validators.required]],
    })
    // this.vendorForm.value.vendorName = data.vendor_name
    // this.vendorForm.value.vendorCode = data.vendor_code
  }

  async removeVendor(data: any) {
    let confirmStatus = await this.confirmBox(data)

    if (confirmStatus) {
      $('#remove-icon-' + data.id).css('display', 'none')
      $('#remove-loader-' + data.id).css('display', 'inline-block')

      this.postData
        .httpGetRequest('/deactivate-vendor/' + data.id)
        .then((result: any) => {
          $('#remove-icon-' + data.id).css('display', 'inline-block')
          $('#remove-loader-' + data.id).css('display', 'none')
          if (result.status) {
            this.toastr.success('Successful', result.message)
            this.getVendors()
          } else {
            this.toastr.error('Something went wrong', 'Try again')
          }
        })
        .catch((err) => {
          $('#remove-icon-' + data.id).css('display', 'inline-block')
          $('#remove-loader-' + data.id).css('display', 'none')
          this.toastr.error('Something went wrong', 'try again')
        })
    } else {
    }
  }

  async confirmBox(data: any) {
    return await Swal.fire({
      title: 'You Are About To Remove This Vendor (' + data.vendor_name + ')',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        return true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false
      } else {
        return false
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingData.vendor_code = filterValue.trim().toLowerCase()
    this.dataSource = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    //console.log('RegExp: ' + regex);
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.vendor_code)
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

  getVendors() {
    this.postData
      .httpGetRequest('/get-all-vendors')
      .then((result: any) => {
        console.log(result)
        this.loader = false
        this.tableView = true

        if (result.status) {
          this.incomingData = result.data
          this.productData = result.data
          // this.dataSource = result.data
          this.dataSource = new MatTableDataSource(result.data)
          this.dataSourceWithObjectColumn = new MatTableDataSource(result.data)
          this.dataSource.paginator = this.paginatorFirst
          /////this.dataSource.paginator = this.paginatorSecond
          this.dataSourceWithObjectColumn.paginator = this.paginatorSecond
        } else {
          this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
