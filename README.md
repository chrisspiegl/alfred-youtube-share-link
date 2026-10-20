# alfred-youtube-share-link

Alfred workflow that turns a YouTube URL into a `youtu.be` share link.

It reads the keyword argument, or the clipboard when the argument is empty, and offers `https://youtu.be/<id>` and `youtu.be/<id>`. Press Enter to copy the selected result. If you add playlist IDs in the workflow configuration, it also offers one share link per playlist.

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

With no playlist IDs configured, the script filter shows two rows:

- `YT Share Link: https://youtu.be/<video id>`
- `YT Share Link: youtu.be/<video id>`

## Playlist IDs

Open Alfred Preferences → Workflows, select this workflow, and click **Configure Workflow**. In **Playlist IDs**, enter one YouTube playlist ID per line. Leave the field empty if you do not want playlist rows.

```
PLalpha
PLbeta
```

Those IDs are read from the workflow configuration (`playlist_ids`). They are not stored in the workflow source. For each ID, the script filter adds a row after the plain share links:

- `Link with Playlist: https://youtu.be/<video id>?list=PLalpha`
- `Link with Playlist: https://youtu.be/<video id>?list=PLbeta`

Blank lines are ignored. Text that is not a YouTube link still shows only the “not a valid youtube link” row.

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
