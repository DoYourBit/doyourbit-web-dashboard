import { Injectable } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { delay, map, catchError } from 'rxjs/internal/operators';
import { Web3Service } from 'src/app/core/web3.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import TicketEntity from 'src/app/core/entity/ticket.entity';
import ProductEntity from 'src/app/core/entity/product.entity';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(
        public http: HttpClient,
        public web3Service: Web3Service
    ) { }

    public getTicketByTxHash(txHash: string) {
        return this.http.get(`${environment.apiUrl}/tickets?tx_hash=${txHash}`)
            .pipe(
                map((res: any) => {
                    return new TicketEntity({
                        id: res.id,
                        transactionHash: res.tx_hash,
                        buyer: {
                          name: res.buyer
                        },
                        products: res.products.map(product => {
                          return new ProductEntity({
                            id: product.Product.product_id,
                            name: product.Product.name,
                            price: product.Product.price,
                            count: product.amount
                          })
                        }),
                        date: new Date(res.timestamp)
                      })
                })
            )
    }

    public getSubsidiaryList() {
        return this.web3Service.getSubsidies()
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(err => {
                    console.error(err)
                    return of([])
                })
            )
    }

    public getTransactions() {
        return this.web3Service.getTransactions()
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(err => {
                    console.error(err)
                    return of([])
                })
            )
    }

    public getInOutList() {
        return forkJoin([
            this.getDonationsList(),
            this.getRedeems()
        ]).pipe(
            map(res => {
                let donations = res[0];
                let redeems = res[1];

                let result = donations.concat(redeems);
                result = result.sort((a, b) => {
                    return b.date.getTime() - a.date.getTime();
                })

                return result;
            })
        )
    }

    public getDonationsList() {
        return this.web3Service.getDonations()
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(err => {
                    console.error(err)
                    return of([])
                })
            )
    }

    public getRedeems() {
        return this.web3Service.getRedeems()
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(err => {
                    console.error(err)
                    return of([])
                })
            )
    }

    public getChartData() {
        return of({
            chartLabel: this.getDataLabels(42, [
                '2012',
                '2013',
                '2014',
                '2015',
                '2016',
                '2017',
                '2018',
            ]),
            linesData: [
                [
                    190, 269, 327, 366, 389, 398,
                    396, 387, 375, 359, 343, 327,
                    312, 298, 286, 276, 270, 268,
                    265, 258, 247, 234, 220, 204,
                    188, 172, 157, 142, 128, 116,
                    106, 99, 95, 94, 92, 89, 84,
                    77, 69, 60, 49, 36, 22,
                ],
                [
                    265, 307, 337, 359, 375, 386,
                    393, 397, 399, 397, 390, 379,
                    365, 347, 326, 305, 282, 261,
                    241, 223, 208, 197, 190, 187,
                    185, 181, 172, 160, 145, 126,
                    105, 82, 60, 40, 26, 19, 22,
                    43, 82, 141, 220, 321,
                ],
                [
                    9, 165, 236, 258, 244, 206,
                    186, 189, 209, 239, 273, 307,
                    339, 365, 385, 396, 398, 385,
                    351, 300, 255, 221, 197, 181,
                    170, 164, 162, 161, 159, 154,
                    146, 135, 122, 108, 96, 87,
                    83, 82, 82, 82, 82, 82, 82,
                ],
            ],
        })
    }

    private getDataLabels(nPoints: number, labelsArray: string[]): string[] {
        const labelsArrayLength = labelsArray.length;
        const step = Math.round(nPoints / labelsArrayLength);

        return Array.from(Array(nPoints)).map((item, index) => {
            const dataIndex = Math.round(index / step);

            return index % step === 0 ? labelsArray[dataIndex] : '';
        });
    }

}
