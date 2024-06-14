'use client'

import React, { useState } from 'react'
import ReactMde from 'react-mde'
import { Markdown } from '../Markdown'

import 'react-mde/lib/styles/css/react-mde-all.css'
import './Editor.css'
import { useField } from '@payloadcms/ui/forms/useField'

type Props = { path: string }

function Editor(props: Props) {
  const { value, setValue } = useField<string>({ path: props.path })
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')
  console.log('props', props)
  console.log('value', value)

  return (
    <ReactMde
      value={value}
      onChange={setValue}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={(markdown) => Promise.resolve(<Markdown>{markdown}</Markdown>)}
    />
  )
}

export default Editor
