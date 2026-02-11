import { Button as NextButton } from "@heroui/react"
import React from "react"

type Props = {
  children: React.ReactNode;
  icon?: JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidht?: boolean;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}

interface ButtonProps extends Props {
  as?: any;
  href?: string;
}

const Button = ({
  children,
  className,
  color,
  icon,
  type,
  fullWidht,
  as,
  href
}: ButtonProps) => {
  return <NextButton 
  as={as}
  href={href}
  startContent={icon} 
  size="md" 
  color={color}
  variant='light'
  className={className}
  type={type}
  fullWidth={fullWidht}
  >{children}</NextButton>
}

export default Button
