"use client";
import React from 'react';
import Link from 'next/link';
import { addToast, Button } from '@heroui/react';
import { MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled } from 'react-icons/md';
import { SendHorizontal } from 'lucide-react';
import { formatToClientDate } from '@/app/utils/formatToClientDate';
import { useSelector } from 'react-redux';
import { selectCurrent } from '@/src/store/user/user.slice';

interface ProfileInfoProps {
  data: any;
  isOwner: boolean;
  isFollowLoading: boolean;
  onFollow: () => void;
}


export const ProfileInfo: React.FC<ProfileInfoProps> = ({ data, isOwner, isFollowLoading, onFollow }) => {
  const current = useSelector(selectCurrent);
  console.log(current);
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 text-center lg:text-left">
        <div className="mb-4">
          <div className="relative inline-block mb-2">
            {data.usernameFrameUrl && (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                style={{
                  backgroundImage: `url(${data.usernameFrameUrl})`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: 'auto 100%',
                  backgroundPosition: 'left center',
                }}
              />
            )}
            <h1 className="relative z-0 text-3xl lg:text-4xl font-bold px-0">{data.name}</h1>
          </div>
          <p className="text-default-500 text-lg">@{data.username}</p>
        </div>

        {data.bio && <p className="text-default-600 mb-4 max-w-2xl leading-relaxed">{data.bio}</p>}

        <div className="flex flex-wrap gap-4 text-sm text-default-500 mb-4 justify-center lg:justify-start">
          {data.dateOfBirth && (
            <div className="flex items-center gap-2">
              <span>🎂</span>
              <span>{formatToClientDate(data.dateOfBirth)}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{data.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Присоединился {formatToClientDate(data.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>

        <div className="flex gap-6 mb-4 justify-center lg:justify-start">
          <Link href={`/following/${data.id}`} className="group">
            <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
              <span className="font-bold text-lg">{data.following.length}</span>
              <span className="text-default-500">Подписки</span>
            </div>
          </Link>
          <Link href={`/followers/${data.id}`} className="group">
            <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
              <span className="font-bold text-lg">{data.followers.length}</span>
              <span className="text-default-500">Подписчики</span>
            </div>
          </Link>
        </div>
      </div>

      {!isOwner && (
        <div className="flex flex-col gap-3 shrink-0">
          <Button
            color={data.isFollow ? 'default' : 'primary'}
            variant={data.isFollow ? 'flat' : 'solid'}
            isLoading={isFollowLoading}
            size="lg"
            className="min-w-[140px] font-semibold"
            onClick={() => !current ? 
              addToast({
              title: "Вы не авторизованы",
              description: "Пожалуйста, войдите в систему.",
              
              color: 'danger',
            })
             : onFollow()}
            endContent={data.isFollow ? <MdOutlinePersonAddDisabled /> : <MdOutlinePersonAddAlt1 />}
          >
            {data.isFollow ? 'Отписаться' : 'Подписаться'}
          </Button>

          <Button 
          variant="flat" size="lg" 
          className="min-w-[140px]" 
          endContent={<SendHorizontal size={16} />}
          onPress={()=> !current ?   
          addToast({
              title: "Вы не авторизованы",
              description: "Пожалуйста, войдите в систему.",
              
              color: 'danger',
            }) : null}
          
             
          >
            <Link href={`${!current ? "#"  : `/chat/${data.id}` }`}>Сообщение</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
