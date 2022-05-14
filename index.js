import cp from 'node:child_process';
import alfy from 'alfy';

// Get either the Script Filter input or from the clipboard
const input = alfy.input || cp.spawnSync('pbpaste', {
	encoding: 'utf8',
}).stdout;

try {
	const regex = /(?:youtube.[a-z]+\/[a-z?&]*v[/|=]|youtu.be\/)([\w-]+)/g;
	const youtubeLinkParts = regex.exec(input.trim());
	const thumbnailLink = `https://i3.ytimg.com/vi/${youtubeLinkParts[1]}/maxresdefault.jpg`.trim();
	alfy.output([
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
	]);
} catch {
	alfy.output([{
		title: 'YT Thumbnail Link: Last clipboard entry is not a valid Youtube link.',
		subtitle: 'Please try again…',
	}]);
}

