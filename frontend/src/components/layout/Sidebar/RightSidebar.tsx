import { useState, useEffect } from "react";

const RightSidebar = (props: { table_data: any }) => {
  const [filesize, setFileSize] = useState("");

  useEffect(() => {
    if (props.table_data.type !== 2 && props.table_data.type !== 4 && props.table_data.type !== 1) {
      if (props.table_data.path.file_size > 1024) {
        let kbsize = (props.table_data.path.file_size / 1024).toPrecision(2);
        if (Number(kbsize) > 1024) {
          let mbsize = (Number(kbsize) / 1024).toPrecision(2);

          if (Number(mbsize) > 1024) {
            let gbsize = (Number(mbsize) / 1024).toPrecision(2);
            setFileSize(String(gbsize) + "GB");
          } else {
            setFileSize(String(mbsize) + "MB");
          }
        } else {
          setFileSize(String(kbsize) + "KB");
        }
      }
    }
  }, [props]);

  return (
    <div className="fixed inset-y-0.5 right-0 w-[250px] bg-gray-600 bg-opacity-0 h-screen flex items-center justify-end">
      <div className="w-full h-full overflow-hidden rounded-lg border bg-gray-50 text-sm text-gray-700 shadow-xl">
        <div className="flex gap-3 mt-16 px-4 h-[52px] bg-white">
          <div className="flex flex-1 cursor-default items-center whitespace-nowrap font-bold">
            File
          </div>
        </div>
        <div className="h-[calc(100%-52px)]">
          <div className="flex flex-col align-stretch py-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-2 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap font-medium">
                Name
              </div>
              <input
                className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2"
                type="text"
                value={props.table_data.path.tablename}
                onChange={(e) => {
                  e.preventDefault;
                }}
              />
            </div>
            {props.table_data.type !== 2 && props.table_data.type !== 4 ? (
              <div>
                <div className="flex gap-3 py-2 px-4">
                  <div className="flex flex-1 cursor-default item-center whitespace-nowrap font-medium">
                    Size
                  </div>
                  {filesize}
                </div>
                <div className="flex gap-3 py-2 px-4">
                  <div className="flex flex-1 cursor-default item-center whitespace-nowrap font-medium">
                    Compressed
                  </div>
                  {filesize}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {props.table_data.type == 12 && (
            <div className="flex flex-col align-stretch py-4 justity-start border-b-2 border-gray-300">
              <div className="flex gap-3 py-2 px-4">
                <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap font-medium">
                  Url
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2"
                  type="text"
                  value={props.table_data.path.file_path}
                />
              </div>
              <div className="flex gap-3 py-2 px-4">
                <button className="p-2 flex w-full justify-center rounded-md border border-indigo-500 bg-white text-indigo-500 text-sm font-bold">
                  Reload Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RightSidebar;
