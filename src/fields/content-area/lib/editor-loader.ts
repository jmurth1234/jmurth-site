import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

export const editorLoader = async () => {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  const fullConfigPath = path.resolve(dirname, './editor-config.ts')
  console.log('configPath', fullConfigPath)
  //   console.log("loading config...");

  //   console.log("inside loadConfig");
  const require = createRequire(import.meta.url)
  //   console.log("inside loadConfig require typeof", typeof require);

  const CLIENT_EXTENSIONS = [
    '.scss',
    '.css',
    '.svg',
    '.png',
    '.jpg',
    '.eot',
    '.ttf',
    '.woff',
    '.woff2',
  ]

  CLIENT_EXTENSIONS.forEach((ext) => {
    require.extensions[ext] = () => null
  })

  //   console.log("inside loadConfig path", configPath);

  const getHeadlessEditor = require('./editor-config.ts').getHeadlessEditor
  //   console.log("inside loadConfig config", config);

  return getHeadlessEditor
}
