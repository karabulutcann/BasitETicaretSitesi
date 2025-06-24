import { ProductDetailElement } from "@/types/product";

export function formatDetail(detail: ProductDetailElement[]) {
  return <>
    {detail.map((e, i) => {
      switch (e.tag) {
        case "div":
          return (
            <div className={e.className} key={i}>
              {formatDetail(e.children)}
            </div>
          );
        case "text":
          return <span key={i}>{e.text}</span>;
        case "br":
          return <br key={i}></br>;
        default:
          return <></>;
      }
    })}
  </>
}