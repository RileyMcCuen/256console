import AWS, {AWSError} from 'aws-sdk';
import {GetAccountBalanceResponse} from "aws-sdk/clients/mturk";
import {Region} from "./aws-constants";

type MTurkAccounts = { [wustlKey: string]: AWS.MTurk };
export type AccountPair = {wustlKey: string, balance: string};
export type TAccountBalances = AccountPair[];

class MTurkPool {
    private accts: MTurkAccounts = {};
    private static HitConfig(url: string): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
                    <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
                        <ExternalURL>${url}</ExternalURL>
                        <FrameHeight>0</FrameHeight>
                    </ExternalQuestion>`;
    }

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

    async getAccountBalance(wustlKey: string, acct: AWS.MTurk) {
        return new Promise<AccountPair>((resolve, reject) => {
            acct.getAccountBalance((err: AWSError, data: GetAccountBalanceResponse) => {
                if (err) {
                    resolve({wustlKey: wustlKey, balance: "Not Available."});
                } else {
                    resolve({wustlKey: wustlKey, balance: data.AvailableBalance ? data.AvailableBalance : "Not Available."});
                }
            });
        });
    }

    async getAccountBalances() {
        return this.forp(async (wustlKey, acct) => {
            return this.getAccountBalance(wustlKey, acct);
        });
    }

    async uploadHit() {

    }

    async uploadHits(urls: {[wustlKey: string]: {count: number, url: string}[]}) {
        return this.forp(async (wustlKey, acct) => {
            return new Promise<AccountPair>((resolve, reject) => {
                const urlsForStud = urls[wustlKey];
                urlsForStud.forEach(async urlCountPair => {
                    if (urlCountPair.count > 0) {
                        setTimeout(async () => {
                            acct.createHIT({ // TODO: fix this to be generalizable config
                                    AssignmentDurationInSeconds: 360,
                                    AutoApprovalDelayInSeconds: 2592000,
                                    Description: 'You will be given a scenario for a website user. Please navigate through the website to find the answer - your path is tracked as you work. When you are on the page with the answer, fill out the text box in the drop down at the top of the page and click submit. Correct answers will receive bonuses of up to $.25.',
                                    LifetimeInSeconds: (60 * 60 * 20), // 20 hours
                                    MaxAssignments: urlCountPair.count,
                                    Reward: "0.40",
                                    Title: "Information Foraging WUSTL",
                                    Question: MTurkPool.HitConfig(urlCountPair.url)
                                },
                                async (err, data) => {
                                    if (err) {
                                        console.log("ERROR: " + err);
                                    } else {
                                        console.log("DATA: " + data);
                                    }
                                    resolve({
                                        wustlKey: wustlKey,
                                        balance: (await acct.getAccountBalance().promise()).AvailableBalance as string,
                                    });
                                });
                        },100);
                    }
                });
            });
        });
    }

    async cancelHits() {
        return this.forp(async (wustlKey, acct) => {
            return new Promise<AccountPair>(async (resolve, reject) => {
                const hits = await acct.listHITs().promise();
                hits.HITs?.forEach(hit => {
                    setTimeout(() => {
                        acct.updateExpirationForHIT({
                            ExpireAt: new Date(),
                            HITId: hit.HITId as string
                        }, (err, data) => {
                            if (err) {
                                console.log("ERROR: " + err);
                            } else {
                                console.log("DATA: " + data);
                            }
                        });
                    },100);
                });
            });
        });
    }
}

const MTPool = new MTurkPool();

export default MTPool;
