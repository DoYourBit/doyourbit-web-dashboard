import { Component, OnInit, Input } from '@angular/core';
import { Web3Service } from 'src/app/core/web3.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent {

  public showing = false;
  public loading = false;
  public success;

  public amount;
  public account;

  constructor(
    public web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.account = this.web3Service.getAccount();
  }

  public showPopup() {
    this.showing = true;
  }

  public dismissPopup() {
    this.showing = false;
  }

  public submitDonation() {
    this.loading = true;
    this.web3Service.donate(this.amount)
      .subscribe(res => {
        this.loading = false;
        this.success = true;
      }, err => {
        console.error(err)
        this.loading = false;
        this.success = false;
      })
  }
}
