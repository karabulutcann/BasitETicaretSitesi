import { calculatePrice } from "@/components/price";
import { baseUrl } from "@/local.env";
import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Heading,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "full",
});

export const ReceiptEmail = ({
  email,
  orderNumber,
  address,
  city,
  district,
  createdAt,
  orderItems,
}: {
  email: string;
  orderNumber: string;
  address: string;
  city: string;
  district: string;
  createdAt: Date;
  orderItems: {
    productId: string;
    productCount: number;
    size: string;
    price: string;
    discountedPrice: string;
    discount: number;
    productName: string;
    productImage: string;
    productDescription: string;
  }[];
}) => (
  <Html>
    <Preview>LoremIpsum Sipariş</Preview>
    <Tailwind>
      <Head />
      <Body className=" font-sans px-2">
        <Container className="">
          <Section className="px-2">
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/s.svg`}
                  width="42"
                  height="42"
                  alt="Logo"
                />
              </Column>
              <Column align="right">
                <Heading as="h1">Sipariş</Heading>
              </Column>
            </Row>
          </Section>
          <Section className="px-2">
            <Row>
              <Column>
                <Text className=" text-xs md:text-lg font-medium">
                  Sipariş Numarası:
                  <br />
                  {orderNumber}
                </Text>
              </Column>
              <Column>
                <Text className="text-right text-xs md:text-lg font-medium ">
                  {dateFormat.format(createdAt)}
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr className=""></Hr>
          <Section className=" px-4 py-4">
            <Text className=" font-medium m-0 pb-1">Teslimat Adresi</Text>
            <Text className="text-xs m-0">
              {address}
              <br />
              {city}/{district}
            </Text>
          </Section>
          <Hr className=""></Hr>
          <Section className="md:px-4 py-2">
            {orderItems.map((item, i) => (
              <Row className="py-6 pl-4">
                <Column className=" p-1 md:p-4 aspect-square">
                  <Img
                    src={`${baseUrl}/static/hoodie.jpg`}
                    className="object-cover w-[120px] h-[120px]"
                    alt="Image"
                  />
                </Column>
                <Column className="p-1 md:p-4" style={{ verticalAlign: "top" }}>
                  <Text className="font-medium m-0 text-xs ">
                    {item.productName}
                  </Text>
                  <Text className="text-black/75 m-0 text-xs py-2">
                    {item.productDescription.slice(0, 44)}...
                  </Text>
                  <Text className="text-black/75 font-medium m-0 text-xs pb-2">
                    Beden : {item.size}
                  </Text>
                  <Text className="font-medium m-0 text-xs pb-2 flex items-center">
                    {item.discount !== 0 && (
                      <span className="font-semibold ">
                        {calculatePrice(item.discountedPrice)}
                      </span>
                    )}
                    <span className={item.discount!==0?"text-red-500 line-through":""}>{calculatePrice(item.price)}</span>
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr className=""></Hr>
          <Section className="px-2 py-4 text-center">
            <Text className="text-xs text-black/75">
              {" "}
              © 2024 LoremIpsum, Tüm Hakları Saklıdır
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ReceiptEmail;

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
