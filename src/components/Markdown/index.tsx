import React from 'react'

import ReactMarkdown, { Options as ReactMarkdownOptions } from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import classNames from 'classnames'

export { Markdown }

interface Props extends ReactMarkdownOptions {
  leftAlign?: boolean
}

function Markdown(props: Props) {
  const { leftAlign, ...rest } = props
  return (
    <div className={classNames('prose-xl prose', leftAlign && 'leftAlign')}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} {...rest} />
    </div>
  )
}
