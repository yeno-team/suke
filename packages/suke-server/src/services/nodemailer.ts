import nodemailer , { SendMailOptions , Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NodeMailerService {
    public transporter : nodemailer.Transporter<unknown> | null;

    public async createTransport(options? : SMTPTransport | SMTPTransport.Options) : Promise<Transporter<unknown>> {
        this.transporter = await nodemailer.createTransport(options);
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

        return info;
    }

}