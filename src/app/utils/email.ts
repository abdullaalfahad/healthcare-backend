import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVariables } from "../config/env";

const transporter = nodemailer.createTransport({
  host: envVariables.EMAIL.SMTP_HOST,
  port: parseInt(envVariables.EMAIL.SMTP_PORT),
  secure: envVariables.EMAIL.SMTP_SECURE === "true",
  auth: {
    user: envVariables.EMAIL.SMTP_USER,
    pass: envVariables.EMAIL.SMTP_PASS,
  },
});

interface SendEmailProps {
  templateName: string;
  templateData: Record<string, string>;
  subject: string;
  to: string;
  attachments?: {
    filename: string;
    content: string | Buffer;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  templateName,
  templateData,
  subject,
  to,
  attachments,
}: SendEmailProps) => {
  const template = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
  const html = await ejs.renderFile(template, templateData);
  const mailOptions = {
    from: envVariables.EMAIL.SMTP_USER,
    to,
    subject,
    html,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  };
  await transporter.sendMail(mailOptions);
};
