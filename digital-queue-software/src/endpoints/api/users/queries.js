export const insertUserQuery = 'INSERT INTO `users` (`name`, `email`, `password`, `telephone`, `document`, `documentType`, `nationality`, `register`, `roleType`)';

export const selectUsersQuery = 'SELECT * FROM `users` LIMIT';

export const filterUserById = 'SELECT * FROM `users` WHERE `id`';

export const filterUserByEmail = 'SELECT * FROM `users` WHERE `email`';
