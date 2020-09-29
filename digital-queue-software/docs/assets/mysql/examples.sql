-- users

INSERT INTO `digital-queue-software`.`users`
    (`name`, `email`, `password`, `telephone`, `document`, `documentType`, `nacionalidade`, `registerDate`, `roleType`)
VALUES
    ('Christian Augusto Martins dos Santos Barros', 'christianbetta@gmail.com', 'fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe', '(11) 99311-8482', '508.569.378-78', 'cpf', 'Brasil', NOW(), 'master');


INSERT INTO `digital-queue-software`.`digital_queues`
    (`name`, `slug`, `creationDate`, `isActive`)
VALUES
    ('Fila Vacina 1', 'fila-vacina-1', NOW(), 1);


INSERT INTO `digital-queue-software`.`digital_queues_transports`
    (`digitalQueueId`, `transportId`)
VALUES
    (1, 1);

INSERT INTO `digital-queue-software`.`digital_queues_transports`
    (`digitalQueueId`, `transportId`)
VALUES
    (1, 2);
