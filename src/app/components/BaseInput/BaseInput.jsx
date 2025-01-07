import { Input } from "antd";

const BaseInput = ({ placeholder, value, onChange, ...props }) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
      className="w-full h-14 rounded-xl"
    />
  );
};

export default BaseInput;
