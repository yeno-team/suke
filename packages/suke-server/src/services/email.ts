import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { Service } from "typedi";
import { Email , EmailModel} from "@suke/suke-core/src/entities/Email";

@Service()
export class EmailService {
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
}