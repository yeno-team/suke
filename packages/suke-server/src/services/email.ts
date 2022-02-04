import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Inject, Service } from "typedi";
import jwt from "jsonwebtoken";
import { Email , EmailModel} from "@suke/suke-core/src/entities/Email";
import { Name } from "@suke/suke-core/src/entities/Name";
import { randomString } from "@suke/suke-util/src/randomString";
import { NodeMailerService } from "./nodeMailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface DecodedEmailTokenJWT extends jwt.JwtPayload {
    t : string;
}
@Service()
export class EmailUtilService { // i don't know what do call this
    @Inject("email_jwt_secret_key")
    private secretKey : string;

    constructor(
        @Inject("NodeMailerService")
        private NodeMailerService : NodeMailerService
    ) {}

    public createVerificationToken() : string {
        return `${randomString(128)}-${randomString(128)}-${randomString(128)}`;
    }

    public async signVerificationToken(token : string) : Promise<string> {
        const data = await jwt.sign(
            { 
                t : token 
            }, 
            this.secretKey , 
            {
                issuer : "Suke",
                expiresIn : "5m",
                subject : "Suke Email Verification"
            }
        );
        return data;
    }

    public async verifyVerificationToken(tokenAsJWT : string) : Promise<DecodedEmailTokenJWT> {
        const verifiedData = await jwt.verify(tokenAsJWT , this.secretKey , {
            issuer : "Suke",
            subject : "Suke Email Verification"
        }) as DecodedEmailTokenJWT;

        return verifiedData;
    }

    /**
     * Send a verification token to an email address.
     * @param email
     */
    public async sendVerificationLinkToEmail(username : Name , email : string , tokenAsJWT : string) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verifyVerificationToken(tokenAsJWT);

        return await this.NodeMailerService.sendMail({
            to : email,
            subject : "Suke Email Verification",
            html : `Hello, ${username}. Thanks for signing up! We just need you to verify your email addresse to complete setting up your account. <a> ${tokenAsJWT} </a>.`
        });
    }

    public async resendVerificationLinkToEmail(username : Name , email : string , tokenAsJWT : string) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verifyVerificationToken(tokenAsJWT);

        return await this.NodeMailerService.sendMail({
            to : email,
            subject : "Suke Email Verification",
            html : `Hello , ${username}. You've requested us to resend you a new verification link.`
        });
    }

    /**
     * Send an email update to the user's old email address when their email had been changed.
     * @param username 
     * @param oldEmail 
     * @param newEmail 
     */
    public async sendUpdateStatusToEmail(username : string , oldEmail : string , newEmail : string) : Promise<SMTPTransport.SentMessageInfo> {
        return await this.NodeMailerService.sendMail({
            to : oldEmail,
            subject : "Suke Account Email Changed",
            html : `Hello, ${username}. Your email address had recently been changed from ${oldEmail} to ${newEmail}.`
        });
    }
}

@Service()
export class EmailDBService {
    constructor(
        @InjectRepository(EmailModel) private emailRepository : Repository<EmailModel>
    ) {}

    public async create(email : Email) : Promise<EmailModel> {
        const newEmail = new EmailModel();

        newEmail.verificationToken = email.verificationToken;
        newEmail.currentEmail = email.currentEmail;
        newEmail.previousEmail = email.previousEmail;
        newEmail.originalEmail = email.originalEmail;

        return newEmail.save();
    }

    public async update(model : EmailModel) : Promise<EmailModel> {
        return await this.emailRepository.save(model);
    }

    public async findByVerificationToken(token : string) : Promise<EmailModel | undefined> {
        return await this.emailRepository.findOne({
            relations : ["user"],
            where : {
                verificationToken : token
            }
        });
    }

    public async findByUsername(username : Name) : Promise<EmailModel | undefined> {
        return await this.emailRepository.findOne({
            relations : ["user"],
            where : {
                user : {
                    name : username.name
                }
            }
        });
    }
}