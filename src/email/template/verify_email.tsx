import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { baseUrl } from "@/local.env";
interface VerifyEmailProps {
  code: string;
  name: string;
  email: string;
}

export const VerifyEmailTemplate = ({
  code,
  name,
  email,
}: VerifyEmailProps) => (
  <Html>
    <Tailwind>
      <Head />

      <Preview>Email adresi doğrulama</Preview>
      <Body className="font-sans">
        <Container className="container max-w-md py-8 px-4">
          <Img
            src={`${baseUrl}/static/s.svg`}
            width="42"
            height="42"
            alt="Logo"

          />
          <Heading className="text-lg sm:text-xl font-semibold mt-8 mb-4">
            Email adresini doğrulama
          </Heading>
          <Text className="m-0 text-sm sm:text-base">
            <span>{email} </span> adresiyle yeni hesap açma isteği oluşturuldu. Bu e-posta
            adresinin size ait olduğunu doğrulamak için aşağıdaki doğrulama
            kodunu kullanın.
          </Text>
          <Section>
            <Text className="text-xl font-semibold my-6">{code}</Text>
            <Text>
              Bu doğrulama kodu 15 dakika geçerlidir. Eğer bu işlemi siz
              yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
            </Text>
          </Section>
          <Hr className="my-6" />
          <section>
            <Text className="m-0">LoremIpsum</Text>
            <Text>© 2024, Tüm Hakları Saklıdır</Text>
          </section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerifyEmailTemplate;
