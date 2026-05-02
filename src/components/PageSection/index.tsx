import React from 'react'

interface Props {
  title: string
  intro?: string | null
  children: React.ReactNode
}

export default function PageSection({ title, intro, children }: Props) {
  return (
    <section className="homepage-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </section>
  )
}
