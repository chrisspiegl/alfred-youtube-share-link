const NO_MATCH_ITEM = {
  title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
  subtitle: 'Please try again…',
}

const VIDEO_ID = /^[\w-]+$/
const PLAYLIST_ID = /^[\w-]+$/

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

export function parsePlaylists(playlistIdsText) {
  if (typeof playlistIdsText !== 'string')
    return []

  const playlists = []
  for (const line of playlistIdsText.split(/\r?\n/)) {
    const playlist = parsePlaylistLine(line)
    if (playlist)
      playlists.push(playlist)
  }
  return playlists
}

export function shareLinkItems(input, playlistIdsText = '') {
  const videoId = extractYoutubeVideoId(input)
  if (videoId == null)
    return [NO_MATCH_ITEM]

  const youtubeLink = `youtu.be/${videoId}`
  const youtubeLinkHttps = `https://${youtubeLink}`
  const items = [
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

  for (const playlist of parsePlaylists(playlistIdsText)) {
    items.push({
      title: `Link with Playlist: ${playlist.name}`,
      subtitle: 'Copy to Clipboard',
      arg: `${youtubeLinkHttps}?list=${playlist.id}`,
    })
  }

  return items
}

function parsePlaylistLine(line) {
  const trimmed = line.trim()
  if (trimmed.length === 0)
    return null

  const separator = trimmed.lastIndexOf('|')
  if (separator === -1) {
    if (!PLAYLIST_ID.test(trimmed))
      return null
    return { name: trimmed, id: trimmed }
  }

  const name = trimmed.slice(0, separator).trim()
  const id = trimmed.slice(separator + 1).trim()
  if (!PLAYLIST_ID.test(id))
    return null

  return { name: name.length > 0 ? name : id, id }
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
