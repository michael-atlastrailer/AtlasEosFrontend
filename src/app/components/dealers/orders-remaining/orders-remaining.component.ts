import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
export interface PeriodicElement {
  vendor_name: string;
}

@Component({
  selector: 'app-orders-remaining',
  templateUrl: './orders-remaining.component.html',
  styleUrls: ['./orders-remaining.component.scss'],
})
export class OrdersRemainingComponent implements OnInit {
  count = 0;
  loader = true;
  tableView = false;
  tableData: PeriodicElement[] = [];
  displayedColumns: string[] = ['id', 'vendor_name'];
  noData = false;
  dataSrc = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  sortDir =false
  constructor(
    private request: HttpRequestsService,
    private http: HttpClient,
    private token: TokenStorageService,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.fetchOrderRemaining();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSrc.paginator = this.paginator;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  fetchOrderRemaining() {
    this.tableView = false;
    this.loader = true;
    this.noData = false;
    let dealer = this.token.getUser().account_id;

    this.request
      .httpGetRequest('/fetch-orders-remaining/' + dealer)
      .then((result: any) => {
        console.log(result);
        this.tableView = true;
        this.loader = false;
        if (result.status) {
          this.tableData = result.data;
          console.log('data result', this.tableData, result.data.length);
          if (result.data.length == 0) {
            this.noData = true;
          }
          this.count = result.data.count;
          let responseData = result.data.order_remaining;
          // let responseSlice = result.data.order_remaining.slice();
          // responseData = responseSlice.sort((a: any, b: any) => {
          //   const isAsc = true;
          //   return compare(a.vendor_name, b.vendor_name, isAsc);
          // });
          this.dataSrc = new MatTableDataSource<PeriodicElement>(responseData);
          this.dataSrc.paginator = this.paginator;
        } else {
          this.toastr.error('Something went wrong', `${result.message}`);
          this.noData = true;
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong');
        this.noData = true;
      });
  }
  sortData(sort: Sort) {
    const data = this.dataSrc.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSrc.data = data;
      return;
    }
    console.log(
      'sort direction'
      //  `1${sort.direction}3`,
      //  sort.direction,
      //  sort.active
    );

    this.dataSrc.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction !== 'desc';
      switch (sort.active) {
        case 'index':
          return compare(a.index, b.index, isAsc);
        case 'vendor_name':
          return compare(a.vendor_name, b.vendor_name, isAsc);

        default:
          return 0;
      }
    });
  }
  sortDataAlt() {
    const data = this.dataSrc.data.slice();
   
    this.sortDir = !this.sortDir;

    this.dataSrc.data = data.sort((a: any, b: any) => {
      let item ='vendor_name'
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir);
        case 'vendor_name':
          return compare(a.vendor_name, b.vendor_name, this.sortDir);

        default:
          return 0;
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
