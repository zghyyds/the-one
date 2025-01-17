import React from "react";
import { Spinner } from "@nextui-org/react";
interface LoadingOverlayProps {
  message?: string; // 加载提示信息
  fullScreen?: boolean; // 是否为全屏加载
}

const Loading: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {

  return (
    <div
      className={`${
        fullScreen ? "fixed" : "absolute"
      } top-0 left-0 w-full h-full flex items-center justify-center z-50`}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="default"/>
        {message && <span className="text-white text-lg">{message}</span>}
      </div>
    </div>
  );
};

export default Loading;