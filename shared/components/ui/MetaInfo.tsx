import React from 'react'
import { IconType } from 'react-icons';

type Props = {
    count: number;
    Icon: IconType
    type?: 'heart' | 'comment' | 'sidebar' | 'profile'
}

const MetaInfo = ({
    count,
    Icon,
    type,
    ...props
}: Props) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {count > 0 && ( 
        <p className="font-semibold text-default-400 text-l ">{count}</p>
      )}
      <div className="text-default-400 text-xl">
        <Icon 
          className={`
            transition-transform duration-100 ease-in-out
            hover:scale-115
           
          `} 
          {...props} 
        />
      </div>
    </div>
  )
}

export default MetaInfo