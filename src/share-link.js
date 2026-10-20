const NO_MATCH_ITEM = {
  title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
  subtitle: 'Please try again…',
}

const VIDEO_ID = /^[\w-]+$/

const EMBEDDED_URL = /(?<![\w.-])(?:https?:\/\/)?(?:(?:[a-z0-9-]+\.)*youtube\.com|youtu\.be)\/\S+/gi

const PATH_ID_KINDS = new Set(['shorts', 'embed', 'live', 'v'])

export function extractYoutubeVideoId(input) {
  if (typeof input !== 'string')
    return null

  const text = input.trim()
  if (text.length === 0)
    return null

  const direct = idFromCandidate(text)
  if (direct)
    return direct

  for (const match of text.matchAll(EMBEDDED_URL)) {
    const id = idFromCandidate(match[0])
    if (id)
      return id
  }

  return null
}

export function shareLinkItems(input) {
  const videoId = extractYoutubeVideoId(input)
  if (videoId == null)
    return [NO_MATCH_ITEM]

  const youtubeLink = `youtu.be/${videoId}`
  const youtubeLinkHttps = `https://${youtubeLink}`

  return [
    {
      title: `YT Share Link: ${youtubeLinkHttps}`,
      subtitle: 'Copy to Clipboard',
      arg: youtubeLinkHttps,
    },
    {
      title: `YT Share Link: ${youtubeLink}`,
      subtitle: 'Copy to Clipboard',
      arg: youtubeLink,
    },
  ]
}

function idFromCandidate(candidate) {
  const trimmed = candidate.replace(/[),.;]+$/g, '')
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let url
  try {
    url = new URL(withProtocol)
  }
  catch {
    return null
  }

  return idFromUrl(url)
}

function idFromUrl(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  const youtubeHost = host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com')
  if (!youtubeHost)
    return null

  if (host === 'youtu.be')
    return validId(firstPathSegment(url.pathname))

  const segments = url.pathname.split('/').filter(Boolean)
  const head = segments[0]?.toLowerCase()
  if (PATH_ID_KINDS.has(head))
    return validId(segments[1])

  if (head === 'watch' || host === 'music.youtube.com')
    return validId(url.searchParams.get('v'))

  return null
}

function firstPathSegment(pathname) {
  return pathname.split('/').filter(Boolean)[0]
}

function validId(id) {
  if (!id || !VIDEO_ID.test(id))
    return null

  return id
}
