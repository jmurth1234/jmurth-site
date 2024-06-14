import React from 'react'
import classNames from 'classnames'
import { Post } from 'payload-types'
import Link from 'next/link'

export interface PostExcerpt extends Post {
  excerpt: string
  url: string
}

interface Props {
  post: PostExcerpt
}

export default function PostSummary({ post }: Props) {
  return (
    <Link href={post.url} className={classNames('card', post._status)}>
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <small className="text-sm text-gray-500 mt-2">
        {new Date(post.createdAt).toLocaleDateString('en-GB')}
      </small>
    </Link>
  )
}
