import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '@/src/store/user/user.slice';
import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import Link from 'next/link';
import { MdAlternateEmail } from 'react-icons/md';

const Profile = () => {
    const current = useSelector(selectCurrent);

    if (!current){
        return null
    }

    const {name, email, avatarUrl, id} = current;

  return (
    <Card className='py-4 w-[302px]'>
        <CardHeader className='pb-0 pt-2 px4 flex-col items-center'>
            <Image 
                isBlurred
                alt='Profile'
                className='object-cover rounded-xl'
                src={avatarUrl} // Теперь avatarUrl уже содержит полную ссылку из Cloudinary
                width={370}
            />
        </CardHeader>
        <CardBody>
            <Link href={`/user/${id}`}>
                <h4 className="font-bold text-large mb-2">
                    {name}
                </h4>
                <p className="text-default-500 flex items-center gap-1">
                    <MdAlternateEmail/>
                        {email}
                </p>
            </Link>
        </CardBody>
    </Card>
  )
}

export default Profile