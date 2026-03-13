import React from 'react'
import { IconType } from 'react-icons';

type Props = {
    count?: number;
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
    <div className="flex items-center justify-center gap-1 sm:gap-2 cursor-pointer bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-700/50 px-1.5 sm:px-2 py-1 rounded-2xl select-none active:scale-95 transition-all duration-200 hover:scale-105">
      <div className="text-default-600">
        <Icon
          className={`
            text-default-600
            w-4 h-4
            sm:w-5 sm:h-5
            stroke-1
          `}
          {...props}
        />
      </div>
      {count !== undefined && count > 0 && (
        <p className={`font-normal text-default-600 text-xs sm:text-sm ${type === 'heart' ? 'text-red-500' : ''}`}>{count}</p>
      )}
    </div>
  )
}

export default MetaInfo