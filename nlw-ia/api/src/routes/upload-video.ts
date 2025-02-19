import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { fastifyMultipart } from '@fastify/multipart';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 1048576 * 25,
		}
	});

	app.post('/videos', async (request, reply) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore: Unreachable code error
		const data = await request.file();

		if(!data) {
			return reply.status(400).send({ error: 'Missing file input' });
		}

		const extension = path.extname(data.filename);

		if(extension !== '.mp3') {
			return reply.status(400).send({ error: 'Invalid input type, please upload a MP3' });
		}

		const fileBaseName = path.basename(data.filename, extension);

		const fileUploadName = `${fileBaseName}-${crypto.randomUUID()}${extension}`;

		const tmpFolderPath = path.resolve(__dirname, '../../tmp');
		const folderExists = fs.existsSync(tmpFolderPath);

		if(!folderExists) {
			fs.mkdirSync(tmpFolderPath);
		}

		const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName);

		await pump(data.file, fs.createWriteStream(uploadDestination));

		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadDestination
			}
		});

		return reply.status(201).send({ video });
	});
}
