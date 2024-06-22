import { Checkbox } from './Checkbox'
import { Message } from './Message'
import { Select } from './Select'
import { Text } from './Text'

export const fields: Record<string, any> = {
  checkbox: Checkbox,
  email: Text,
  message: Message,
  number: Text,
  select: Select,
  text: Text,
  textarea: Text,
}
