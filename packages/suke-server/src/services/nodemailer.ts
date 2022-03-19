import nodemailer , { SendMailOptions , TestAccount, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NodeMailerService {
    public transporter! : nodemailer.Transporter<unknown> | null;
    public testAccount! : TestAccount | null;

    public async setTestAccount() : Promise<TestAccount> {
        this.testAccount = await nodemailer.createTestAccount();
        return this.testAccount;
    }

    public async setTransport(options? : SMTPTransport | SMTPTransport.Options) : Promise<Transporter<unknown>> {
        if(!(options) && (this.testAccount)) {
            this.transporter = nodemailer.createTransport({
                host : "smtp.ethereal.email",
                port : 587,
                secure : false,
                auth : {
                    user : this.testAccount.user,
                    pass : this.testAccount.pass
                }
            });
        } else {
            this.transporter = await nodemailer.createTransport(options);
        }

        return this.transporter;
    }

    public async sendMail(options : SendMailOptions) : Promise<SMTPTransport.SentMessageInfo> {
        if(!(this.transporter)) {
            throw new Error("Nodemailer transport has not been created.");
        }
        
        const info = await this.transporter.sendMail({
            ...options,
            from : '"Suke Team" <admin@suke.app>',
        }) as SMTPTransport.SentMessageInfo;

        if(this.testAccount) {
            console.log(`Sent a test email : ${nodemailer.getTestMessageUrl(info)}`);
        }

        return info;
    }

}