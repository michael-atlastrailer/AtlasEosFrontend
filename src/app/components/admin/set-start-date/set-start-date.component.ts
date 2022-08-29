import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';

@Component({
  selector: 'app-set-start-date',
  templateUrl: './set-start-date.component.html',
  styleUrls: ['./set-start-date.component.scss'],
})
export class SetStartDateComponent implements OnInit {
  noValueErr = false;
  loader = false;
  constructor(
    private postData: HttpRequestsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
  setDate(date: any) {
    console.log('value fir date', date);
    if (date == undefined || date == '') {
      this.toastr.error('Choose a start date', 'Try again');
    } else {
      this.loader = true;
      this.postData
        .httpPostRequest('/add-chart-date', { start_date: date })
        .then((result: any) => {
          console.log(result);
          this.loader = false;
          if (result.status) {
            this.toastr.success('Date has been set', 'Success');
          } else {
            this.toastr.error(result.message, 'Try again');
          }
        })
        .catch((err) => {
          this.loader = false;
          this.toastr.error('Try again', 'Something went wrong');
        });
    }
  }
}
