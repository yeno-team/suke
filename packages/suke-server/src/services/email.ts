import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Inject, Service } from "typedi";
import jwt from "jsonwebtoken";
import { Email, EmailData, EmailModel } from "@suke/suke-core/src/entities/Email";
import { Name } from "@suke/suke-core/src/entities/Name";
import { hideEmail } from "@suke/suke-util/src/hideEmail";
import { randomString } from "@suke/suke-util/src/randomString";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "@suke/suke-server/src/config";
import { NodeMailerService } from "./nodeMailer";

export interface DecodedEmailTokenJWT extends jwt.JwtPayload {
    t : string;
}

export interface VerificationRelatedLinkOpts {
    username : Name;
    email : Email;
    tokenAsJWT : string;
}

export interface SendEmailChangeToNewEmailOpts {
    username : Name;
    oldEmail : Email;
    newEmail : Email;
}

@Service()
export class EmailUtilService { // i don't know what do call this
    @Inject("email_jwt_secret_key")
    private secretKey : string;

    constructor(
        @Inject("NodeMailerService")
        private NodeMailerService : NodeMailerService
    ) {}    

    private getHost() : URL {
        return new URL(config.node_env === "production" ? config.production_url : "http://localhost:3000"); 
    }

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

    public async verifyVerificationToken(tokenAsJWT : string) : Promise<string> {
        const verifiedData = await jwt.verify(tokenAsJWT , this.secretKey , {
            issuer : "Suke",
            subject : "Suke Email Verification"
        }) as DecodedEmailTokenJWT;

        return verifiedData.t;
    }

    /**
     * Send a verification token to an email address.
     * @param email
     */
    public async sendVerificationLinkToEmail({ email , username , tokenAsJWT } : VerificationRelatedLinkOpts) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verifyVerificationToken(tokenAsJWT);

        const verificationLink = new URL(this.getHost().href + `account/verifyemail/${tokenAsJWT}`);
        
        return await this.NodeMailerService.sendMail({
            to : email.value,
            subject : "Suke Email Verification",
            html : `Hello, ${username.name}. <br> <br> Thanks for signing up! We just need you to verify your email address to complete setting up your account. <br> <br> <a href="${verificationLink.href}">Click here to verify your account.</a>`
        });
    }

    public async resendVerificationLinkToEmail({ username , tokenAsJWT , email } : VerificationRelatedLinkOpts) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verifyVerificationToken(tokenAsJWT);

        const verificationLink = new URL(this.getHost().href + `account/verifyemail/${tokenAsJWT}`);

        return await this.NodeMailerService.sendMail({
            to : email.value,
            subject : "Suke Email Verification",
            html : `Hello, ${username.name}. <br> <br> You've requested us to resend you a new verification link. <br> <br> <a href="${verificationLink}>Click here to verify your account.</a>`
        });
    }

    public async sendReverifyEmailAddress({ email , username , tokenAsJWT } : VerificationRelatedLinkOpts) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verifyVerificationToken(tokenAsJWT);

        const verificationLink = new URL(this.getHost().href + `account/verifyemail/${tokenAsJWT}`);

        return await this.NodeMailerService.sendMail({
            to : email.value,
            subject : "Suke Email Verification",
            html : `Hello, ${username.name}. <br> <br> You have recently changed your email address. Please re-verify your account again by clicking on the link. <br> <br> <a href="${verificationLink}">Click here to verify your account</a>.`
        });

    } 

    /**
     * Send an email update to the user's old email address when their email had been changed.
     * @param username 
     * @param oldEmail 
     * @param newEmail 
     */
    public async sendEmailChangeToNewEmail({ oldEmail , newEmail , username } : SendEmailChangeToNewEmailOpts) : Promise<SMTPTransport.SentMessageInfo> {
        return await this.NodeMailerService.sendMail({
            to : oldEmail.value,
            subject : "Suke Account Email Changed",
            html : `Hello, ${username.name}. <br> Your email address had recently been changed from ${hideEmail(oldEmail.value)} to ${hideEmail(newEmail.value)}.`
        });
    }
}

@Service()
export class EmailService {
    constructor(
        @InjectRepository(EmailModel) private emailRepository : Repository<EmailModel>
    ) {}

    public async create(email : EmailData) : Promise<EmailModel> {
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