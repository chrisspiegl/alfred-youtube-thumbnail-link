# alfred-youtube-thumbnail-link

> [Alfred](https://alfredapp.com) workflow to generate the YouTube short link from a url in your clipboard

<img src="media/screenshot.png" style="width: 100%;">

Get the link to a Youtube video Thumbnail form a video link in your clipboard and copy it to your clipboard.

## Install

```bash
npm install --global alfred-youtube-thumbnail-link
```

*Requires [Node.js](https://nodejs.org) 14+ and the Alfred [Powerpack](https://alfredapp.com/powerpack/).*

## Usage

1. Open Alfred
2. Either enter `ytt` for clipboard shortening
3. Or provide the url via `ytt https://youtube.com/watch?v=askdf214s`
4. Hit <kbd>Enter</kbd> to copy the copy the YouTube thumbnail link to your clipboard

## Related

* [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
* [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease

## Improvement Ideas

### Actually check if the thumbnail exists

Use the YouTube API or similar to check if the thumbnail actually exists and provide the one which has the highest resolution (or multiple resolutions to choose from).

### Download & Copy image file to Clipboard

This would need some extra implementation to download and copy the image file. Maybe by storing it in a tmp folder? Not sure yet.
