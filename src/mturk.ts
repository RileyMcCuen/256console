import AWS, {AWSError} from 'aws-sdk';
import {GetAccountBalanceResponse} from "aws-sdk/clients/mturk";
import {Region} from "./aws-constants";

type MTurkAccounts = { [wustlKey: string]: AWS.MTurk };
export type AccountPair = {wustlKey: string, balance: string};
export type TAccountBalances = AccountPair[];

class MTurkPool {
    private accts: MTurkAccounts = {};

    add(wustlKey: string, accessID: string, accessSecret: string) {
        this.addAccount(wustlKey, new AWS.MTurk({
            region: Region,
            endpoint: 'https://mturk-requester-sandbox.us-east-1.amazonaws.com',
            credentials: {
                accessKeyId: accessID,
                secretAccessKey: accessSecret
            }
        }));
    }

    addAccount(wustlKey: string, acct: AWS.MTurk) {
        this.accts[wustlKey] = acct;
    }

    private forp<E>(fun: (wustlKey: string, acct: AWS.MTurk) => E): E[] {
        return Object.keys(this.accts).map(key => {
            return fun(key, this.accts[key]);
        });
    }

    async getAccountBalances() {
        return this.forp(async (wustlKey, acct) => {
            return new Promise<AccountPair>((resolve, reject) => {
                acct.getAccountBalance((err: AWSError, data: GetAccountBalanceResponse) => {
                    if (err) {
                        resolve({wustlKey: wustlKey, balance: "Not Available."});
                    } else {
                        resolve({wustlKey: wustlKey, balance: data.AvailableBalance ? data.AvailableBalance : "Not Available."});
                    }
                });
            });
        });
    }

    async uploadHits() {
        return this.forp(async (wustlKey, acct) => {
            return new Promise<AccountPair>((resolve, reject) => {
                acct.createHIT({
                    AssignmentDurationInSeconds: 1000000,
                    AutoApprovalDelayInSeconds: 1000000,
                    Description: 'This is a sandbox test hit from the 256 console.',
                    LifetimeInSeconds: 10000000000,
                    MaxAssignments: 10,
                    Reward: "0.01",
                    Title: "This is a hit for 256 console testing",
                    Question: ""
                    },
                    (err, data) => {

                });
                acct.getAccountBalance((err: AWSError, data: GetAccountBalanceResponse) => {
                    if (err) {
                        resolve({wustlKey: wustlKey, balance: "Not Available."});
                    } else {
                        resolve({wustlKey: wustlKey, balance: data.AvailableBalance ? data.AvailableBalance : "Not Available."});
                    }
                });
            });
        });
    }
}

const MTPool = new MTurkPool();

export default MTPool;
