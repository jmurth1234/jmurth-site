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
    <Link href={post.url} className={classNames('card summary-card', post._status)}>
      <small className="text-sm font-medium text-slate-500">
        {new Date(post.createdAt).toLocaleDateString('en-GB')}
      </small>
      <h3 className="mt-2 text-xl font-bold text-slate-950">{post.title}</h3>
      {post.excerpt && <p className="mt-3 line-clamp-3 text-slate-700">{post.excerpt}</p>}
    </Link>
  )
}
