DROP DATABASE IF EXISTS `digital-queue-software`;


CREATE DATABASE IF NOT EXISTS `digital-queue-software`;


CREATE TABLE IF NOT EXISTS `digital-queue-software`.`users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `telephone` VARCHAR(30) NOT NULL,
    `document` VARCHAR(50) NOT NULL,
    `documentType` VARCHAR(50) NOT NULL,
    `nationality` VARCHAR(75) NOT NULL,
    `register` DATETIME NOT NULL,
    `roleType` ENUM('admin', 'master') NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY (`email`),
    UNIQUE KEY (`document`)
);

CREATE TABLE IF NOT EXISTS `digital-queue-software`.`digital_queues` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `creation` DATETIME NOT NULL,
    `isActive` TINYINT(1) UNSIGNED NOT NULL,
    `start` DATETIME NOT NULL,
    `end` DATETIME NOT NULL,
    `personTimeMinutes` INT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `digital-queue-software`.`transports` (
    `id` TINYINT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY (`name`)
);

CREATE TABLE IF NOT EXISTS `digital-queue-software`.`digital_queues_users` (
    `digitalQueueId` VARCHAR(100) NOT NULL,
    `document` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `telephone` VARCHAR(30) NOT NULL,
    `documentType` VARCHAR(50) NOT NULL,
    `nationality` VARCHAR(75) NOT NULL,
    `register` DATETIME NOT NULL,
    `transportId` TINYINT(1) UNSIGNED NOT NULL,
    `appointment` DATETIME NOT NULL,
    `attended` DATETIME,

    PRIMARY KEY (`digitalQueueId`, `document`),
    FOREIGN KEY (`digitalQueueId`) REFERENCES `digital_queues` (`id`),
    FOREIGN KEY (`transportId`) REFERENCES `transports` (`id`)
);

CREATE TABLE IF NOT EXISTS `digital-queue-software`.`digital_queues_transports` (
    `id` TINYINT(1) UNSIGNED NOT NULL AUTO_INCREMENT,
    `digitalQueueId` VARCHAR(100) NOT NULL,
    `transportId` TINYINT(1) UNSIGNED NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`digitalQueueId`) REFERENCES `digital_queues` (`id`),
    FOREIGN KEY (`transportId`) REFERENCES `transports` (`id`)
);

INSERT INTO `digital-queue-software`.`transports`
    (`name`)
VALUES
    ('A pé'),
    ('carro');
