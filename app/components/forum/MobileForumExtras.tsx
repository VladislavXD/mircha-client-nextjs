"use client"

import React from 'react'
import LatestPosts from '@/app/components/ui/LatestPosts'
import ForumStats from '@/app/components/ui/ForumStats'

export default function MobileForumExtras(){
  return (
    <div className="sm:hidden mt-6 space-y-6">
      <LatestPosts />
      <ForumStats />
    </div>
  )
}
