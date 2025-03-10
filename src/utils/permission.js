import Mongo from '../librarys/database.js';
const permDb = new Mongo('perm');

const permissionList = Object.freeze({
  root: 4,
  admin: 3,
  user: 2,
  none: 1,
});

let permissions = new Map();

export function getUserPerm(userId) {
  return permissions.get(Number(userId)) || 'user';
}
export function checkPerm(userId, perm) {
  let userPerm = 2;
  const userLevel = permissions.get(Number(userId));
  if (userLevel) {
    userPerm = userLevel;
  }

  return userPerm >= permissionList[perm];
}

export function comparePerm(executorId, targetUserId, perm) {
  const targetLevel = permissions.get(Number(executorId));
  if (!targetLevel || targetLevel <= permissionList[perm]) return false;
  const targetUserLevel = permissions.get(Number(targetUserId));
  if (!targetUserLevel) return true;
  return targetLevel > targetUserLevel;
}

export async function setPerm(userId, perm) {
  if (!permissionList[perm]) return false;
  const res = await permDb.col.updateOne(
    { id: Number(userId) },
    { $set: { perm: permissionList[perm] } },
    { upsert: true }
  );

  res.acknowledged && permissions.set(Number(userId), permissionList[perm]);
  return res.acknowledged;
}

export async function permsInit() {
  const users = await permDb.col.find().toArray();
  permissions = new Map(users.map((user) => [user.id, user.perm]));
}
