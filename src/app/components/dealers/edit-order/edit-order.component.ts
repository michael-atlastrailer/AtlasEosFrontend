import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSortModule } from '@angular/material/sort'
import { MatSort, Sort } from '@angular/material/sort'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ToastrService } from 'ngx-toastr'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import Swal from 'sweetalert2'

export interface PeriodicElement {
  vendor_code: any
  vendor_name: string
}
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {
  tableData: PeriodicElement[] = [];
  displayedColumns: string[] = ['vendor_name', 'vendor_code'];
  dataSrc = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  loader = true;
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private token: TokenStorageService
  ) {
    this.getAllVendorOrders();
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  ngOnInit(): void {}
  getAllVendorOrders() {
    let id = this.token.getUser().account_id;

    this.getData
      .httpGetRequest('/dealer/get-ordered-vendor/' + id)
      .then((result: any) => {
        // console.log(result);
        this.loader = false;
        if (result.status) {
          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
          this.dataSrc.sort = this.sort;
          this.dataSrc.paginator = this.paginator;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  async deleteVendorOrderConfirmBox() {
    return await Swal.fire({
      title: 'Are You Sure You Want To Delete  Order(s) from this Vendor ?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
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
    this.dataSrc.filter = filterValue.trim().toLowerCase();
  }

  async deleteVendorOrder(id: any) {
    let confirmAlert = await this.deleteVendorOrderConfirmBox();
    let dealerId = this.token.getUser().account_id;
    if (confirmAlert) {
      this.getData
        .httpGetRequest('/dealer/delete-item-cart/' + dealerId + '/' + id)
        .then((res: any) => {
          if (res.status) {
            this.getAllVendorOrders();
            this.toastr.success(res.message);
          } else {
            this.toastr.error('Something went wrong ', `Try again`);
          }
        })
        .catch((error) => {
          this.toastr.error(error);
        });
    }
  }
}
