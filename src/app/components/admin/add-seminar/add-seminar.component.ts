import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-add-seminar',
  templateUrl: './add-seminar.component.html',
  styleUrls: ['./add-seminar.component.scss'],
})
export class AddSeminarComponent implements OnInit {
  seminarForm!: FormGroup;
  manualChecker = false;
  saveBtnStatus = true;

  allVendor: any;

  saveVendorCode!: string;
  selectedStartTime = '';
  selectedEndTime = '';
  today = new Date();
  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService
  ) {}

  // defaultValue = { hour: 13, minute: 30 }

  // timeChangeHandler(event: Event) {
  //   console.log(event)
  // }

  // invalidInputHandler() {
  //   // some error handling
  // }

  ngOnInit(): void {
    this.buildProductForm();
    this.getVendors();
  }

  timeChangeHandler(data: any) {
    // this.selectedStartTime = data._formattedValueString
    console.log(data._formattedValueString);
    if (data._id == 'startTimePicker') {
      this.selectedStartTime = data._formattedValueString;
    }

    if (data._id == 'endtimePicker') {
      this.selectedEndTime = data._formattedValueString;
    }

    console.log(data);
  }

  assignVendor(data: any) {
    console.log(data.value);
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index];
      if (vendor.vendor_name == data.value) {
        this.seminarForm.value.vendor = vendor.vendor_code;
        this.saveVendorCode = vendor.vendor_code;
        this.seminarForm.value.vendorName = vendor.vendor_name;
      }
    }
  }

  getVendors() {
    this.postData
      .httpGetRequest('/get-all-vendors')
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

  submit() {
    console.log(this.seminarForm.value);
    if (this.seminarForm.status == 'VALID') {
      this.manualChecker = false;
      this.saveBtnStatus = false;

      this.seminarForm.value.vendorCode = this.saveVendorCode;
      this.seminarForm.value.startTime = this.selectedStartTime;
      this.seminarForm.value.stopTime = this.selectedEndTime;

      this.postData
        .httpPostRequest('/create-seminar', this.seminarForm.value)
        .then((result: any) => {
          this.saveBtnStatus = true;
          if (result.status) {
            this.seminarForm.reset();
            this.toastr.success(result.message, `Successful`);
          } else {
            this.toastr.error(result.message, 'Try again');
          }
        })
        .catch((err) => {
          this.saveBtnStatus = true;

          this.toastr.error('Try again', 'Something went wrong');
        });
    } else {
      this.manualChecker = true;
    }
  }

  resetForm() {
    this.seminarForm.reset();
  }

  get productFormControls() {
    return this.seminarForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'topic' &&
      this.productFormControls.topic.hasError('required')
    ) {
      return 'enter seminar topic';
    } else if (
      instance === 'vendorName' &&
      this.productFormControls.vendorName.hasError('required')
    ) {
      return 'select the vendor';
    } else if (
      instance === 'startTime' &&
      this.productFormControls.startTime.hasError('required')
    ) {
      return 'select the start time';
    } else if (
      instance === 'stopTime' &&
      this.productFormControls.stopTime.hasError('required')
    ) {
      return 'select the stop time';
    } else if (
      instance === 'seminarDate' &&
      this.productFormControls.seminarDate.hasError('required')
    ) {
      return 'select the seminar date';
    } else if (
      instance === 'link' &&
      this.productFormControls.link.hasError('required')
    ) {
      return 'enter the link';
    } else {
      return;
    }
  }

  buildProductForm(): void {
    this.seminarForm = this.fb.group({
      topic: ['', [Validators.required]],
      link: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      stopTime: ['', [Validators.required]],
      seminarDate: ['', [Validators.required]],
      vendorName: ['', [Validators.required]],
    });
  }
}
