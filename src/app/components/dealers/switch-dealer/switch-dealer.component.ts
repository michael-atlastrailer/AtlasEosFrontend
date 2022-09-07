import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { Router } from '@angular/router'

declare var $: any

export interface VendorData {
  dealerCode: string
  dealerName: string
  status: string
  created_date: string
}

@Component({
  selector: 'app-switch-dealer',
  templateUrl: './switch-dealer.component.html',
  styleUrls: ['./switch-dealer.component.scss'],
})
export class SwitchDealerComponent implements OnInit {
  tableView = false
  loader = true
  dealershipData: any

  displayedColumns: string[] = ['dealerCode', 'dealerName', 'action']

  dataSource = new MatTableDataSource<VendorData>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  incomingData: any
  // dataSource: any
  // dataSource: any
  loaderData = [9, 8, 6]
  pageSizes = [20, 60, 80]

  vendorForm!: FormGroup

  editVendorData: any

  manualChecker = false
  btnLoader = false
  btnText = true
  vendorId!: number
  userData: any

  @ViewChild('closeButton') closeButton!: ElementRef

  defaultBtn = false
  noPrivilegedDealer = false

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private tokenStore: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()

    if (
      window.localStorage.getItem('switchType') &&
      window.localStorage.getItem('switchType') == 'default-to-dealer'
    ) {
      // console.log(' hete agaginnd')
      this.defaultBtn = true
    } else {
      // console.log('not hete agaginnd')
      this.defaultBtn = false
    }

    this.getAllDealership()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  switchToDefault() {
    this.tokenStore.switchBackToDefault()
    this.defaultBtn = false
  }

  async switchDealer(data: any) {
    let confirmStatus = await this.confirmBox(data)
    if (confirmStatus) {
      this.defaultBtn = true
      this.tokenStore.switchDealerToDealer(data)
      this.toastr.success('Dealer Switch was successful', 'Switch Info')
      /// this.router.navigate(['/dealers/dashboard'])
    } else {
    }
  }

  async confirmBox(data: any) {
    return await Swal.fire({
      title:
        'You Are About To Switch to This Dealership (' + data.dealer_name + ')',
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
    this.incomingData.dealer_code = filterValue.trim().toLowerCase()
    this.dataSource = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    //console.log('RegExp: ' + regex);
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.dealer_code)
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

  getAllDealership() {
    this.postData
      .httpGetRequest('/dealer/dealer-privileged-dealers/' + this.userData.id)
      .then((result: any) => {
        console.log(result)
        this.loader = false
        this.tableView = true

        if (result.status) {
          if (result.data.length > 0) {
            this.incomingData = result.data
            this.dataSource = new MatTableDataSource(result.data)
            this.dataSource.paginator = this.paginator
            this.noPrivilegedDealer = result.data.length > 0 ? false : true
          }
        } else {
          this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }
}
