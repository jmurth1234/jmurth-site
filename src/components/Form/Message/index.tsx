import React from 'react'

import { MessageField } from '@payloadcms/plugin-form-builder/types'
import RichText from '@/components/RichText'

export const Message: React.FC<MessageField> = ({ message }) => {
  return <RichText content={message} leftAlign={true} />
}
