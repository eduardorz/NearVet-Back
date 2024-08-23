import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer"
import { SendEmailDto } from "./dto/sendEmailUser.dto";

@Injectable()
export class EmailProvider {

    transporter = nodemailer.createTransport({
      service: "gmail",  
      /*host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports*/
        auth: {
          user: "teamhvet@gmail.com",
          pass: "jxas uoyp kapr kjut",
        },
      });

    async sendEmail (sendEmailDto: SendEmailDto): Promise<string> {
        
        const info = await this.transporter.sendMail({
            from: "teamhvet@gmail.com", // sender address
            to: sendEmailDto.to, // list of receivers
            subject: sendEmailDto.subject,
            text: sendEmailDto.text,
            html: sendEmailDto.html
          });
        
          console.log("Message sent: %s", info.messageId);
          console.log("este es info", info)
          return info.messageId;
    }
}