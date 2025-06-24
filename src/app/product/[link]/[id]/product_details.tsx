// import { clashdisplay, satoshi } from "@/app/fonts";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// export default function ProductDetails({
//   productDetail
// }:{
//   productDetail:ProductDetail|null
// }){
//     return(
//         <Accordion
//         type="single"
//         collapsible
//         className=" w-full px-2 "
//         defaultValue="item-1"
//       >
//         <AccordionItem value="item-1" className="px-2">
//           <AccordionTrigger>
//             <h2 className={"text-lg "+clashdisplay.className}>Ürün Açıklaması</h2>
//           </AccordionTrigger>
//           <AccordionContent className="flex justify-center">
//             <div className=" whitespace-pre-line ">
//             {productDetail?.detail}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//         <AccordionItem value="item-2" className="px-2 ">
//           <AccordionTrigger>
//             <h2 className={"text-lg "+clashdisplay.className}>Malzeme ve Bakım</h2>
//           </AccordionTrigger>
//           <AccordionContent>
//               {productDetail?.care}
//           </AccordionContent>
//         </AccordionItem>
//         <AccordionItem value="item-3" className="px-2">
//           <AccordionTrigger>
//             <h2 className={"text-lg "+clashdisplay.className}>Değişim ve İade</h2>
//           </AccordionTrigger>
//           <AccordionContent className={satoshi.className}>
//             <p>
//               Siparişinizi verdikten sonra, ekibimiz siparişinizi 1-2 iş
//               günü içerisinde hazırlayacak ve kargoya teslim edecektir.
//               Hafta içi 16:00&apos;ya kadar verdiğiniz siparişler
//               genellikle aynı gün içerisinde kargoya verilmektedir.
//               <br />
//               <br />
//               Siparişinizi takip etmek için buraya tıklayarak kolayca
//               takip edebilirsiniz. Ayrıca, tüm kargolama süreçlerinizi
//               e-posta adresinize gönderdiğimiz takip linki ile detaylı
//               bir şekilde takip edebilirsiniz.
//               <br />
//               <br />
//               Ürünleri teslim aldıktan sonra memnuniyetsizlik durumunda,
//               14 gün içinde ücretsiz iade veya değişim talebi
//               oluşturabilirsiniz. İade ve değişim işlemlerinizi iade &
//               değişim sayfası üzerinden kolayca gerçekleştirebilir ve
//               tarafımıza ücretsiz olarak kargolayabilirsiniz. Müşteri
//               memnuniyeti bizim için önemli olduğundan, herhangi bir
//               sorunuz veya yardıma ihtiyacınız varsa lütfen bizimle
//               iletişime geçmekten çekinmeyin.
//             </p>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     );
// }