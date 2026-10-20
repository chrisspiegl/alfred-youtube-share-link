import cp from 'node:child_process'
import process from 'node:process'
import alfy from 'alfy'
import { shareLinkItems } from './src/share-link.js'

const clipboard = cp.spawnSync('pbpaste', { encoding: 'utf8' })
const clipboardText = typeof clipboard.stdout === 'string' ? clipboard.stdout : ''
const input = alfy.input || clipboardText

alfy.output(shareLinkItems(input, process.env.playlist_ids))
