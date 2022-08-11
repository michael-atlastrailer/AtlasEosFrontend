import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { MatSort } from '@angular/material/sort'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

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
  tableView = true
  loader = false
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

 

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,private token: TokenStorageService,
  ) {}

  @ViewChild(MatSort)
  sort!: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

   
  }
  getDealerUsers() {
    let id = this.token.getUser().id
    this.postData
      .httpGetRequest('/sales-rep/get-purchasers-dealer/'+id)
      .then((result: any) => {
        console.log(result)

        if (result.status) {
          this.allVendor = result.data
          // this.dataSource = result.data
          this.loader = false
          this.tableView = true
          this.incomingData = result.data
          console.log("incoming data,re",result.data)
          this.dataSource = new MatTableDataSource<PeriodicElement>(result.data)
          this.dataSource.sort = this.sort;
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
