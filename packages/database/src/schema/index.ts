import { imagesRelations, images } from './tables/images';
import { muteUsers, muteUsersRelations } from './tables/mute-users';
import { postCopies, postCopiesRelations } from './tables/post-copy';
import { postTags, postTagsRelations } from './tables/post-tags';
import { posts, postsRelations } from './tables/posts';
import { tags, tagsRelations } from './tables/tags';
import { userProfiles, userProfilesRelations } from './tables/user-profiles';
import { userProviders, userProvidersRelations } from './tables/user-providers';
import { users, usersRelations } from './tables/users';

export const schema = {
  images,
  imagesRelations,
  postTags,
  postTagsRelations,
  posts,
  postsRelations,
  tags,
  tagsRelations,
  userProfiles,
  userProfilesRelations,
  userProviders,
  userProvidersRelations,
  users,
  usersRelations,
  muteUsers,
  muteUsersRelations,
  postCopies,
  postCopiesRelations,
};
