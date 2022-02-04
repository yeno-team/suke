import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Inject, Service } from "typedi";
import { NodeMailerService } from "./nodeMailer";
import jwt from "jsonwebtoken";
import { Email , EmailModel} from "@suke/suke-core/src/entities/Email";
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

    public async sign_verification_token(token : string) : Promise<string> {
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

    public async verify_verification_token(tokenAsJWT : string) : Promise<DecodedEmailTokenJWT> {
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
    public async sendVerificationLinkToEmail(username : string , email : string , tokenAsJWT : string) : Promise<SMTPTransport.SentMessageInfo> {
        await this.verify_verification_token(tokenAsJWT);

        return await this.NodeMailerService.sendMail({
            from : '"Yeno Team" <admin@suke.app>',
            to : email,
            subject : "Suke Email Verification",
            html : `Hello, ${username}. Thanks for signing up! We just need you to verify your email addresse to complete setting up your account. <a> ${tokenAsJWT} </a>.`
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
            from : '"Yeno Team" <admin@suke.app>',
            to : oldEmail,
            subject : "Suke Account Email Changed.",
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
}