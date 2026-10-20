import { URL } from 'node:url'

const youtubeCandidate = /(?:https?:\/\/)?(?:(?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/\S+/gi
const trailingPunctuation = /[)\].,;!?]+$/
const videoIdPattern = /^[\w-]+$/

const thumbnailHost = 'https://i3.ytimg.com/vi'
const maxResolutionThumbnail = 'maxresdefault.jpg'

const youtubeHosts = new Set([
  'youtube.com',
  'm.youtube.com',
  'music.youtube.com',
])

const pathVideoKinds = new Set([
  'shorts',
  'embed',
  'live',
  'v',
])

function validVideoId(videoId) {
  if (typeof videoId !== 'string' || !videoIdPattern.test(videoId))
    return

  return videoId
}

function pathParts(pathname) {
  return pathname.split('/').filter(part => part.length > 0)
}

function videoIdFromCandidate(candidate) {
  const cleaned = candidate.replace(trailingPunctuation, '')
  const withProtocol = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`
  if (!URL.canParse(withProtocol))
    return

  const url = new URL(withProtocol)
  const host = url.hostname.toLowerCase().replace(/^www\./, '')

  if (host === 'youtu.be')
    return validVideoId(pathParts(url.pathname)[0])

  if (!youtubeHosts.has(host))
    return

  const parts = pathParts(url.pathname)
  const head = parts[0]?.toLowerCase()
  if (pathVideoKinds.has(head))
    return validVideoId(parts[1])

  if (head === 'watch')
    return validVideoId(url.searchParams.get('v'))
}

function hasValidBoundary(input, index) {
  if (index === 0)
    return true

  return !/[\w.-]/.test(input[index - 1])
}

export function parseYoutubeVideoId(input) {
  if (typeof input !== 'string')
    return

  const trimmed = input.trim()
  if (!trimmed)
    return

  for (const match of trimmed.matchAll(youtubeCandidate)) {
    if (!hasValidBoundary(trimmed, match.index ?? 0))
      continue

    const videoId = videoIdFromCandidate(match[0])
    if (videoId)
      return videoId
  }
}

export function buildThumbnailLink(videoId) {
  return `${thumbnailHost}/${videoId}/${maxResolutionThumbnail}`
}

function noMatchItem() {
  return {
    title: 'YT Thumbnail Link: Last clipboard entry is not a valid Youtube link.',
    subtitle: 'Please try again…',
  }
}

export function thumbnailItems(input) {
  const videoId = parseYoutubeVideoId(input)
  if (!videoId)
    return [noMatchItem()]

  const thumbnailLink = buildThumbnailLink(videoId)
  return [
    {
      title: `YT Thumbnail Link: ${thumbnailLink}`,
      subtitle: 'Copy to Clipboard',
      arg: thumbnailLink,
      variables: {
        action: 'copy',
      },
      mods: {
        cmd: {
          subtitle: 'Open in default browser',
          arg: thumbnailLink,
          variables: {
            action: 'open',
          },
        },
      },
    },
  ]
}
