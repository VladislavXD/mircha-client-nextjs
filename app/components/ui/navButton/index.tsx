import React from 'react'
import Link from 'next/link'
import { Button } from '@heroui/react'

type Props = {
    children: React.ReactNode;
    icon: JSX.Element;
    href: string
}

const NavButton = ({children, icon, href}:Props) => {
  return (
    <Button as={Link} href={href} startContent={icon} variant="light" size="md" className='justify-start w-full text-sm font-medium'>
      {children}
    </Button>
  )
}

export default NavButton