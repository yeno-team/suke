import nodemailer , { SendMailOptions , TestAccount, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Inject, Service } from "typedi";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config";
import { Readable } from "stream";

@Service()
export class S3Service {
    @Inject("S3Client")
    private s3Client!: S3Client;
    
    public async getObject(key: string) {
        return this.s3Client.send(new GetObjectCommand({
            Bucket: 'suke',
            Key: key
        }));
    }

    public async putObject(key: string, file: Buffer) {
        return this.s3Client.send(new PutObjectCommand({
            Bucket: 'suke',
            Key: key,
            Body: file
        }));
    }
}