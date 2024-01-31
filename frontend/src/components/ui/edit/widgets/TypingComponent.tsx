import { useState, useEffect } from "react";
import Importfile from "./ImportFile";
import RunSQL from "./RunSQL";
import AIPrompt from "./AIPrompt";
import DropdownModal from "./DropdownModal";
import { useDuckDb } from "duckdb-wasm-kit";

import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface element_type {
  type: number;
  value: string;
  path: {
    table_name: string;
    filepath: string;
  };
}

const TypingComponent = (props: {
  showDropMenu: boolean;
  selectComponentData: (data: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const duckbook = useAppSelector((state) => state.navbarReducer.data);
  const { db, loading, error } = useDuckDb();
  const element_data = JSON.parse(duckbook["DATA"]);

  const [database, setDatabase] = useState();
  const [isShowChildren, setIsShowChildren] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //show dropmenu
  const [value, setValue] = useState(""); // current text of input component
  const [elements, setElements] = useState<element_type[]>(element_data);

  useEffect(() => {
    if (value === "/") {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [value]);

  useEffect(() => {
    if (db != undefined) {
      setDatabase(db);
      setIsShowChildren(true);
    }
  }, [db]);

  const closeModal = () => {
    setIsDropdownOpen(false);
  };

  // handle dropdown events
  const handleChangeComponentType = (type: number) => {
    const array = [...elements];
    let path = { table_name: "", filepath: "", filesize: "" };
    let componet = { type: type, value: "", path: path };
    array.push(componet);
    console.log("array is ===", array);
    setElements(array);

    dispatch(setChangeDuckBookData(JSON.stringify(array)));
    setValue("");
  };

  const handleChangeDropdownOpen = (bool: boolean) => {
    setIsDropdownOpen(bool);
  };

  const handleSeletedComponentData = (data: any) => {
    props.selectComponentData(data);
  };

  const handleOnKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Enter":
        const array = [...elements];
        let path = { table_name: "", filepath: "", filesize: "" };
        const object = { type: 5, value: value, path: path };
        array.push(object);
        setElements(array);

        dispatch(setChangeDuckBookData(JSON.stringify(array)));
        setValue("");
        break;
      case "Slash":
        setValue("");
        break;
      default:
        break;
    }
  };

  const contents = () => {
    return elements.map((item, index) => (
      <div key={index}>
        {item.type === 5 ? (
          <p className="py-4 text-lg">{item.value}</p>
        ) : item.type === 1 ? (
          <Importfile
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : item.type === 11 ? (
          <Importfile
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : item.type === 12 ? (
          <Importfile
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : item.type === 13 ? (
          <Importfile
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : item.type === 2 ? (
          <RunSQL
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : item.type === 3 ? (
          <div></div>
        ) : item.type === 4 ? (
          <AIPrompt
            type={item}
            index={index}
            db={db}
            getSelectedComponentData={(data: any) =>
              handleSeletedComponentData(data)
            }
          />
        ) : (
          ""
        )}
      </div>
    ));
  };
  return (
    <div>
      <div contentEditable={false}>
        {isShowChildren && contents()}
        <input
          className="text-lg py-4 w-full border border-transparent focus:outline-none"
          type="text"
          value={value}
          placeholder="Type '/' to show the dropdown"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(event: any) => handleOnKeyDown(event)}
        />
      </div>
      <div>
        {isDropdownOpen && (
          <DropdownModal
            closeModal={() => closeModal()}
            selectComponentType={(type: number) =>
              handleChangeComponentType(type)
            }
            changeDropdownOpen={(bool: boolean) =>
              handleChangeDropdownOpen(bool)
            }
          />
        )}
      </div>
    </div>
  );
};

export default TypingComponent;
