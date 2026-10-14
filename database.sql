CREATE DATABASE IF NOT EXISTS `kinobase_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kinobase_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(30) NOT NULL UNIQUE,
  `user_password` varchar(64) NOT NULL,
  `user_fio` varchar(120) NOT NULL,
  `user_email` varchar(100) NOT NULL UNIQUE,
  `user_avatar` varchar(255) NOT NULL DEFAULT 'images/logo.png',
  `user_hash` varchar(32) NOT NULL DEFAULT '',
  `user_ip` int(10) unsigned NOT NULL DEFAULT '0',
  `reset_token` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;