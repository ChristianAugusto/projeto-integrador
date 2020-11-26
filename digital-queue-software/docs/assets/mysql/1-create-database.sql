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
    `register` VARCHAR(20) NOT NULL,
    `roleType` ENUM('admin', 'master') NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY (`email`)
);

CREATE TABLE IF NOT EXISTS `digital-queue-software`.`digital_queues` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `creation` VARCHAR(20) NOT NULL,
    `isActive` TINYINT(1) UNSIGNED NOT NULL,
    `isClosed` TINYINT(1) UNSIGNED NOT NULL,
    `day` VARCHAR(10) NOT NULL,
    `start` TIME NOT NULL,
    `end` TIME NOT NULL,
    `userTimeMinutes` SMALLINT UNSIGNED NOT NULL,

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
    `telephone` VARCHAR(30) NOT NULL,
    `documentType` VARCHAR(50) NOT NULL,
    `nationality` VARCHAR(75) NOT NULL,
    `register` VARCHAR(20) NOT NULL,
    `transportId` TINYINT(1) UNSIGNED NOT NULL,
    `appointment` TIME NOT NULL,
    `attended` TINYINT(1) UNSIGNED NOT NULL,

    PRIMARY KEY (`digitalQueueId`, `document`, `documentType`),
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
    ('Carro');