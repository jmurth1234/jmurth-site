import React from 'react'

import { Post, Page, Project } from 'payload-types'
import { Markdown } from '../Markdown'
import RichText from '../RichText'

// Extract the type of `contentArea` from the above union
type PostContentArea = NonNullable<Post['contentArea']>
type PageContentArea = NonNullable<Page['contentArea']>
type ProjectContentArea = NonNullable<Project['contentArea']>

// Define a type for individual blocks within the `contentArea`
type PostContentAreaBlock = PostContentArea extends (infer U)[] ? U : never
type PageContentAreaBlock = PageContentArea extends (infer U)[] ? U : never
type ProjectContentAreaBlock = ProjectContentArea extends (infer U)[] ? U : never

type ContentBlock = PostContentAreaBlock | PageContentAreaBlock | ProjectContentAreaBlock

interface Props {
  area: ContentBlock
  leftAlign?: boolean
}

function ContentArea(props: Props) {
  const { area } = props
  switch (area.blockType) {
    case 'markdown':
      return <Markdown leftAlign={props.leftAlign}>{area.content}</Markdown>
    case 'rich-text-area':
      return <RichText content={area.html} leftAlign={props.leftAlign} />
    default:
      // render json of contentArea if blockType is not recognized
      return <pre>{JSON.stringify(area, null, 2)}</pre>
  }
}

export default ContentArea
