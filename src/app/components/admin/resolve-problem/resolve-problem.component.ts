import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

@Component({
  selector: 'app-resolve-problem',
  templateUrl: './resolve-problem.component.html',
  styleUrls: ['./resolve-problem.component.scss'],
})
export class ResolveProblemComponent implements OnInit {
  tableView = true
  loader = false
  reportProblemsData: any
  reportLoader = true
  userRole = ''
  userData: any

  constructor(
    private postData: HttpRequestsService,
    private tokeStore: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.getAllReport()
    this.userData = this.tokeStore.getUser()
    this.userRole = this.userData.role
  }

  getAllReport() {
    this.postData
      .httpGetRequest('/admin/get-all-reports')
      .then((result: any) => {
        console.log(result)
        this.reportLoader = false

        if (result.status) {
          this.reportProblemsData = result.data
          this.loader = false
          this.tableView = true
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }
}
