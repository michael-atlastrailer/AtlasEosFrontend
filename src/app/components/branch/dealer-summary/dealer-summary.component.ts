import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TokenizeResult } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

import Swal from 'sweetalert2';

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
  tableView = false;
  loader = true;
  allVendor: any;
  loaderData = [9, 8, 6];
  incomingData: any;

  displayedColumns: string[] = [
    'dealer_code',
    'dealer_name',
    'amount',
    'last_login',
  ];
  sortDirAccntId = false;
  sortDirTotal = false;
  sortDirName = false;
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getDealerUsers();
  }

  pageSizes = [3, 5, 7];
  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'dealer_code':
          return compare(a.dealer_code, b.dealer_code, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'dealer_name':
          return compare(a.dealer_name, b.dealer_name, isAsc);

        default:
          return 0;
      }
    });
  }

  constructor(
    private postData: HttpRequestsService,
    private token: TokenStorageService,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  @ViewChild(MatSort)
  sort!: MatSort;
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  async removeVendor(index: any) {
    let confirmStatus = await this.confirmBox();

    if (confirmStatus) {
      $('#remove-icon-' + index).css('display', 'none');
      $('#remove-loader-' + index).css('display', 'inline-block');

      this.postData
        .httpGetRequest('/deactivate-dealer-user/' + index)
        .then((result: any) => {
          $('#remove-icon-' + index).css('display', 'inline-block');
          $('#remove-loader-' + index).css('display', 'none');

          if (result.status) {
            this.toastr.success('Successful', result.message);
            this.getDealerUsers();
          } else {
            this.toastr.error('Something went wrong', 'Try again');
          }
        })
        .catch((err) => {
          this.toastr.error('Something went wrong', 'Try again');
        });
    } else {
    }
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
      this.sortDirTotal,
      this.sortDirName
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
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      } else {
        return false;
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getDealerUsers() {
    let id = this.token.getUser().id;
    this.postData
      .httpGetRequest('/branch/get-dealer-order-summary/' + id)
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
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
