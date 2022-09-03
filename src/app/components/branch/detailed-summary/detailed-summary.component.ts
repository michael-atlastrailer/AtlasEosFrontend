import { Component, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ActivatedRoute } from '@angular/router'

declare var $: any

export interface PeriodicElement {
  qty: string
  atlas_id: string
  vendor_code: string
  description: string
  special: string
  total: string
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
  ordersRemaining = 50;
  showTotal = 0;
  noData = true;

  dealerData: any;

  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor_code',
    'description',
    'special',
    'total',
  ];
selectedId:any
  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.getVendors();
    this.route.params.subscribe((params) => {
    
      let accnt = params['account_id']
      if (accnt) {
        this.selectedId=accnt
        this.getDealerOrders(accnt)
      }
    })
  }
  ngOnInit(): void {
    
  }

  getVendors() {
    let id = this.token.getUser().id;
    this.postData
      .httpGetRequest('/branch-dealers/' + id)
      .then((result: any) => {
        console.log(result);

        if (result.status) {
          this.allVendor = result.data;
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
   this.toastr.error('Try again', 'Something went wrong')
      });
  }

  getDealerOrders(id: string) {
    this.loader = true;
    this.tableView = false;
    this.noData = false;
    // let id = '1021-11';
    if (id == 'none') {
      this.showTotal = 0;
      this.ordersRemaining = 50;
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
    this.ordersRemaining = 50 - data.length;
    this.showTotal = data.reduce((tot, num) => tot + num.total, 0);
    console.log(
      'calced',
      this.showTotal,
      this.ordersRemaining,
      this.completedOrders
    );
  }
}
