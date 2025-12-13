"use client"
import React from 'react'
import { Dropdown, DropdownTrigger, Button, Spinner, DropdownMenu, DropdownItem } from '@heroui/react'
import { SlOptions, SlUserFollow } from 'react-icons/sl'
import { useCurrentUser } from '@/src/hooks/user'
import { IoAddCircleOutline } from 'react-icons/io5'
import { MdBlockFlipped, MdOutlineEdit, MdOutlineReportGmailerrorred } from 'react-icons/md'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useUserProfile } from '@/src/features/profile'
import { queryClient } from '@/lib/queryClient'
import { User } from '@/src/types/types'

interface PostDropdownProps {
  isLoading?: boolean
  onEdit: () => void
  onDelete: () => void
  onReport: () => void
  authorId: string
}


const PostDropdown: React.FC<PostDropdownProps> = ({ isLoading, onEdit, onDelete, authorId, onReport }) => {

  const { user: currentUser } = useCurrentUser()

  const {isFollowLoading, isUnfollowLoading, handleFollow, data } = useUserProfile(authorId)
  return (
    <Dropdown >
      <DropdownTrigger>
        <Button className="capitalize" isIconOnly color='default' variant='bordered'>
          {isLoading ? <Spinner /> : <SlOptions />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown Variants"
        color='default'
        variant='bordered'
        onAction={(key) => {
          if (key === 'delete') onDelete();
          if (key === 'edit') onEdit();
          if (key === 'report') onReport();
        }}
      >
        {authorId === currentUser?.id ? (
          <DropdownItem key='edit' startContent={<MdOutlineEdit />}>Редактировать</DropdownItem>
        ) : null}
          {
            authorId !== currentUser?.id ? (
              <DropdownItem
                key='follow'
                startContent={data?.isFollow ? <SlUserFollow /> : <SlUserFollow />}
                onClick={handleFollow}
                isDisabled={isFollowLoading || isUnfollowLoading}

              >
                {data?.isFollow ? <>Отписаться</> : <>Подписаться</>}</DropdownItem>
            ) : null
          }
          <DropdownItem key='save' startContent={<IoAddCircleOutline />}>Сохранить </DropdownItem>
          <DropdownItem key='report' startContent={<MdOutlineReportGmailerrorred />}>Пожаловаться</DropdownItem>
          <DropdownItem key='block' startContent={<MdBlockFlipped />}>Заблокировать</DropdownItem>

        {
          authorId === currentUser?.id ? (
            <DropdownItem key='delete' className='text-red-600' startContent={<RiDeleteBin7Line />}>Удалить</DropdownItem>
          ) : null
        }
      </DropdownMenu>
    </Dropdown>
  )
}

export default PostDropdown
