const DropdownModal = (props: {
  closeModal: () => void;
  selectComponentType: (type: number) => void;
  changeDropdownOpen: (bool: boolean) => void;
}) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="h-screen w-screen fixed inset-0"
        onClick={() => props.closeModal()}
      />
      <div className="top-left absolute left-0 shadow-lg rounded-xl bg-white ring-1 ring-black ring-opacity-5">
        <div className="w-[500px] px-4">
          <div className="flex items-center justify-center bg-gray-100">
            <div className="w-full bg-white">
              <ul className="flex flex-col w-full">
                <li className="my-px">
                  <span className="flex text-sm text-gray-400 px-3 my-3 uppercase">
                    Suggested
                  </span>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(1);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                        <path d="M7 9l5 -5l5 5"></path>
                        <path d="M12 4l0 12"></path>
                      </svg>
                    </span>
                    <span className="ml-3">Load Data</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(2);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7 8l-4 4l4 4"></path>
                        <path d="M17 8l4 4l-4 4"></path>
                        <path d="M14 4l-4 16"></path>
                      </svg>
                    </span>
                    <span className="ml-3">SQL</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(3);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                        <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                        <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                        <path d="M4 20l14 0"></path>
                      </svg>
                    </span>
                    <span className="ml-3">Chart</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(4);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
                      </svg>
                    </span>
                    <span className="ml-3">AI</span>
                  </button>
                </li>
                <li className="my-px">
                  <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
                    More
                  </span>
                </li>
                <li className="my-px">
                  <a
                    href="#"
                    className="flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
                      </svg>
                    </span>
                    <span className="ml-3">Sample Data ...</span>
                  </a>
                </li>
                <li className="my-px">
                  <a
                    href="#"
                    className="flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M5 9l14 0"></path>
                        <path d="M5 15l14 0"></path>
                        <path d="M11 4l-4 16"></path>
                        <path d="M17 4l-4 16"></path>
                      </svg>
                    </span>
                    <span className="ml-3">MarkDown ...</span>
                  </a>
                </li>
                <li className="my-px">
                  <a
                    href="#"
                    className="flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <span className="flex items-center justify-center text-lg text-gray-400">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 19l16 0"></path>
                        <path d="M4 15l4 -6l4 2l4 -5l4 4"></path>
                      </svg>
                    </span>
                    <span className="ml-3">Chart type ...</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownModal;
