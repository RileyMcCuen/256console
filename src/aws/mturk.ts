import AWS, {AWSError} from 'aws-sdk';
import {GetAccountBalanceResponse} from "aws-sdk/clients/mturk";
import {Region} from "./aws-constants";
import {Data, MTurkMode} from "../redux/actions";

type MTurkAccounts = { [wustlKey: string]: AWS.MTurk };
export type AccountPair = {wustlKey: string, balance: string};
export type TAccountBalances = AccountPair[];

type AWSTableError = {
    wustlKey: string,
    error: string,
    code: string,
    message: string,
};
class MTurkPool {
    private accts: MTurkAccounts = {};
    private sandboxAccts: MTurkAccounts = {};
    private realAccts: MTurkAccounts = {};
    private static HitConfig(url: string): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
                    <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
                        <ExternalURL>${url}</ExternalURL>
                        <FrameHeight>0</FrameHeight>
                    </ExternalQuestion>`;
    }

    add(wustlKey: string, accessID: string, accessSecret: string) {
        this.addRealAccount(wustlKey, new AWS.MTurk({
            region: Region,
            endpoint: 'https://mturk-requester.us-east-1.amazonaws.com',
            credentials: {
                accessKeyId: accessID,
                secretAccessKey: accessSecret
            }
        }));
        this.addSandboxAccount(wustlKey, new AWS.MTurk({
            region: Region,
            endpoint: 'https://mturk-requester-sandbox.us-east-1.amazonaws.com',
            credentials: {
                accessKeyId: accessID,
                secretAccessKey: accessSecret
            }
        }));
    }

    addRealAccount(wustlKey: string, acct: AWS.MTurk) {
        this.realAccts[wustlKey] = acct;
    }

    addSandboxAccount(wustlKey: string, acct: AWS.MTurk) {
        this.sandboxAccts[wustlKey] = acct;
    }

    private setSandbox(sandbox: MTurkMode) {
        if (sandbox === MTurkMode.SANDBOX) {
            this.accts = this.sandboxAccts;
        } else {
            this.accts = this.realAccts;
        }
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

    async getAccountBalances(sandbox: MTurkMode) {
        this.setSandbox(sandbox);
        return this.forp(async (wustlKey, acct) => {
            return this.getAccountBalance(wustlKey, acct);
        });
    }

    async uploadHit() {

    }

    async uploadHits(urls: {[wustlKey: string]: {count: number, url: string, price: string}[]}, sandbox: MTurkMode) {
        this.setSandbox(sandbox);
        return this.forp(async (wustlKey, acct) => {
            return new Promise<AccountPair | AWSTableError>((resolve, reject) => {
                const urlsForStud = urls[wustlKey];
                if (urlsForStud) {
                    urlsForStud.forEach(async urlCountPair => {
                        // console.log(wustlKey + ' ' + urlCountPair.url + ' ' + urlCountPair.count);
                        if (urlCountPair.count > 0) {
                            setTimeout(async () => {
                                acct.createHIT({ // TODO: fix this to be generalizable config
                                        AssignmentDurationInSeconds: 360,
                                        AutoApprovalDelayInSeconds: 2592000,
                                        Description: 'You will be given a scenario for a website user. Please navigate through the website to find the answer - your path is tracked as you work. When you are on the page with the answer, fill out the text box in the drop down at the top of the page and click submit. Correct answers will receive bonuses of up to $.25.',
                                        LifetimeInSeconds: (60 * 60 * 20), // 20 hours
                                        MaxAssignments: urlCountPair.count,
                                        Reward: urlCountPair.price,
                                        Title: "Information Foraging WUSTL",
                                        Question: MTurkPool.HitConfig(urlCountPair.url)
                                    },
                                    async (err, data) => {
                                        if (err) {
                                            console.log("ERROR: " + err);
                                            resolve({
                                                wustlKey: wustlKey,
                                                error: err.name,
                                                code: err.code,
                                                message: err.message
                                            });
                                        } else {
                                            console.log("DATA: " + data);
                                            resolve({
                                                wustlKey: wustlKey,
                                                balance: (await acct.getAccountBalance().promise()).AvailableBalance as string,
                                            });
                                        }
                                    });
                            },100);
                        }
                    });
                }
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

    async payHits(data: Data) {
        for (let i = 0; i < data.values.length; i++) {
            const row = data.values[i];
            const acct = this.accts[row[0]];
            let resp;
            try {
                if (acct != undefined) {
                    switch (row[3]) {
                        case 'approve':
                            resp = await acct.approveAssignment({
                                AssignmentId: row[2],
                            }).promise();
                            console.log(resp.$response);
                            break;
                        case 'reject':
                            resp = await acct.rejectAssignment({
                                AssignmentId: row[2],
                                RequesterFeedback: 'The log of your actions on the website and the written response did not show substantial effort in completing this task and therefore do not warrant payment.'
                            }).promise();
                            console.log(resp.$response);
                            break;
                        case 'bonus':
                            resp = await acct.approveAssignment({
                                AssignmentId: row[2],
                            }).promise();
                            console.log(resp.$response);
                            resp = await acct.sendBonus({
                                AssignmentId: row[2],
                                WorkerId: row[1],
                                BonusAmount: '0.10',
                                Reason: 'Your work showed an honest effort to complete the task and you either found the correct answer or put in strong logical thought in your actions. Thank your for your time, and we hope this bonus makes the HIT feel more worthwhile.',
                                UniqueRequestToken: ''
                            }).promise();
                            console.log(resp.$response);
                            break;
                        default:
                            console.log(row);
                            console.log('^^ the above row did not contain a valid action ^^');
                            break;
                    }
                } else {
                    console.log(row);
                    console.log('^^ row was undefined ^^');
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    async getStatuses(sandbox: MTurkMode) {
        this.setSandbox(sandbox);
        let data = new Data(['WUSTL Key', 'Awaiting Acceptance', 'In Progress', 'Completed'], []);
        let promises = this.forp(async (key: string, acct: AWS.MTurk) => {
            let entry = [key, 0, 0, 0];
            const hits = (await acct.listHITs().promise()).HITs;
            if (hits && hits.length > 0) {
                const as = hits.map(hit => hit.MaxAssignments ? hit.MaxAssignments : 0).reduce((prev: number, cur: number) => prev + cur, 0);
                hits.forEach(hit => {
                    const available = hit.NumberOfAssignmentsAvailable ? hit.NumberOfAssignmentsAvailable : 0;
                    const pending = hit.NumberOfAssignmentsPending ? hit.NumberOfAssignmentsPending : 0;
                    let completed = hit.MaxAssignments ? hit.MaxAssignments : 0;
                    completed -= (available + pending);
                    completed = Math.max(completed, 0);
                    switch (hit.HITStatus) {
                        case "Assignable":
                            (entry[1] as number) += available;
                            break;
                        case "Unassignable":
                            (entry[2] as number) += pending;
                            break;
                        case "Reviewable":
                            (entry[3] as number) += completed;
                            break;
                        default:
                            break;
                    }
                });
            }
            let sEntry = entry.map(item => item + '');
            data.values.push(sEntry);
            return true;
        });
        if (promises) {
            for (let promise of promises) {
                await promise;
            }
        }
        return data;
    }
}

const MTPool = new MTurkPool();

export default MTPool;
