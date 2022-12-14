import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-dealer-users',
  templateUrl: './edit-dealer-users.component.html',
  styleUrls: ['./edit-dealer-users.component.scss'],
})
export class EditDealerUsersComponent implements OnInit {
  vendorUserForm!: FormGroup
  manualChecker = false
  btnText = true
  btnLoader = false

  userId: any
  allVendor: any
  vendorUserData: any
  profileLoader = true
  profileDataStatus = false

  allDealers: any

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.buildVendorUserForm()
    this.getVendors()
    this.getAllDealers()

    this.route.params.subscribe((params) => {
      this.userId = params['user']

      console.log(this.userId)
      this.getVendorUserData(this.userId)
    })
  }

  getAllDealers() {
    this.postData
      .httpGetRequest('/admin/all-dealership')
      .then((result: any) => {
        if (result.status) {
          this.allDealers = result.data
        } else {
          this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }

  assignDealer(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allDealers.length; index++) {
      const vendor = this.allDealers[index]
      if (vendor.dealer_name == data.value) {
        this.vendorUserForm.value.dealerCode = vendor.dealer_code
        this.vendorUserForm.value.dealerName = vendor.dealer_name
      }
    }
  }

  assignVendor(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index]
      if (vendor.vendor_name == data.value) {
        this.vendorUserForm.value.vendorCode = vendor.vendor_code
        this.vendorUserForm.value.vendorName = vendor.vendor_name
      }
    }
  }

  getVendorUserData(user: any) {
    this.postData
      .httpGetRequest('/get-vendor-user/' + user)
      .then((result: any) => {
        this.profileLoader = false
        this.profileDataStatus = true

        console.log(result)

        if (result.status) {
          this.vendorUserData = result.data

          this.vendorUserForm = this.fb.group({
            username: [this.vendorUserData.email],
            password: [this.vendorUserData.password_show],
            firstName: [this.vendorUserData.first_name],
            lastName: [this.vendorUserData.last_name],
            email: [this.vendorUserData.email],
            phone: [this.vendorUserData.phone],
            role: [''],
            status: [''],
            dealer: [''],
            vendor: [''],
            privilegeDealer: [this.vendorUserData.privileged_dealers],
            privilegeVendor: [this.vendorUserData.privileged_vendors],
            location: [this.vendorUserData.location],
            companyName: [this.vendorUserData.company_name],

            superVendor: ['0'],
          })
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  buildVendorUserForm(): void {
    this.vendorUserForm = this.fb.group({
      username: [''],
      password: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      role: [''],
      status: [''],
      dealer: [''],
      vendor: [''],
      privilegeDealer: [''],
      privilegeVendor: [''],
      location: [''],
      dealership: [''],
      companyName: [''],

      superVendor: ['0'],
    })
  }

  getVendors() {
    this.postData
      .httpGetRequest('/get-all-vendors')
      .then((result: any) => {
        // console.log(result)

        if (result.status) {
          this.allVendor = result.data
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  submit() {
    this.vendorUserForm.value.vendorId = this.userId
    this.btnText = false
    this.btnLoader = true

    this.postData
      .httpPostRequest('/edit-vendor-user', this.vendorUserForm.value)
      .then((result: any) => {
        console.log(result)
        this.btnText = true
        this.btnLoader = false

        if (result.status == true) {
          this.toastr.success('Successful', 'user edit was successful')
          this.getVendorUserData(this.userId)
        } else {
          this.toastr.error('Server Error', 'Try again')
        }
      })
      .catch((err) => {
        this.btnText = true
        this.btnLoader = false
        this.toastr.error('Try again', 'Something went wrong')
      })

    // } else {
    //   this.manualChecker = true
    // }
  }

  get vendorUserFormControls() {
    return this.vendorUserForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'username' &&
      this.vendorUserFormControls.username.hasError('required')
    ) {
      return 'username not meant to be empty'
    } else if (
      instance === 'password' &&
      this.vendorUserFormControls.password.hasError('required')
    ) {
      return 'password not meant to be empty'
    } else if (
      instance === 'firstName' &&
      this.vendorUserFormControls.firstName.hasError('required')
    ) {
      return 'first name not meant to be empty'
    } else if (
      instance === 'email' &&
      this.vendorUserFormControls.email.hasError('required')
    ) {
      return 'email not meant to be empty'
    } else if (
      instance === 'CompanyName' &&
      this.vendorUserFormControls.CompanyName.hasError('required')
    ) {
      return 'company name not meant to be empty'
    } else {
      return
    }
  }
}
