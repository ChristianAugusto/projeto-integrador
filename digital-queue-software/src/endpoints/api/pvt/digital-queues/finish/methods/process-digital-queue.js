import moment from 'moment-timezone';
import fs from 'fs';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import CSV from '../types/csv';
import {
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER,
    SELECT_TRANSPORTS_QUERY_BUILDER,
    UPDATE_DIGITAL_QUEUE_QUERY_BUILDER,
    DELETE_DIGITAL_QUEUE_USERS,
    PUBLIC_PATH
} from '@ServerConstants';



/**
    * @param {Object} digitalQueue
    * @param {Object} today
*/
export default async function(digitalQueue, today) {
    const digitalQueueDate = moment(digitalQueue.day, 'YYYY-MM-DD');

    if (!digitalQueueDate.isBefore(today)) {
        return;
    }

    logger.info(`Old date, ${digitalQueue.day} < ${today.toString()}`);


    if (!fs.existsSync(`${PUBLIC_PATH}/csvs`)) {
        fs.mkdirSync(`${PUBLIC_PATH}/csvs`);
    }


    const csvName = `${PUBLIC_PATH}/csvs/${digitalQueue.day}-${digitalQueue.id}`;
    const csvHeader = [
        'Id fila digital', 'Nome', 'Documento', 'Tipo de documento', 'Email',
        'Telefone', 'Nacionalidade', 'Horário do Registro', 'Horário Escolhido',
        'Foi atendido', 'Nome do Transporte'
    ];
    const delimiter = '|';


    const csv = new CSV(csvName, delimiter);
    csv.writeHeader(csvHeader);


    const PAGE_SIZE = 20;
    let page = 0;
    let totalUsersWritten = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const digitalQueueUsers = await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER(
            '*', `WHERE \`digitalQueueId\` = '${digitalQueue.id}'`, `LIMIT ${page},${PAGE_SIZE}`
        ));

        const pageSize = digitalQueueUsers.length;
        logger.info(`digitalQueueUsers.length = ${pageSize}`);

        if (!pageSize || pageSize === 0) {
            logger.info('No digital queues users to process');
            break;
        }


        let usersWritten = 0;

        for (let i = 0; i < digitalQueueUsers.length; i++) {
            const transportName = (await mysql(SELECT_TRANSPORTS_QUERY_BUILDER(
                '`name`', `WHERE \`id\` = ${digitalQueueUsers[i].transportId}`
            )))[0].name;

            const values = [
                digitalQueue.id, digitalQueueUsers[i].name,
                digitalQueueUsers[i].document, digitalQueueUsers[i].documentType,
                digitalQueueUsers[i].email, digitalQueueUsers[i].telephone,
                digitalQueueUsers[i].nationality, digitalQueueUsers[i].register,
                digitalQueueUsers[i].appointment, digitalQueueUsers[i].attended ? 'Sim' : 'Não',
                transportName
            ];

            csv.writeLine(values);

            usersWritten++;
            totalUsersWritten++;
        }

        if (usersWritten != pageSize) {
            throw new Error('User(s) not wrote');
        }


        page += PAGE_SIZE;
    }


    logger.info(`totalUsersWritten = ${totalUsersWritten}`);


    const updateDigitalQueueUsersQuery = UPDATE_DIGITAL_QUEUE_QUERY_BUILDER(
        'SET `isClosed` = 1',
        `\`id\` = '${digitalQueue.id}'`
    );

    logger.info(`updateDigitalQueueUsersQuery = ${updateDigitalQueueUsersQuery}`);

    await mysql(updateDigitalQueueUsersQuery);


    const deleteDigitalQueueUsersQuery = DELETE_DIGITAL_QUEUE_USERS(`\`digitalQueueId\` = '${digitalQueue.id}'`);

    logger.info(`deleteDigitalQueueUsersQuery = ${deleteDigitalQueueUsersQuery}`);

    await mysql(deleteDigitalQueueUsersQuery);
}
