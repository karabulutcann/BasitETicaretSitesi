
import { resend } from '.';
import { VerifyEmailTemplate } from './template/verify_email';


export async function sendVerifyEmail(code:string,name:string,email:string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LoremIpsum <info@LoremIpsum.store>',
      to: [email],
      subject: 'Email Doğrulama',
      react: VerifyEmailTemplate({ code: code, name: name ,email: email}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
