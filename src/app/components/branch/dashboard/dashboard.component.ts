import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chartOptions: any;
  totalDealers = 0;
  purchaseTotal = 0;
  totalLogged = 0;
  totalNotLogged = 0;
  constructor(
    private getData: HttpRequestsService,
    private token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.getDashboardData();
  }
  getTotalLogin(arr: any) {
    let dateCount = 0;
    for (var i = 0; i < arr.length; i++) {
      let countAdd = false;
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] !== null) {
          countAdd = true;
        }
      }
      if (countAdd) {
        dateCount = dateCount + 1;
      }
    }
    return dateCount;
  }
  getDashboardData() {
    let accntId = this.token.getUser().id;
    this.getData
      .httpGetRequest('/branch/dashboard/' + accntId)
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.totalDealers = result?.data?.total_dealers!;
           this.totalLogged = this.getTotalLogin(result?.data?.login_array);
           this.totalNotLogged =
             result.data.total_dealers -
             this.getTotalLogin(result.data.login_array);
          this.purchaseTotal = result.data.total_purchase!;
          console.log(
            'res dashboard',
            result.data,
            this.totalDealers,
            this.totalLogged,
            this.totalNotLogged,
            this.purchaseTotal
          );
        } else {
        }
      })
      .catch((err) => {});
  }

  ngOnInit(): void {}
}
