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
  tableView = true;
  loader = false;
  allVendor: any;
  loaderData = [9, 8, 6];
  incomingData: any;
  allCategoryData: any;
  displayedColumns: string[] = [
    'atlas_id',
    'vendor',
    'description',
    'regular',
    'special',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {}

  ngOnInit(): void {}

  pageSizes = [3, 5, 7];

  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService
  ) {
    this.getAllVendors();
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
  getAllVendors() {
    this.postData
      .httpGetRequest('/fetch-vendors-new-products')
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.allCategoryData = result.data.vendor;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  getDealerUsers() {
    this.postData
      .httpGetRequest('/all-admins')
      .then((result: any) => {
        console.log(result);

        if (result.status) {
          this.allVendor = result.data;
          // this.dataSource = result.data
          this.loader = false;
          this.tableView = true;
          this.incomingData = result.data;
          this.dataSource = new MatTableDataSource<PeriodicElement>(
            result.data
          );

          this.dataSource.paginator = this.paginator;
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      });
  }
  selectVendor(id: any) {
    if (id !== 'none') {
     
    }
  }
}
