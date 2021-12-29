import cp from 'node:child_process';
import alfy from 'alfy';

// Get either the Script Filter input or from the clipboard
const input = alfy.input || cp.spawnSync('pbpaste', {
	encoding: 'utf8',
}).stdout;

try {
	const regex = /(?:youtube.[a-z]+\/[a-z?&]*v[/|=]|youtu.be\/)([\w-]+)/g;
	const youtubeLinkParts = regex.exec(input.trim());
	const youtubeLink = `youtu.be/${youtubeLinkParts[1]}`.trim();
	const youtubeLinkHttps = `https://${youtubeLink}`;
	alfy.output([
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
	]);
} catch {
	alfy.output([{
		title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
		subtitle: 'Please try again…',
	}]);
}

