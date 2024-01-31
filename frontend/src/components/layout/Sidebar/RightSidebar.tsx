const RightSidebar = (props: { table_data: any }) => {
  return (
    <div className="top-[100px] right-1 flex w-1/6 h-[600px] items-start rounded-lg bg-transparent !fixed !z-[10] !bg-white !bg-opacity-100 shadow-sticky border border-gray-500 backdrop-blur-sm !transition">
      <div className="w-full h-full overflow-hidden rounded-lg border bg-gray-50 text-sm text-gray-700 shadow-xl">
        <div className="flex gap-3 px-4 h-[52px] bg-white">
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
                value={props.table_data.path.table_name}
                onChange={(e) => {
                  e.preventDefault;
                }}
              />
            </div>
            {props.table_data.type == 2 || props.table_data.type == 3 ? (
              <div></div>
            ) : (
              <div>
                <div className="flex gap-3 py-2 px-4">
                  <div className="flex flex-1 cursor-default item-center whitespace-nowrap font-medium">
                    Size
                  </div>
                  "{(props.table_data.path.file_size / 1024).toPrecision(2)}KB"
                </div>
                <div className="flex gap-3 py-2 px-4">
                  <div className="flex flex-1 cursor-default item-center whitespace-nowrap font-medium">
                    Compressed
                  </div>
                  "{(props.table_data.path.file_size / 1024).toPrecision(2)}KB"
                </div>
              </div>
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
