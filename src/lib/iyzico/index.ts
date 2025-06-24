import crypto from "crypto";

export async function iyzicoStartPayment(
  body: IyzicoCheckoutFormRequest,
) {
  const randomString = generateRandomString(10);
  const uri = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
  return await fetch(`${apiUrl.SANDBOX}${uri}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-iyzi-rnd": randomString,
      Authorization:
        "IYZWSv2" +
        " " +
        generateHashV2(
          process.env.IYZICO_API_KEY!,
          randomString,
          process.env.IYZICO_SECRET_KEY!,
          body,
          uri,
        ),
    },
    body: JSON.stringify(body),
  });
}

export async function iyzicoRetrievePayment(
  body: IyzicoRetrievePaymentRequest,
) {
  const randomString = generateRandomString(10);
  const uri = "/payment/iyzipos/checkoutform/auth/ecom/detail";
  return await fetch(`${apiUrl.SANDBOX}${uri}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-iyzi-rnd": randomString,
      Authorization:
        "IYZWSv2" +
        " " +
        generateHashV2(
          process.env.IYZICO_API_KEY!,
          randomString,
          process.env.IYZICO_SECRET_KEY!,
          body,
          uri,
        ),
    },
    body: JSON.stringify(body),
  });
}

export interface IyzicoRetrievePaymentRequest{
  conversationId:string;
  locale:"tr";
  token:string;
}

export interface IyzicoRetrievePaymentResponse {
  status: "success" | "failure";
  locale: string;
  systemTime: number;
  conversationId: string;
  errorCode:string;
  errorMessage:string;
  errorGroup:string;
  price: number;
  paidPrice: number;
  installment: number;
  paymentId: string;
  fraudStatus: 0 | -1 | 1;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  cardType: "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD";
  cardAssociation: "VISA" | "MASTER_CARD" | "AMERICAN_EXPRESS" | "TROY";
  cardFamily: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  currency: string;
  itemTransactions: ItemTransaction[];
  authCode: string;
  phase: string;
  mdStatus: number;
  hostReference: string;
  token: string;
  callbackUrl: string;
  paymentStatus: "SUCCESS" | "FAILURE" | "INIT_THREEDS" | "CALLBACK_THREEDS" | "BKM_POS_SELECTED" | "CALLBACK_PECCO";
}

export interface ItemTransaction {
  itemId: string;
  paymentTransactionId: string;
  transactionStatus: 0 | -1 | 1 | 2;
  price: number;
  paidPrice: number;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  blockageRate: number;
  blockageRateAmountMerchant: number;
  blockageRateAmountSubMerchant: number;
  blockageResolvedDate: string;
  subMerchantPrice: number;
  subMerchantPayoutRate: number;
  subMerchantPayoutAmount: number;
  merchantPayoutAmount: number;
  convertedPayout: ConvertedPayout;
}

export interface ConvertedPayout {
  paidPrice: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  blockageRateAmountMerchant: number;
  blockageRateAmountSubMerchant: number;
  subMerchantPayoutAmount: number;
  merchantPayoutAmount: number;
  iyziConversionRate: number;
  iyziConversionRateAmount: number;
  currency: string;
}



const separator = ":";

/**
 * Generates a version 2 hash for payment authorization.
 *
 * @param {string} apiKey - The API key for payment authorization.
 * @param {string} randomString - A random string for payment authorization.
 * @param {string} secretKey - The secret key for payment authorization.
 * @param {{ [key: string]: any }} body - The request body for payment authorization.
 * @param {string} uri - The URI for payment authorization. example /payment/bin/check
 * @return {string} A base64-encoded string representing the authorization hash.
 */
const generateHashV2 = (
  apiKey: string,
  randomString: string,
  secretKey: string,
  body: { [key: string]: any },
  uri: string,
) => {
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(randomString + uri + JSON.stringify(body))
    .digest("hex");

  var authorizationParams = [
    "apiKey" + separator + apiKey,
    "randomKey" + separator + randomString,
    "signature" + separator + signature,
  ];
  console.log(authorizationParams);
  return Buffer.from(authorizationParams.join("&")).toString("base64");
};

const generateRandomString = (size: number) => {
  return process.hrtime()[0] + Math.random().toString(size).slice(2);
};

