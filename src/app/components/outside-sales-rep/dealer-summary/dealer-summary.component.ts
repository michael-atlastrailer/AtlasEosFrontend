import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatSort, Sort } from '@angular/material/sort';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

declare var $: any;

export interface PeriodicElement {
  account: string;
  dealer_name: string;
  show_total: string;
}

@Component({
  selector: 'app-dealer-summary',
  templateUrl: './dealer-summary.component.html',
  styleUrls: ['./dealer-summary.component.scss'],
})
export class DealerSummaryComponent implements OnInit {
  tableView = true;
  loader = false;
  allVendor: any;
  loaderData = [9, 8, 6];
  incomingData: any;
  sortDirAccntId = false;
  sortDirTotal = false;
  sortDirName = false;
  displayedColumns: string[] = [
    'dealer_code',
    'dealer_name',
    'amount',
    'last_login',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getDealerUsers();
  }

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService
  ) {}

  @ViewChild(MatSort)
  sort!: MatSort;
  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'account_id':
          return compare(a.account_id, b.account_id, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'dealer_name':
          return compare(a.dealer_name, b.dealer_name, isAsc);

        default:
          return 0;
      }
    });
  }
  sortDataAlt(item: any) {
    const data = this.dataSource.data;

    if (item == 'dealer_code') {
      this.sortDirAccntId = !this.sortDirAccntId;
    }
    if (item == 'dealer_name') {
      this.sortDirName = !this.sortDirName;
    }
    if (item == 'amount') {
      this.sortDirTotal = !this.sortDirTotal;
    }
    console.log(
      'item user',
      item,
      this.dataSource.data,
      this.sortDirAccntId,
      this.sortDirName,
      this.sortDirTotal
    );
    this.dataSource.data = data.sort((a: any, b: any) => {
      switch (item) {
        case 'dealer_code':
          return compare(a.dealer_code, b.dealer_code, this.sortDirAccntId);
        case 'dealer_name':
          return compare(a.dealer_name, b.dealer_name, this.sortDirName);
        case 'amount':
          return compare(a.amount, b.amount, this.sortDirTotal);

        default:
          return 0;
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getDealerUsers() {
    let id = this.token.getUser().id;
    this.postData
      .httpGetRequest('/sales-rep/dealers-purchases/' + id)
      .then((result: any) => {
        console.log(result);

        if (result.status) {
          this.allVendor = result.data;
          // this.dataSource = result.data
          this.loader = false;
          this.tableView = true;
          this.incomingData = result.data;
          console.log('incoming data,re', result.data);
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            result.data
          );
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      });
  }
  getLastLogin(arr: any) {
    let date: null | any = null;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== null) {
        if (date !== null) {
          if (arr[i] > date) {
            date = arr[i];
          } else {
          }
        } else {
          date = arr[i];
        }
      } else {
        date = null;
      }
    }
    return date;
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
