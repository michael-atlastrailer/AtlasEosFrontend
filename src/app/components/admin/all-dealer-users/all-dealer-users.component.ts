import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'

declare var $: any

export interface PeriodicElement {
  account_id: string
  full_name: string
  email: string
  password: string
  company_name: string
  status: string
  last_login: string
  order_status: string
  created_date: string
}

@Component({
  selector: 'app-all-dealer-users',
  templateUrl: './all-dealer-users.component.html',
  styleUrls: ['./all-dealer-users.component.scss'],
})
export class AllDealerUsersComponent implements OnInit {
  tableView = false
  loader = true
  allVendor: any
  loaderData = [9, 8, 6]
  incomingData: any

  displayedColumns: string[] = [
    'account_id',
    'company_name',

    'full_name',
    'email',
    'password',
    // 'status',
    'last_login',
    'order_status',
    // 'created_date',
    'action',
  ]

  dataSource = new MatTableDataSource<PeriodicElement>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.getDealerUsers()
  }

  pageSizes = [100, 200, 400]

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  async removeVendor(data: any) {
    console.log(data)

    let confirmStatus = await this.confirmBox(data)

    if (confirmStatus) {
      $('#remove-icon-' + data.id).css('display', 'none')
      $('#remove-loader-' + data.id).css('display', 'inline-block')

      this.postData
        .httpGetRequest('/deactivate-dealer-user/' + data.id)
        .then((result: any) => {
          $('#remove-icon-' + data.id).css('display', 'inline-block')
          $('#remove-loader-' + data.id).css('display', 'none')

          if (result.status) {
            this.toastr.success('Successful', result.message)
            this.getDealerUsers()
          } else {
            this.toastr.error('Something went wrong', 'Try again')
          }
        })
        .catch((err) => {
          this.toastr.error('Something went wrong', 'Try again')
        })
    } else {
    }
  }

  async confirmBox(data: any) {
    return await Swal.fire({
      title:
        'You Are About To Remove This Vendor User ( ' +
        data.first_name +
        ' ' +
        data.last_name +
        ')',
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
    this.incomingData.vendor_name = filterValue.trim().toLowerCase()
    this.dataSource = this.filterArray('*' + filterValue)

    //console.log(res)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    //console.log('RegExp: ' + regex);
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.full_name)
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

  getDealerUsers() {
    this.postData
      .httpGetRequest('/get-all-dealer-users')
      .then((result: any) => {
        console.log(result)

        if (result.status) {
          this.allVendor = result.data
          // this.dataSource = result.data
          this.loader = false
          this.tableView = true
          this.incomingData = result.data
          this.dataSource = new MatTableDataSource<PeriodicElement>(result.data)

          this.dataSource.paginator = this.paginator
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }
}
