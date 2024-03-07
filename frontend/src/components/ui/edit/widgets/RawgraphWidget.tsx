import CloseModalIcon from "@/assets/images/icons/CloseDialog.svg";
import Image from "next/image";

const RawGraphWidget = (props: { closeModal: () => void }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-screen w-screen flex items-center justify-center z-30">
      <div className="border shadow-lg rounded-lg bg-white w-[1024px] h-[768px]">
        <div className="flex justify-end">
          <button
            className="px-2 py-2"
            onClick={() => {
              props.closeModal();
            }}
            aria-label="btn"
          >
            <Image src={CloseModalIcon} alt="close" width={24} height={24} />
          </button>
        </div>
        <iframe
          className="w-full h-full"
          src="http://localhost:8000"
          allowFullScreen={true}
          aria-label="frame"
        />
      </div>
    </div>
  );
};

export default RawGraphWidget;
