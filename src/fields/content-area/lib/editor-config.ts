import {
  HTMLConverterFeature,
  defaultEditorConfig,
  defaultEditorFeatures,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

import { $convertFromMarkdownString } from '@lexical/markdown'

export const lexicalConfig = defaultEditorConfig

lexicalConfig.features = [...defaultEditorFeatures, HTMLConverterFeature({})] as any

import { createHeadlessEditor } from '@lexical/headless'
import { getEnabledNodes } from '@payloadcms/richtext-lexical'
import { SanitizedConfig } from 'payload/types'

export const getHeadlessEditor = async (config: SanitizedConfig) => {
  const editorConfig = await sanitizeServerEditorConfig(lexicalConfig, config)

  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }) as any,
  })

  return { headlessEditor, editorConfig, $convertFromMarkdownString }
}
