import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'

declare var $: any

export interface PeriodicElement {
  account: string
  dealer_name: string
  show_total: string
}

@Component({
  selector: 'app-dealer-summary',
  templateUrl: './dealer-summary.component.html',
  styleUrls: ['./dealer-summary.component.scss'],
})
export class DealerSummaryComponent implements OnInit {
  tableView = false
  loader = true
  allVendor: any
  loaderData = [9, 8, 6]
  incomingData: any

  displayedColumns: string[] = ['account', 'dealer_name', 'show_total']

  dataSource = new MatTableDataSource<PeriodicElement>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.getDealerUsers()
  }

  pageSizes = [3, 5, 7]

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  async removeVendor(index: any) {
    let confirmStatus = await this.confirmBox()

    if (confirmStatus) {
      $('#remove-icon-' + index).css('display', 'none')
      $('#remove-loader-' + index).css('display', 'inline-block')

      this.postData
        .httpGetRequest('/deactivate-dealer-user/' + index)
        .then((result: any) => {
          $('#remove-icon-' + index).css('display', 'inline-block')
          $('#remove-loader-' + index).css('display', 'none')

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

  async confirmBox() {
    return await Swal.fire({
      title: 'You Are About To Remove This Vendor User',
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

  getDealerUsers() {
    this.postData
      .httpGetRequest('/all-admins')
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
