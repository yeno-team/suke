import nodemailer , { SendMailOptions , TestAccount , Transporter } from "nodemailer";
import SESTransport from "nodemailer/lib/ses-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class MailServerService {
    public transporter : nodemailer.Transporter<unknown> | null;
    public testAccount : TestAccount | null;

    private async createTestAccount() : Promise<TestAccount> {
        this.testAccount = await nodemailer.createTestAccount();
        return this.testAccount;
    }

    public async createTransport(options? : SMTPTransport | SMTPTransport.Options) : Promise<Transporter<unknown>> {
        if(!(this.testAccount)) {
            await this.createTestAccount();
        }

        this.transporter = await nodemailer.createTransport({
            ...options,
            auth : {
                user : this.testAccount.user,
                pass :  this.testAccount.pass
            }
        });
        return this.transporter;
    }

    public async sendMail(options : SendMailOptions) : Promise<SMTPTransport.SentMessageInfo> {
        if(!(this.transporter)) {
            throw new Error("Nodemailer transport has not been created.");
        }
        
        const info = await this.transporter.sendMail({
            ...options,
            from : "Yeno Team <yenoteam@example.com>",
        }) as SMTPTransport.SentMessageInfo;

        return info;
    }

}