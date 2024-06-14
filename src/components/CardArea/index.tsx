import React from 'react'
import classNames from 'classnames'

interface Props {
  grid?: boolean
  children: React.ReactNode
}

export default function CardArea({ grid, children }: Props) {
  return (
    <div
      className={classNames(
        'flex flex-col gap-4 -mx-4 mb-4',
        grid ? 'grid grid-cols-1 md:grid-cols-2' : '',
      )}
    >
      {children}
    </div>
  )
}
