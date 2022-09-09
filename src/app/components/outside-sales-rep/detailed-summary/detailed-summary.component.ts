import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

export interface PeriodicElement {
  qty: string;
  atlas_id: string;
  vendor_code: string;
  description: string;
  special: string;
  total: string;
}

@Component({
  selector: 'app-detailed-summary',
  templateUrl: './detailed-summary.component.html',
  styleUrls: ['./detailed-summary.component.scss'],
})
export class DetailedSummaryComponent implements OnInit {
  tableView = true;
  loader = false;
  allVendor: any;
  loaderData = [9, 8, 6];
  incomingData: any;
  completedOrders = 0;
  ordersRemaining = 88;
  showTotal = 0;
  noData = true;
  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor_code',
    'description',
    'special',
    'total',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dealerData: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {}
  currenDateTime = '';
  selectedId: any;
  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.getVendors();
    this.route.params.subscribe((params) => {
      let accnt = params['account_id'];
      if (accnt) {
        this.selectedId = accnt;
        console.log("account id",accnt)
        this.getDealerOrders(accnt);
      }
    });
    let d = new Date();
    let month = d.getMonth() + 1;
    let mnth = month < 10 ? `0${month}` : month;

    let dateT = d.getDate();
    let dd = dateT < 10 ? `0${dateT}` : dateT;

    let comDate = dd + '-' + mnth + '-' + d.getFullYear();

    let hrs = d.getHours();
    let hours = hrs < 10 ? `0${hrs}` : hrs;

    let mins = d.getMinutes();
    let minutes = mins < 10 ? `0${mins}` : mins;
    let sec = d.getSeconds();
    let ampm = hrs >= 12 ? 'pm' : 'am';

    let comTime = hours + ':' + minutes + ':' + sec + ' ' + ampm;

    this.currenDateTime = comDate + ' ' + comTime;
  }

  getVendors() {
    let id = this.token.getUser().id;
    this.postData
      .httpGetRequest('/sales-rep/dealers/' + id)
      .then((result: any) => {
        console.log(result);

        if (result.status) {
          this.allVendor = result.data;
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      });
  }

  getDealerOrders(id: string) {
    this.selectedId=id
    this.loader = true;
    this.tableView = false;
    this.noData = false;
    // let id = '1021-11';
    if (id == 'none') {
      this.showTotal = 0;
      this.ordersRemaining = 88;
      this.completedOrders = 0;
      this.loader = false;
      this.tableView = false;
      this.noData = true;
    } else {
      this.postData
        .httpGetRequest('/sales-rep/dealers-summary/' + id)
        .then((result: any) => {
          console.log(result);

          if (result.status) {
            this.dealerData = result.data;
            // this.dataSource = result.data

            if (result.data.length > 0) {
              this.loader = false;
              this.tableView = true;
              this.incomingData = result.data;
              this.getDashData(result.data);
            } else {
              this.noData = true;
              this.loader = false;
              this.tableView = false;
            }
          } else {
            this.noData = true;
            this.loader = false;
            // this.toastr.error(result.message, 'Try again')
          }
        })
        .catch((err) => {
          this.loader = false;
          this.noData = true;
          // this.toastr.error('Try again', 'Something went wrong')
        });
    }
  }
  
  getDashData(data: Array<any>) {
    this.completedOrders = data.length;
    this.ordersRemaining = 88 - data.length;
    this.showTotal = data.reduce((tot, num) => tot + num.total, 0);
    console.log(
      'calced',
      this.showTotal,
      this.ordersRemaining,
      this.completedOrders
    );
  }
}
