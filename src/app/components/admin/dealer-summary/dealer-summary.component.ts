import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { ActivatedRoute, Router } from '@angular/router'

export interface Products {
  atlas_id: string
  vendor_code: string
  vendor_name: string
  description: string
  booking: string
  status: string
  created_date: string
}

@Component({
  selector: 'app-dealer-summary',
  templateUrl: './dealer-summary.component.html',
  styleUrls: ['./dealer-summary.component.scss'],
})
export class DealerSummaryComponent implements OnInit {
  tableView = true
  loader = false

  dealerSummaryData: any
  incomingData: any
  noItemFound = false

  dealerCode = ''

  displayedColumns: string[] = ['dealer_code', 'dealer_name', 'sales']

  dataSource = new MatTableDataSource<Products>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  @ViewChild('accountInput') accountInput!: ElementRef

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  constructor(
    private httpService: HttpRequestsService,
    private toastr: ToastrService,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      if (params['code']) {
        this.dealerCode = params['code']
        this.getSingleDealerSummary()
      } else {
        this.getDealerSummary()
      }
    })
  }

  ngOnInit(): void {}

  getSingleDealerSummary() {
    this.loader = true
    this.tableView = false

    this.httpService
      .httpGetRequest('/admin/dealer-single-summary/' + this.dealerCode)
      .then((result: any) => {
        this.loader = false
        this.tableView = true
        if (result.status) {
          /// this.dealerSummaryData = result.data
          this.noItemFound = result.data.length < 0 ? true : false
          this.incomingData = result.data
          this.dataSource = new MatTableDataSource<Products>(result.data)
          this.dataSource.paginator = this.paginator
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  applyFilter() {
    const filterValue = this.accountInput.nativeElement.value
    this.incomingData.dealer_code = filterValue.trim().toLowerCase()
    this.dataSource = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    //console.log('RegExp: ' + regex);
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.dealer_code)
    })
  }

  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  convertWildcardStringToRegExp(expression: string) {
    var terms = expression.split('*')

    var trailingWildcard = false

    var expr = ''
    for (var i = 0; i < terms.length; i++) {
      if (terms[i]) {
        if (i > 0 && terms[i - 1]) {
          expr += '.*'
        }
        trailingWildcard = false
        expr += this.escapeRegExp(terms[i])
      } else {
        trailingWildcard = true
        expr += '.*'
      }
    }

    if (!trailingWildcard) {
      expr += '.*'
    }

    return new RegExp('^' + expr + '$', 'i')
  }

  getDealerSummary() {
    this.loader = true
    this.tableView = false

    this.httpService
      .httpGetRequest('/admin/dealer-summary')
      .then((result: any) => {
        this.loader = false
        this.tableView = true
        if (result.status) {
          /// this.dealerSummaryData = result.data
          this.noItemFound = result.data.length < 0 ? true : false
          this.incomingData = result.data
          this.dataSource = new MatTableDataSource<Products>(result.data)
          this.dataSource.paginator = this.paginator
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }
}
