import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/core/web3.service';
import { DashboardService } from './dashboard.service';
import { NbDialogService } from '@nebular/theme';
import { TicketDetailComponent } from 'src/app/shared/components/ticket-detail/ticket-detail.component';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

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
  public donationsList = [];
  public chartData = {
    chartLabel: [],
    linesData: []
  };

  constructor(
    public dashboardService: DashboardService,
    public web3Service: Web3Service,
    public dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.fetchData();
    }, 3500);
  }

  public fetchData() {
    forkJoin([
      this.web3Service.getTotalSupply(),
      this.web3Service.getDonationCenterBalance(),
      this.web3Service.getMovingBalance(),
      this.dashboardService.getSubsidiaryList(),
      this.dashboardService.getTransactions(),
      this.dashboardService.getChartData(),
      this.dashboardService.getInOutList(),
      this.dashboardService.getDonationsList()
    ]).subscribe((result: any[]) => {
      this.totalSupply = result[0].toFixed(2) + '€';
      this.donationBalance = result[1].toFixed(2) + '€';
      this.movingBalance = result[2].toFixed(2) + '€';
      this.subsidiaryList = result[3];
      this.transactionList = result[4];
      this.chartData = result[5];
      this.inOutList = result[6];
      this.donationsList = result[7]

      this.calculateChartData();
    })
  }

  public onTransactionClick(transaction) {
    this.dashboardService.getTicketByTxHash(transaction.transactionHash)
      .subscribe(res => {
        this.dialogService.open(TicketDetailComponent, {
          context: {
            ticket: res
          }
        });
      })
  }

  private calculateChartData() {
    let days = [
      moment().subtract(6, 'days').startOf('day'),
      moment().subtract(5, 'days').startOf('day'),
      moment().subtract(4, 'days').startOf('day'),
      moment().subtract(3, 'days').startOf('day'),
      moment().subtract(2, 'days').startOf('day'),
      moment().subtract(1, 'days').startOf('day'),
      moment().startOf('day')
    ]

    let transactions = this.getTransactionsCount(days, this.transactionList);
    let subsidies = this.getSubsidyCount(days, this.subsidiaryList);
    let donations = this.getDonationsCount(days, this.donationsList);

    this.chartData = {
      chartLabel: this.getDataLabels(7, days.map(day => day.format("ddd"))),
      linesData: [
        transactions,
        subsidies,
        donations,
      ],
    }
  }

  private getDataLabels(nPoints: number, labelsArray: string[]): string[] {
    const labelsArrayLength = labelsArray.length;
    const step = Math.round(nPoints / labelsArrayLength);

    return Array.from(Array(nPoints)).map((item, index) => {
      const dataIndex = Math.round(index / step);

      return index % step === 0 ? labelsArray[dataIndex] : '';
    });
  }

  private getTransactionsCount(days, transactions: any[]) {
    return days.map(day => {
      let count = 0;
  
      transactions.map(transaction => {
        if (moment(transaction.date).isSame(day, 'day')) {
          count += parseFloat(transaction.amount);
        }
      })

      return count;
    })
  }

  private getSubsidyCount(days, subsidies: any[]) {
    return days.map(day => {
      let count = 0;
  
      subsidies.map(subsidy => {
        if (moment(subsidy.date).isSame(day, 'day')) {
          count += parseFloat(subsidy.amount);
        }
      })

      return count;
    })
  }

  private getDonationsCount(days, donations: any[]) {
    return days.map(day => {
      let count = 0;
  
      donations.map(donation => {
        if (moment(donation.date).isSame(day, 'day')) {
          count += parseFloat(donation.amount);
        }
      })

      return count;
    })
  }

}
