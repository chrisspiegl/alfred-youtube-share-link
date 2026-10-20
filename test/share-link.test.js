import assert from 'node:assert/strict'
// node:test is the workflow test runner. The antfu preset prefers vitest.
import { describe, it } from 'node:test' // eslint-disable-line test/no-import-node-test
import { extractYoutubeVideoId, shareLinkItems } from '../src/share-link.js'

const VIDEO_ID = 'dQw4w9WgXcQ'

describe('extractYoutubeVideoId', () => {
  it('keeps watch?v= links', () => {
    assert.equal(extractYoutubeVideoId(`https://www.youtube.com/watch?v=${VIDEO_ID}`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://youtube.com/watch?v=${VIDEO_ID}&t=43s`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://m.youtube.com/watch?v=${VIDEO_ID}`), VIDEO_ID)
  })

  it('keeps youtu.be links', () => {
    assert.equal(extractYoutubeVideoId(`https://youtu.be/${VIDEO_ID}`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`youtu.be/${VIDEO_ID}?t=43`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`http://youtu.be/abc_def-123`), 'abc_def-123')
  })

  it('accepts /shorts/, /embed/, and /live/', () => {
    assert.equal(extractYoutubeVideoId(`https://www.youtube.com/shorts/${VIDEO_ID}`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://www.youtube.com/shorts/${VIDEO_ID}?feature=share`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://www.youtube.com/embed/${VIDEO_ID}`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://www.youtube.com/live/${VIDEO_ID}?feature=share`), VIDEO_ID)
  })

  it('accepts music.youtube.com', () => {
    assert.equal(extractYoutubeVideoId(`https://music.youtube.com/watch?v=${VIDEO_ID}`), VIDEO_ID)
    assert.equal(extractYoutubeVideoId(`https://music.youtube.com/watch?v=${VIDEO_ID}&list=RDdQw4w9WgXcQ`), VIDEO_ID)
  })

  it('finds a link embedded in surrounding text', () => {
    assert.equal(
      extractYoutubeVideoId(`prefix https://www.youtube.com/watch?v=${VIDEO_ID} suffix`),
      VIDEO_ID,
    )
  })

  it('returns null when nothing matches', () => {
    assert.equal(extractYoutubeVideoId(''), null)
    assert.equal(extractYoutubeVideoId('   '), null)
    assert.equal(extractYoutubeVideoId('not a link'), null)
    assert.equal(extractYoutubeVideoId('https://example.com/watch?v=dQw4w9WgXcQ'), null)
    assert.equal(extractYoutubeVideoId('https://www.youtube.com/playlist?list=PLxxx'), null)
    assert.equal(extractYoutubeVideoId('https://music.youtube.com/playlist?list=OLAK5uy'), null)
    assert.equal(extractYoutubeVideoId(null), null)
  })
})

describe('shareLinkItems', () => {
  it('offers the https and bare youtu.be share links', () => {
    assert.deepEqual(shareLinkItems(`https://www.youtube.com/shorts/${VIDEO_ID}`), [
      {
        title: `YT Share Link: https://youtu.be/${VIDEO_ID}`,
        subtitle: 'Copy to Clipboard',
        arg: `https://youtu.be/${VIDEO_ID}`,
      },
      {
        title: `YT Share Link: youtu.be/${VIDEO_ID}`,
        subtitle: 'Copy to Clipboard',
        arg: `youtu.be/${VIDEO_ID}`,
      },
    ])
  })

  it('returns an explicit no-match item', () => {
    assert.deepEqual(shareLinkItems('not a youtube link'), [{
      title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
      subtitle: 'Please try again…',
    }])
    assert.deepEqual(shareLinkItems(undefined), [{
      title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
      subtitle: 'Please try again…',
    }])
  })
})
