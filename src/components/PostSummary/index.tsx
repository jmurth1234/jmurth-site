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
      <small className="mb-3 text-sm font-bold text-nav-header">
        {new Date(post.createdAt).toLocaleDateString('en-GB')}
      </small>
      <h3 className="mb-2 text-xl font-black text-slate-950">{post.title}</h3>
      <div className="line-clamp-3 text-slate-700" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </Link>
  )
}
