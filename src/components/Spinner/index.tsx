import React from "react";
import "./index.css";

interface Props {
  visible: boolean;
}

const Spinner = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className="h-auto relative w-full">
      {props.visible && (
        <div className="w-full flex justify-center h-full absolute">
          <div className="spinner lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
};

export default Spinner;
