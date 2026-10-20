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
  	const playlistUploadsChris = `&list=UUrfYnHuKRC-Worm7OmMMcLQ`
  	const playlistUploadsNicole = `&list=UU3kMsIhkQuPGObjIRoVjCZg`
	alfy.output([
		{
			title: `Link with Playlist: ${youtubeLinkHttps}${playlistUploadsChris}`,
			subtitle: 'Copy to Clipboard',
			arg: youtubeLinkHttps + playlistUploadsChris,
		},
		{
			title: `Share Link: ${youtubeLinkHttps}`,
			subtitle: 'Copy to Clipboard',
			arg: youtubeLinkHttps,
		},
		{
			title: `Share Minimal Link: ${youtubeLink}`,
			subtitle: 'Copy to Clipboard',
			arg: youtubeLink,
		},
		{
			title: `Link with Playlist Nicole Uploads: ${youtubeLinkHttps}${playlistUploadsNicole}`,
			subtitle: 'Copy to Clipboard',
			arg: youtubeLinkHttps + playlistUploadsNicole,
		},
	]);
} catch {
	alfy.output([{
		title: 'YT Share Link: Last clipboard entry is not a valid youtube link.',
		subtitle: 'Please try again…',
	}]);
}

