# alfred-youtube-share-link

Alfred workflow that turns a YouTube URL into a `youtu.be` share link.

It reads the keyword argument, or the clipboard when the argument is empty, and offers `https://youtu.be/<id>` and `youtu.be/<id>`. Press Enter to copy the selected result.

Recognized URLs:

- `watch?v=`
- `youtu.be`
- `/shorts/`
- `/embed/`
- `/live/`
- `music.youtube.com`

## Install

Requires [Alfred 5](https://alfredapp.com) with the [Powerpack](https://alfredapp.com/powerpack/) and [Node.js](https://nodejs.org) 20+ (verified on 24).

```bash
npm install --global alfred-youtube-share-link
```

## Usage

1. Open Alfred.
2. Enter `yts` to read the clipboard, or `yts https://www.youtube.com/watch?v=askdf214s` to pass a URL.
3. Press Enter to copy the share link.

## Maintainer

```bash
pnpm install
pnpm lint
pnpm test
pnpm release
```

## Release

From a clean `main` checkout, `pnpm release` prompts for the version, publishes to npm with pnpm, and creates the GitHub release. Requires npm login and a GitHub token (`GITHUB_TOKEN`) or `gh` auth.

## Related

- [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
- [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease
