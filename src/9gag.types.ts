namespace Gag {
	export interface SocialMediaPosting {
		'@id': string,
		'mainEntityOfPage': string,
		headline: string;
		image: string;

		author: {
			name: string;
			url: string;
		}

		video: {
			name: string;
			description: string;
			thumbnailUrl: string;
			uploadDate: string;
			contentUrl: string;
			duration: string;
		}
	}

	export interface GagConfig {
		config: Config;
		data: {
			post: Post;
		};
	}

	interface Config {
		page_key: string;
		domain: string;
		appName: string;
		appVersion: string;
		appEmbed: boolean;
		staticAssetPath: string;
		commentOptions: CommentOptions;
		profile: Profile;
	}

	interface CommentOptions {
		appId: string;
		host: string;
		cdnHost: string;
	}

	interface Profile {
		activeDuration: number;
	}

	export interface Post {
		id: string;
		url: string;
		title: string;
		description: string;
		type: 'Animated' | 'Photo';
		nsfw: number;
		upVoteCount: number;
		downVoteCount: number;
		creationTs: number;
		promoted: number;
		badges: any[];
		isVoteMasked: number;
		hasLongPostCover: number;
		images: Images;
		sourceDomain: string;
		sourceUrl: string;
		awardUsers: AwardUser[];
		awardState: number;
		awardUsersCount: number;
		superVotePoints: number;
		superVoteUsersCount: number;
		creator: Creator;
		isAnonymous: boolean;
		commentsCount: number;
		comment: Comment;
		postSection: PostSection;
		tags: Tag[];
		annotationTags: string[];
		interests: string[];
	}

	interface Images {
		image700: Image700;
		image460: Image460;
		imageFbThumbnail: ImageFbThumbnail;
		image460sv: Image460sv | undefined;
	}

	interface Image700 {
		width: number;
		height: number;
		url: string;
	}

	interface Image460 extends Image700 {
		webpUrl: string;
	}

	interface ImageFbThumbnail {
		width: number;
		height: number;
		url: string;
	}

	interface Image460sv extends Image700 {
		hasAudio: number;
		duration: number;
		vp8Url: string;
		h265Url: string;
		vp9Url: string;
		av1Url: string;
	}

	interface AwardUser {
		userId: string;
		accountId: string;
		username: string;
		fullName: string;
		emojiStatus: string;
		about: string;
		avatarUrl: string;
		profileUrl: string;
		isActivePro: boolean;
		isActiveProPlus: boolean;
		isVerifiedAccount: boolean;
		creationTs: number;
		activeTs: number;
		preferences: Preferences;
	}

	interface Preferences {
		hideProBadge: number;
		hideActiveTs: number;
		accentColor: string;
		backgroundColor: string;
	}

	interface Creator extends AwardUser {
	}

	interface Comment {
		listType: string;
		updateTs: number;
		latestCommentText: string;
		opToken: string;
		canAnonymous: boolean;
		pinnedCommentCount: number;
	}

	interface PostSection {
		name: string;
		url: string;
		imageUrl: string;
	}

	interface Tag {
		key: string;
		url: string;
	}
}
