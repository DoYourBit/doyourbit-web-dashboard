import { Injectable, Inject } from '@angular/core';
import Web3 from "web3";
import { WEB3 } from './web3.config';
import { from, Observable, of, forkJoin } from 'rxjs';
import { delay, map, catchError, switchMap } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private WEB3_ACCOUNT_PRIVATE_KEY = "WEB3_ACCOUNT_PRIVATE_KEY";

  private tokenContract;
  private donationCenterContract;

  private currentAccount = null;

  constructor(@Inject(WEB3) private web3: Web3) {
    this.tokenContract = new web3.eth.Contract(JSON.parse(environment.tokenContractAbi), environment.tokenContractAddress)
    this.donationCenterContract = new web3.eth.Contract(JSON.parse(environment.donationCenterContractAbi), environment.donationCenterContractAddress)
  }

  public getAccount() {
    if (this.currentAccount) return this.currentAccount;

    let privateKey = localStorage.getItem(this.WEB3_ACCOUNT_PRIVATE_KEY);
    if (privateKey) {
      this.currentAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
      return this.currentAccount;
    }

    return null;
  }

  public getBalance(): Observable<number> {
    return from(this.tokenContract.methods.balanceOf(this.getAccount()).call())
      .pipe(
        map((res: number) => res / 100)
      );
  }

  public donate(amount: number) {
    return from(this.send(this.donationCenterContract, this.donationCenterContract.methods.donate(amount * 100)))
      .pipe(
        switchMap(res => {
          console.log(res)
          return from(this.waitTransaction(res.transactionHash));
        })
      )
  }

  public getDonations() {
    return from(this.donationCenterContract.getPastEvents('Donation', {
      fromBlock: 0,
      toBlock: 'latest'
    })).pipe(
      map((res: any[]) => {
        if (res) {
          return res.map(event => {
            return {
              type: 'donation',
              address: event.returnValues[0],
              amount: (event.returnValues[1] / 100).toFixed(2),
              date: new Date(event.returnValues[2] * 1000)
            }
          })
        } else {
          throw new Error('No events')
        }
      }),
      map((res: any[]) => {
        return res.filter(event => {
          return event.address !== "0x0000000000000000000000000000000000000000" && event.address !== this.donationCenterContract.options.address;
        })
      })
    );
  }

  public getSubsidies() {
    return from(this.donationCenterContract.getPastEvents('Subsidy', {
      fromBlock: 0,
      toBlock: 'latest'
    })).pipe(
      map((res: any[]) => {
        if (res) {
          return res.map(event => {
            return {
              address: event.returnValues[0],
              amount: (event.returnValues[1] / 100).toFixed(2),
              date: new Date(event.returnValues[2] * 1000)
            }
          })
        } else {
          throw new Error('No events')
        }
      }),
      map((res: any[]) => {
        return res.filter(event => {
          return event.address !== "0x0000000000000000000000000000000000000000" && event.address !== this.donationCenterContract.options.address;
        })
      })
    );
  }

  public getRedeems() {
    return from(this.donationCenterContract.getPastEvents('Collection', {
      fromBlock: 0,
      toBlock: 'latest'
    })).pipe(
      map((res: any[]) => {
        if (res) {
          return res.map(event => {
            return {
              type: 'redeem',
              address: event.returnValues[0],
              amount: (event.returnValues[1] / 100).toFixed(2),
              date: new Date(event.returnValues[2] * 1000)
            }
          })
        } else {
          throw new Error('No events')
        }
      }),
      map((res: any[]) => {
        return res.filter(event => {
          return event.address !== "0x0000000000000000000000000000000000000000" && event.address !== this.donationCenterContract.options.address;
        })
      })
    );
  }

  public getTransactions() {
    return from(this.tokenContract.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    })).pipe(
      map((res: any[]) => {
        if (res) {
          return res.map(event => {
            return {
              buyer: event.returnValues[0],
              seller: event.returnValues[1],
              amount: (event.returnValues[2] / 100).toFixed(2),
              transactionHash: event.transactionHash,
              date: new Date()
            }
          })
        } else {
          throw new Error('No events')
        }
      }),
      map((res: any[]) => {
        return res.filter(event => {
          return event.buyer !== "0x0000000000000000000000000000000000000000" && 
            event.seller !== "0x0000000000000000000000000000000000000000" &&
            event.buyer !== this.donationCenterContract.options.address &&
            event.seller !== this.donationCenterContract.options.address;
        })
      })
    );
  }
  
  public getTotalSupply() {
    return from(this.tokenContract.methods.totalSupply().call())
      .pipe(
        map((res: number) => res / 100)
      );
  }

  public getDonationCenterBalance() {
    return from(this.tokenContract.methods.balanceOf(this.donationCenterContract.options.address).call())
      .pipe(
        map((res: number) => res / 100)
      );
  }

  public getMovingBalance() {
    return forkJoin([
      this.getTotalSupply(),
      this.getDonationCenterBalance()
    ]).pipe(
      map(res => {
        let totalSupply = res[0];
        let balance = res[1];

        return totalSupply - balance;
      })
    )
  }

  private async send(contract, tx) {
    let signedTx = await this.signTransaction(contract, tx);
    return this.sendTransaction(signedTx);
  }

  private async signTransaction(contract, tx) {
    const encodedABI = tx.encodeABI();
    return await this.web3.eth.accounts.signTransaction(
      {
        data: encodedABI,
        from: this.getAccount(),
        gas: 2000000,
        to: contract.options.address,
      },
      localStorage.getItem(this.WEB3_ACCOUNT_PRIVATE_KEY)
    );
  }

  private sendTransaction(signedTx) {
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  public waitTransaction(txnHash: string | string[], options: any = null): Promise<any> {
    const interval = options && options.interval ? options.interval : 500;
    const blocksToWait = options && options.blocksToWait ? options.blocksToWait : 1;
    var transactionReceiptAsync = async (txnHash, resolve, reject) => {
      try {
        var receipt = this.web3.eth.getTransactionReceipt(txnHash);
        if (!receipt) {
          setTimeout(() => {
            transactionReceiptAsync(txnHash, resolve, reject);
          }, interval);
        } else {
          if (blocksToWait > 0) {
            var resolvedReceipt = await receipt;
            if (!resolvedReceipt || !resolvedReceipt.blockNumber) setTimeout(() => {
              transactionReceiptAsync(txnHash, resolve, reject);
            }, interval);
            else {
              try {
                var block = await this.web3.eth.getBlock(resolvedReceipt.blockNumber)
                var current = await this.web3.eth.getBlock('latest');
                if (current.number - block.number >= blocksToWait) {
                  var txn = await this.web3.eth.getTransaction(txnHash)
                  if (txn.blockNumber != null) resolve(resolvedReceipt);
                  else reject(new Error('Transaction with hash: ' + txnHash + ' ended up in an uncle block.'));
                }
                else setTimeout(() => {
                  transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
              }
              catch (e) {
                setTimeout(() => {
                  transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
              }
            }
          }
          else resolve(receipt);
        }
      } catch (e) {
        reject(e);
      }
    };

    // Resolve multiple transactions once
    if (Array.isArray(txnHash)) {
      var promises = [];
      txnHash.forEach((oneTxHash) => {
        promises.push(this.waitTransaction(oneTxHash, options));
      });
      return Promise.all(promises);
    } else {
      return new Promise((resolve, reject) => {
        transactionReceiptAsync(txnHash, resolve, reject);
      });
    }
  };

  public isSuccessfulTransaction(receipt: any): boolean {
    if (receipt.status == '0x1' || receipt.status == 1) {
      return true;
    } else {
      return false;
    }
  }
}
