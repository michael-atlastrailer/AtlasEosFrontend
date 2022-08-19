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
  getDashboardData() {
    let accntId = this.token.getUser().id;
    this.getData
      .httpGetRequest('/branch/dashboard/' + accntId)
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.totalDealers = result.data.total_dealers;
          this.totalLogged = result.data.total_logged_in;
          this.totalNotLogged = result.data.total_not_logged_in;
          this.purchaseTotal = result.data.total_sales;
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
