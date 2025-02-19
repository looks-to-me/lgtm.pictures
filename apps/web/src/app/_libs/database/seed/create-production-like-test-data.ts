import { createId } from '@paralleldrive/cuid2';

import { database } from '..';
import { schema } from '../schema';

import type { MuteUser } from '../../../../repositories/mute-user-repository';

export const createProductionLikeUserData = async () => {
  const userId = createId();
  const user = await database().insert(schema.users).values({
    id: userId,
    registeredAt: new Date(),
  }).returning().get();
  
  const userProfile = await database().insert(schema.userProfiles).values({
    avatarUrl:'avatarUrl',
    displayName:'displayName',
    name:'name',
    userId,
  }).returning().get();
  
  const userProvider = await database().insert(schema.userProviders).values({
    sub: `sub-${userId}`,
    type: 'github',
    userId,
  }).returning().get();
  
  const imageId = createId();
  const image = await database().insert(schema.images).values({
    id: imageId,
    userId,
    height: 100,
    width: 100,
    uploadedAt: new Date(),
  }).returning().get();
  
  const postId = createId();
  const post = await database().insert(schema.posts).values({
    id: postId,
    userId,
    imageId,
    postedAt: new Date(),
    word: 'word',
  }).returning().get();
  
  const otherUserId = createId();
  const otherUser = await database().insert(schema.users).values({
    id: otherUserId,
    registeredAt: new Date(),
  }).returning().get();
  
  const muteUsers: MuteUser[] = [{
    userId: otherUserId,
    muteUserId: userId,
  },{
    userId,
    muteUserId: otherUserId,
  }];
  await database().insert(schema.muteUsers).values(muteUsers);

  const tagId = createId();
  const tag = await database().insert(schema.tags).values({
    id: tagId,
    name:'tag',
  }).returning().get();

  const postTag = await database().insert(schema.postTags).values({
    order: 0,
    postId,
    tagId,
  }).returning().get();

  return{
    user,
    userProfile,
    userProvider,
    image,
    post,
    otherUser,
    muteUsers,
    tag,
    postTag,
  };
}; 
