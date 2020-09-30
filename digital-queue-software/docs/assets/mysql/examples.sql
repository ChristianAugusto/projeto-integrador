-- users

INSERT INTO `digital-queue-software`.`users`
    (`name`, `email`, `password`, `telephone`, `document`, `documentType`, `nationality`, `register`, `roleType`)
VALUES
    ('Christian Augusto Martins dos Santos Barros', 'christianbetta@gmail.com', 'fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe', '(11) 99311-8482', '508.569.378-78', 'cpf', 'Brasil', '2020-09-30 08:00:00', 'master');


INSERT INTO `digital-queue-software`.`digital_queues`
    (`name`, `slug`, `creation`, `isActive`, `start`, `end`, `personTimeMinutes`)
VALUES
    ('Fila Vacina 1', 'fila-vacina-1', '2020-09-30 08:00:00', 1, '2020-09-30 09:00:00', '2020-09-30 18:00:00', 5);
