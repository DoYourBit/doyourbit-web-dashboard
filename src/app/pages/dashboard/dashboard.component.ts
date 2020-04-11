import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/core/web3.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public totalSupply: string;
  public donationBalance: string;
  public movingBalance: string;

  public subsidiaryList = [];
  public inOutList = [];
  public transactionList = [];
  public chartData;

  constructor(
    public dashboardService: DashboardService,
    public web3Service: Web3Service
  ) { }

  ngOnInit(): void {
    this.web3Service.getTotalSupply()
      .subscribe(res => {
        this.totalSupply = res.toFixed(2) + '€';
      })

    this.web3Service.getDonationCenterBalance()
      .subscribe(res => {
        this.donationBalance = res.toFixed(2) + '€';
      })

    this.web3Service.getMovingBalance()
      .subscribe(res => {
        this.movingBalance = res.toFixed(2) + '€';
      })

    this.dashboardService.getSubsidiaryList()
      .subscribe(res => {
        this.subsidiaryList = res;
      })

    this.dashboardService.getTransactions()
      .subscribe(res => {
        this.transactionList = res;
      })

    this.dashboardService.getChartData()
      .subscribe(res => {
        this.chartData = res;
      })

    this.dashboardService.getInOutList()
      .subscribe(res => {
        this.inOutList = res;
      })
  }

}
