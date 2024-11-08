import nodemailer from 'nodemailer';
import { SETTINGS } from '../../../settings/app.settings';

export class NodemailerService {
  async sendRegistrationEmail(
    email: string,
    subject: string,
    confirmationCode: string,
  ) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.NODEMAILER.USER,
        pass: SETTINGS.NODEMAILER.PASSWORD,
      },
    });
    const info = await transport.sendMail({
      from: 'Ignat <SETTINGS.NODEMAILER.USER>',
      to: email,
      subject: subject,
      html: `<h1>Thanks for your registration</h1> 
                <p>To finish registration please follow the link below: 
                    <a href='https://some-front.com/confirm-registration?code=${confirmationCode}'> complete registration </a> 
                </p>`,
    });
    return !!info;
  }

  async sendPasswordRecoveryEmail(
    email: string,
    subject: string,
    confirmationCode: string,
  ) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.NODEMAILER.USER,
        pass: SETTINGS.NODEMAILER.PASSWORD,
      },
    });
    const info = await transport.sendMail({
      from: 'Ignat <SETTINGS.NODEMAILER.USER>',
      to: email,
      subject: subject,
      html: `<h1>Password recovery</h1> 
                <p>To finish password recovery please follow the link below: 
                    <a href='https://some-front.com/password-recovery?recoveryCode=${confirmationCode}'> recovery password </a> 
                </p>`,
    });
    return !!info;
  }
}
