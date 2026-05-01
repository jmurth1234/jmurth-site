import React from 'react'

interface Props {
  title: string
  description?: string
  children: React.ReactNode
}

export default function PageSection({ title, description, children }: Props) {
  return (
    <section className="section-block">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  )
}
