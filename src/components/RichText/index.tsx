import classNames from 'classnames'
import React from 'react'

const RichText: React.FC<{ className?: string; content: any; leftAlign?: boolean }> = ({
  className,
  content,
  leftAlign,
}) => {
  if (!content) {
    return null
  }

  return (
    <div
      className={classNames('prose-xl prose', className, leftAlign && 'leftAlign')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default RichText
