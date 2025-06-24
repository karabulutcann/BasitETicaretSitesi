

// export default function quickSort(arr: ProductPrice[], siralama: Siralama): ProductPrice[] {
//     if (arr.length <= 1) {
//       return arr;
//     }
  
//     const pivotIndex = Math.floor(arr.length / 2);
//     const pivot = arr[pivotIndex];
//     const left = [];
//     const right = [];
//     if (siralama === Siralama.azdan_coka) {
//       for (let i = 0; i < arr.length; i++) {
//         if (i === pivotIndex) {
//           continue;
//         }
  
//         if (arr[i].price[0].discountedPrice < pivot.price[0].discountedPrice) {
//           left.push(arr[i]);
//         } else {
//           right.push(arr[i]);
//         }
//       }
//     } else if (siralama === Siralama.coktan_aza) {
//       for (let i = 0; i < arr.length; i++) {
//         if (i === pivotIndex) {
//           continue;
//         }
  
//         if (arr[i].price[0].discountedPrice > pivot.price[0].discountedPrice) {
//           left.push(arr[i]);
//         } else {
//           right.push(arr[i]);
//         }
//       }
//     } else {
//       for (let i = 0; i < arr.length; i++) {
//         if (i === pivotIndex) {
//           continue;
//         }
  
//         if (arr[i].priorty > pivot.priorty) {
//           left.push(arr[i]);
//         } else {
//           right.push(arr[i]);
//         }
//       }
//     }
//     return [...quickSort(left, siralama), pivot, ...quickSort(right, siralama)];
//   }
  