export interface IyzicoCheckoutFormRequest {
  locale: "tr";
  /**
   * İstek esnasında gönderip, sonuçta alabileceğiniz bir değer, request/response eşleşmesi yapmak için kullanılabilir.
   */
  conversationId: string;
  price: string;
  basketId: string;
  paymentGroup: "PRODUCT";
  buyer: {
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    email: string;
    gsmNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
  };
  shippingAddress: {
    address: string;
    contactName: string;
    city: string;
    country: string;
  };
  billingAddress: {
    address: string;
    /**
     * Üye işyeri tarafındaki teslimat adresi ad soyad bilgisi. Sepetteki ürünlerden en az 1 tanesi fiziksel ürün (itemType=PHYSICAL) ise zorunludur.
     */
    contactName: string;
    city: string;
    country: string;
  };
  basketItems: IyzicoBasketItem[];
  callbackUrl: string;
  currency: "TRY";
  paidPrice: string;
  paymentSource: string;
  /**
   * Taksit bilgisi, tek çekim için 1 gönderilmelidir. Geçerli değerler: 1, 2, 3, 6, 9.
   */
  enabledInstallments: number[];
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string | undefined;
  itemType: "PHYSICAL";
  price: string;
  subTotalPrice: string | undefined;
  createdDate: string | undefined;
}

export interface IyzicoCheckoutFormResponse {
  checkoutFormContent: string;
  paymentPageUrl: string;
  token: string;
  tokenExpireTime: number;
  status: string;
  errorCode: string;
  errorMessage: string;
  errorGroup: string;
  locale: string;
  systemTime: number;
  /**
   * İstek esnasında gönderip, sonuçta alabileceğiniz bir değer, request/response eşleşmesi yapmak için kullanılabilir.
   */
  conversationId: string;
}
export const apiUrl = {
  SANDBOX: "https://sandbox-api.iyzipay.com",
  PRODUCTION: "https://api.iyzipay.com",
} as const;

export const installments = [1, 2, 3, 6, 9, 12] as const;

export const apmType = {
  SOFORT: "SOFORT",
  IDEAL: "IDEAL",
  QIWI: "QIWI",
  GIROPAY: "GIROPAY",
} as const;

export const baseItemType = {
  PHYSICAL: "PHYSICAL",
  VIRTUAL: "VIRTUAL",
} as const;

export const currency = {
  TRY: "TRY",
  EUR: "EUR",
  USD: "USD",
  IRR: "IRR",
  GBP: "GBP",
  NOK: "NOK",
  RUB: "RUB",
  CHF: "CHF",
} as const;

export const headerAttributes = {
  DEFAULT_RANDOM_STRING_SIZE: 8,
  DEFAULT_CLIENT_VERSION: "iyzipay-node-2.0.61",
  DEFAULT_SEPARATOR: ":",
  HEADER_NAME_RANDOM_STRING: "x-iyzi-rnd",
  HEADER_NAME_CLIENT_VERSION: "x-iyzi-client-version",
  HEADER_NAME_AUTHORIZATION: "Authorization",
  HEADER_VALUE_AUTHORIZATION_PREFIX: "IYZWS",
  HEADER_VALUE_AUTHORIZATION_PREFIX_V2: "IYZWSv2",
} as const;

export const locale = {
  TR: "tr",
  EN: "en",
} as const;

export const paymentChannel = {
  MOBILE: "MOBILE",
  WEB: "WEB",
  MOBILE_WEB: "MOBILE_WEB",
  MOBILE_IOS: "MOBILE_IOS",
  MOBILE_ANDROID: "MOBILE_ANDROID",
  MOBILE_WINDOWS: "MOBILE_WINDOWS",
  MOBILE_TABLET: "MOBILE_TABLET",
  MOBILE_PHONE: "MOBILE_PHONE",
} as const;

export const paymentGroup = {
  PRODUCT: "PRODUCT",
  LISTING: "LISTING",
  SUBSCRIPTION: "SUBSCRIPTION",
} as const;

export const paymentPlan = {
  RECURRING: "RECURRING",
} as const;

export const refundReason = {
  DOUBLE_PAYMENT: "double_payment",
  BUYER_REQUEST: "buyer_request",
  FRAUD: "fraud",
  OTHER: "other",
} as const;

export const subscriptionInitialStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
} as const;

export const subscriptionPlanInterval = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export const subscriptionStatus = {
  EXPIRED: "EXPIRED",
  UNPAID: "UNPAID",
  CANCELED: "CANCELED",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  UPGRADED: "UPGRADED",
} as const;

export const subscriptionUpgradePeriod = {
  NOW: "NOW",
} as const;

export const paymentSource = {
  SHOPIFY: "SHOPIFY",
  WOOCOMMERCE: "WOOCOMMERCE",
  MAGENTO: "MAGENTO",
  OPENCART: "OPENCART",
  PRESTASHOP: "PRESTASHOP",
} as const;

export const subMerchantType = {
  PERSONAL: "PERSONAL",
  PRIVATE_COMPANY: "PRIVATE_COMPANY",
  LIMITED_OR_JOINT_STOCK_COMPANY: "LIMITED_OR_JOINT_STOCK_COMPANY",
} as const;
