import { Button } from "antd";

const BaseButton = ({
  type = "default",
  onClick,
  children,
  className = "",
  loading,
  ...props
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      {...props}
      className={`h-14 rounded-xl w-full ${className}
        ${
          type === "primary"
            ? "bg-gradient-to-r from-[#212121] to-[#424242] text-white font-medium whitespace-nowrap hover:!text-white hover:!bg-gradient-to-r hover:!from-[#424242] hover:!to-[#212121] hover:!shadow-none hover:border-0"
            : type === "buyBtn"
              ? "px-16 py-3 bg-black text-white rounded-lg font-medium whitespace-nowrap hover:!text-black hover:!bg-white hover:!shadow-none hover:border-black"
              : ""
        }`}
      loading={loading}
    >
      {children || "Label"}
    </Button>
  );
};

export default BaseButton;
