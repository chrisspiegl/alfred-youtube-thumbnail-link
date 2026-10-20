# alfred-youtube-thumbnail-link

Alfred 5 workflow that builds a YouTube thumbnail link from a video URL.

Paste or type a YouTube URL. The workflow returns `https://i3.ytimg.com/vi/<id>/maxresdefault.jpg`. Press Enter to copy it. Hold Command and press Enter to open it in the default browser. With an empty query, the URL is read from the clipboard.

Supported URLs include `watch?v=`, `youtu.be`, `/shorts/`, `/embed/`, `/live/`, and `music.youtube.com`.

Some videos have no max-resolution thumbnail. This workflow always returns the `maxresdefault.jpg` URL and does not contact the network on each keystroke, so that image can be missing.

## Install

Requires [Alfred 5](https://alfredapp.com) with the [Powerpack](https://alfredapp.com/powerpack/) and [Node.js](https://nodejs.org) 20+ (verified on 24).

```bash
npm install --global alfred-youtube-thumbnail-link
```

## Usage

1. Open Alfred.
2. Enter `ytt` to use the YouTube URL on the clipboard.
3. Or pass a URL: `ytt https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Press Enter to copy the thumbnail link. Hold Command and press Enter to open it.

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

* [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
* [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease

## Improvement Ideas

### Actually check if the thumbnail exists

Use the YouTube API or similar to check if the thumbnail actually exists and provide the one which has the highest resolution (or multiple resolutions to choose from).

### Download & Copy image file to Clipboard

This would need some extra implementation to download and copy the image file. Maybe by storing it in a tmp folder? Not sure yet.
