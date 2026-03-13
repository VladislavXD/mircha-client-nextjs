import MetaInfo from "@/shared/components/ui/MetaInfo";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, addToast} from "@heroui/react";
import { BadgePlus, Copy, Forward, Link } from "lucide-react";
import { useState } from "react";
import { set } from "zod";


type shareDropdownProps =  { 
  linkToCopy: string
}
export default function ShareDropdown({linkToCopy}: shareDropdownProps) {
  const [isCopied, setIsCopied] = useState(false)
  const items = [
    {
      key: "add-to-story",
      label: "Добавить в историю",
      icon: <BadgePlus />,
      onClick: undefined
    },
    {
      key: "copy-link",
      label: isCopied ? "Скопировано!" : "Копировать ссылку",
      icon: <Link />,
      onClick: () => copyToClipboard(linkToCopy)
    },
  ];

  const copyToClipboard = async(linkToCopy: string)=> {
    try{
      console.log('test copy');
      await navigator.clipboard.writeText(linkToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      clearTimeout(setTimeout (() => setIsCopied(false), 2000))
      addToast({
        title: "Ссылка скопирована",
        variant: "flat",
        color: "default"
      })
    }catch(e){
      console.error("Failed to copy link: ", e)
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
				 <div className="cursor-pointer  flex items-center" onClick={e=> e.stopPropagation()}>	
        <MetaInfo Icon={Forward } />

				 </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            onClick={item.onClick}
						startContent={item.icon}
            className={item.key === "delete" ? "text-danger" : ""}
            color={item.key === "delete" ? "danger" : "default"}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
