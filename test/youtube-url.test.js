import assert from 'node:assert/strict'
// Workflow tests use node:test, not Vitest.
// eslint-disable-next-line test/no-import-node-test
import { describe, it } from 'node:test'

import { buildThumbnailLink, parseYoutubeVideoId, thumbnailItems } from '../src/youtube-url.js'

const videoId = 'dQw4w9WgXcQ'
const thumbnailLink = `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`

describe('parseYoutubeVideoId', () => {
  const matches = [
    [`https://www.youtube.com/watch?v=${videoId}`, videoId],
    [`https://youtube.com/watch?v=${videoId}`, videoId],
    [`http://www.youtube.com/watch?v=${videoId}&t=43s`, videoId],
    [`https://www.youtube.com/watch?feature=share&v=${videoId}`, videoId],
    [`https://youtu.be/${videoId}`, videoId],
    [`https://youtu.be/${videoId}?t=43`, videoId],
    [`youtu.be/${videoId}`, videoId],
    [`(https://youtu.be/${videoId})`, videoId],
    [`https://www.youtube.com/shorts/${videoId}`, videoId],
    [`https://youtube.com/shorts/${videoId}`, videoId],
    [`https://www.youtube.com/embed/${videoId}`, videoId],
    [`https://www.youtube.com/embed/${videoId}?start=10`, videoId],
    [`https://www.youtube.com/live/${videoId}`, videoId],
    [`https://www.youtube.com/v/${videoId}`, videoId],
    [`https://music.youtube.com/watch?v=${videoId}`, videoId],
    [`https://music.youtube.com/watch?v=${videoId}&list=RDdQw4w9WgXcQ`, videoId],
    [`https://m.youtube.com/watch?v=${videoId}`, videoId],
    [`see https://youtu.be/${videoId} thanks`, videoId],
    [`  https://www.youtube.com/shorts/${videoId}  `, videoId],
    ['https://www.youtube.com/watch?v=askdf214s', 'askdf214s'],
    ['HTTPS://YOUTU.BE/AbC-def_12', 'AbC-def_12'],
  ]

  for (const [input, expected] of matches) {
    it(`reads ${input}`, () => {
      assert.equal(parseYoutubeVideoId(input), expected)
    })
  }

  const misses = [
    '',
    '   ',
    'not a url',
    `https://example.com/watch?v=${videoId}`,
    `https://notyoutube.com/watch?v=${videoId}`,
    `https://youtube.com.evil.com/watch?v=${videoId}`,
    'https://www.youtube.com/playlist?list=PL123',
    'https://www.youtube.com/feed/subscriptions',
    'https://www.youtube.com/watch?v=',
    'https://youtu.be/',
    'https://www.youtube.com/shorts/',
    'https://music.youtube.com/playlist?list=PL123',
  ]

  for (const input of misses) {
    it(`rejects ${JSON.stringify(input)}`, () => {
      assert.equal(parseYoutubeVideoId(input), undefined)
    })
  }

  it('rejects non-strings without throwing', () => {
    assert.equal(parseYoutubeVideoId(undefined), undefined)
    assert.equal(parseYoutubeVideoId(null), undefined)
    assert.doesNotThrow(() => parseYoutubeVideoId('nope'))
  })

  it('does not keep regex state between calls', () => {
    assert.equal(parseYoutubeVideoId(`https://youtu.be/${videoId}`), videoId)
    assert.equal(parseYoutubeVideoId(`https://www.youtube.com/shorts/${videoId}`), videoId)
    assert.equal(parseYoutubeVideoId(`https://notyoutube.com/watch?v=${videoId}`), undefined)
  })
})

describe('buildThumbnailLink', () => {
  it('keeps the maxresdefault.jpg URL', () => {
    assert.equal(buildThumbnailLink(videoId), thumbnailLink)
  })
})

describe('thumbnailItems', () => {
  it('returns an explicit no-match item', () => {
    const [item] = thumbnailItems(`https://www.youtube.com/shorts/`)
    assert.deepEqual(item, {
      title: 'YT Thumbnail Link: Last clipboard entry is not a valid Youtube link.',
      subtitle: 'Please try again…',
    })
    assert.equal(item.arg, undefined)
  })

  it('returns a copy item and a command-open modifier', () => {
    const [item] = thumbnailItems(`https://music.youtube.com/watch?v=${videoId}`)
    assert.equal(item.arg, thumbnailLink)
    assert.equal(item.title, `YT Thumbnail Link: ${thumbnailLink}`)
    assert.equal(item.subtitle, 'Copy to Clipboard')
    assert.deepEqual(item.variables, { action: 'copy' })
    assert.equal(item.mods.cmd.arg, thumbnailLink)
    assert.equal(item.mods.cmd.subtitle, 'Open in default browser')
    assert.deepEqual(item.mods.cmd.variables, { action: 'open' })
  })

  it('does not throw when nothing matches', () => {
    assert.doesNotThrow(() => thumbnailItems(''))
    assert.doesNotThrow(() => thumbnailItems(undefined))
  })
})
