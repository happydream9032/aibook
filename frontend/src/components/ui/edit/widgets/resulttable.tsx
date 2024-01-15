// import { useState, useEffect } from "react";
// const ResultTable = (props: Array<object>) => {
//   const [isShowLess, setIsShowLess] = useState(true);
//   const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);

//   return (
//     <div className="my-6 flex flex-col overflow-hidden rounded-lg border border-indigo-400 right-1 shadow">
//       <div className="relative pl-[10px]">
//         <div className=" pointer-events-none absolute bottom-0 flex h-[80px] w-full items-end justify-center">
//           <button
//             className="px-3 inline-block w-auto relative shadow-sm bg-white text-indigo-500 hover:bg-gray-50 border border-gray-600 rounded-md pointer-events-auto z-[2] m-7"
//             type="button"
//             onClick={() => {
//               setIsShowLess(!isShowLess);
//             }}
//           >
//             <div className="flex items-center justify-center h-full overflow-visible">
//               {isShowLess ? (
//                 <span className="h-full overflow-hidden flex items-center">
//                   Show more
//                 </span>
//               ) : (
//                 <span className="h-full overflow-hidden flex items-center">
//                   Show less
//                 </span>
//               )}
//             </div>
//           </button>
//           <div className=" absolute w-full h-full bg-white opacity-50 z-[1]"></div>
//         </div>
//         <div className="overflow-auto">
//           <div
//             className={`${
//               isShowLess ? "h-[250px] " : "h-[420px] "
//             } outline-none overflow-y-auto relative`}
//           >
//             <div className="w-full h-full absolute">
//               <table className=" bg-white text-sm">
//                 <thead>
//                   <tr className="bg-blue-gray-100 text-gray-700">
//                     {props.data.map((item, index) => (
//                       <th key={index} className="py-3 px-4 text-left">
//                         {item}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="text-blue-gray-900">
//                   {props.data.map((item, index) => (
//                     <tr key={index} className="border-b border-blue-gray-200">
//                       {Object.values(item).map((value, index1) => (
//                         <td key={index1} className="py-3 px-4">
//                           {value == null ? "" : value}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex h-[45px] items-center my-2">
//         <div className="px-2 w-full flex items-center justify-between">
//           <span className="text-sm pl-3 text-gray-500">df4</span>
//           <div className="items-center gap-3 lg:flex">
//             <span className="text-sm text-gray-300">
//               271,116 rows × 15 columns
//             </span>
//             <div className="relative inline-block">
//               <button
//                 type="button"
//                 className="px-3 py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
//                 onClick={() => {
//                   setIsSQLDropMenu(!isSQLDropMenu);
//                 }}
//                 title={""}
//               >
//                 <svg
//                   stroke="currentColor"
//                   fill="none"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   height="24"
//                   width="24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
//                   <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
//                   <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
//                 </svg>
//               </button>

//               {isSQLDropMenu && (
//                 <div className="top-center z-[20] absolute right-0 my-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//                   <ul
//                     role="menu"
//                     aria-orientation="vertical"
//                     aria-labelledby="options-menu"
//                     className="w-[130px]"
//                   >
//                     <li
//                       role="menuitem"
//                       className="w-full justify-start text-sm bg-white text-gray-300 px-3 py-2"
//                     >
//                       Export as ...
//                     </li>
//                     <li role="menuitem">
//                       <button
//                         type="button"
//                         className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
//                       >
//                         <span className="text-sm text-black">CSV</span>
//                       </button>
//                     </li>
//                     <li role="menuitem">
//                       <button
//                         type="button"
//                         className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
//                       >
//                         <span className="text-sm text-black">Parquet</span>
//                       </button>
//                     </li>
//                     <li role="menuitem">
//                       <button
//                         type="button"
//                         className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
//                       >
//                         <span className="text-sm text-black">Arrow</span>
//                       </button>
//                     </li>
//                     <li role="menuitem">
//                       <button
//                         type="button"
//                         className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
//                       >
//                         <span className="text-sm text-red-600">Delete Doc</span>
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultTable;
