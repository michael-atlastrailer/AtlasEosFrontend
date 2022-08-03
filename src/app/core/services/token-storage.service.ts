import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  static getBranch(): any {
    throw new Error('Method not implemented.')
  }
  constructor() {}

  public storeSocketId(socketId: string) {
    window.localStorage.setItem('socketid', socketId)
  }

  switchFromVendorToDealer(data: any) {
    window.localStorage.setItem('dealerData', JSON.stringify(data))
    window.localStorage.setItem('switchType', 'vendor-to-dealer')

    let vendorCode = this.getUser().vendor_code
    window.localStorage.setItem('vendor', vendorCode)

    let dealerCode = data.dealer_code
    let userData = this.getUser()
    userData.dealer_code = dealerCode
    userData.account_id = dealerCode

    /// window.localStorage.removeItem('user')
    window.localStorage.setItem('user', JSON.stringify(userData))
  }

  switchFromDealerToVendor() {
    window.localStorage.setItem('switchType', 'dealer-to-vendor')
    window.localStorage.removeItem('dealerData')
    let userData = this.getUser()
    userData.dealer_code = null
    userData.account_id = null

    window.localStorage.removeItem('vendor')
    window.localStorage.setItem('user', JSON.stringify(userData))
  }

  checkSwitch() {
    const switchType = localStorage.getItem('switchType')
    return switchType !== null ? true : false
  }

  getSwitchType() {
    const switchType = localStorage.getItem('switchType')
    return switchType
  }

  public getSocketId() {
    const socketId = window.localStorage.getItem('socketid')
    if (socketId) {
      return socketId
    }
    return ''
  }

  public getToken(): string | null {
    return window.localStorage.getItem('token')
  }

  public save(data: any, token: any): void {
    window.localStorage.removeItem('user')
    window.localStorage.setItem('user', JSON.stringify(data))
    window.localStorage.setItem('token', token)

    // window.localStorage.removeItem('token');
    // if (data.admin) {
    //   window.localStorage.setItem('admin', JSON.stringify(data.admin));
    // }

    // if (data.dealer) {
    //             window.localStorage.setItem(
    //               'dealer',
    //               JSON.stringify(data.dealer)
    //             );

    // }
  }

  updateStoreUser(dealer: any) {
    window.localStorage.removeItem('dealer')
    window.localStorage.setItem('dealer', JSON.stringify(dealer))
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    return user !== null && token !== null ? true : false
  }

  signOut(): void {
    window.localStorage.clear()
  }

  getUser() {
    const dealer = window.localStorage.getItem('user')
    if (dealer) {
      return JSON.parse(dealer)
    }
    return {}
  }

  public permissions() {
    const permissions = window.localStorage.getItem('permissions')
    if (permissions) {
      return JSON.parse(permissions)
    }
    return {}
  }
}
