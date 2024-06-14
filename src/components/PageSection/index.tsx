import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

export default function PageSection({ title, children }: Props) {
  return (
    <section className="my-8">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
