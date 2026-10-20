import { spawnSync } from 'node:child_process'

import alfy from 'alfy'

import { thumbnailItems } from './src/youtube-url.js'

// Script Filter input wins. An empty query reads the clipboard.
const clipboard = spawnSync('pbpaste', { encoding: 'utf8' }).stdout
const rawInput = alfy.input || clipboard || ''

alfy.output(thumbnailItems(rawInput))
