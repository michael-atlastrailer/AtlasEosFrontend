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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
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
          this.dataSrc = new MatTableDataSource<PeriodicElement>(
            result.data.order_remaining
          );
          this.dataSrc.paginator = this.paginator;
          this.dataSrc.sort = this.sort;
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
}
