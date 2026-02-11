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
    <div className="flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-700/50 px-2 py-1 rounded-2xl select-none active:scale-95 transition-all duration-200 hover:scale-105 ">
      
      <div className="text-default-600 text-xl ">
      <Icon 
        className={`
      text-default-600
      w-6
      h-6
      stroke-1
        `} 
        {...props} 
      />
      </div>
      {count > 0 && ( 
        <p className={`font-normal text-default-600   text-l ${type === 'heart' ? 'text-red-500' : ''}`} >{count}</p>
      )}
    </div>
  )
}

export default MetaInfo