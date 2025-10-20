"use client"
import React from 'react'
import { Dropdown, DropdownTrigger, Button, Spinner, DropdownMenu, DropdownItem } from '@heroui/react'
import { SlOptions, SlUserFollow } from 'react-icons/sl'
import { useSelector } from 'react-redux'
import { selectCurrent } from '@/src/store/user/user.slice'
import { IoAddCircleOutline } from 'react-icons/io5'
import { MdBlockFlipped, MdOutlineEdit, MdOutlineReportGmailerrorred } from 'react-icons/md'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useUserProfile } from '@/src/hooks/useUserProfile'

interface PostDropdownProps {
  isLoading?: boolean
  onEdit: () => void
  onDelete: () => void
  authorId: string
}


const PostDropdown: React.FC<PostDropdownProps> = ({ isLoading, onEdit, onDelete, authorId }) => {



  const currentUser = useSelector(selectCurrent)



  const {isFollowLoading, isUnfollowLoading, handleFollow, data } = useUserProfile(authorId)
  return (
    <Dropdown closeOnSelect={false}>
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
