import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

export default function ProductCartImages({
  urls,
  productName,
}: {
  urls: string[];
  productName: string;
}) {
  return (
    <>
      <AspectRatio ratio={9/12}>
        <Image
          fill
          src={urls[0]}
          quality={50}
          alt={productName}
          className={"object-cover non-selectable object"}
        />
      </AspectRatio>
    </>
  );
}
