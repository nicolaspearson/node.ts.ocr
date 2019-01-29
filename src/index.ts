import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as util from 'util';

import { binaryListener } from './listener';

export interface KeyValueResult {
	[key: string]: string | number;
}

const existsAsync = util.promisify(fs.exists);

export default class Ocr {
	/**
	 * Retrieve the pdf info using the pdf-to-text binary
	 * and parse the result to a key value object.
	 *
	 * Note: requires pdf-to-text to be installed
	 *
	 * @param path absolute path to the pdf file
	 * @return Promise<KeyValueResult>
	 */
	public static async pdfInfo(path: string): Promise<KeyValueResult> {
		try {
			const exists = await existsAsync(path);
			if (!exists) {
				throw new Error('No file exists at the path you specified');
			}
			const bin = childProcess.spawn('pdfinfo', ['-box', path]);
			return new Promise<KeyValueResult>((resolve, reject) => {
				binaryListener(bin, (error: Error | string | undefined, data?: string) => {
					if (error || !data) {
						reject(error);
					} else if (data === undefined) {
						reject(new Error('No PDF info could be extracted'));
					} else {
						resolve(this.convertDataToKeyValueObject(data));
					}
				});
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Converts input data to a key value object
	 *
	 * @param data the input data
	 * @return KeyValueResult
	 */
	private static convertDataToKeyValueObject(data: string) {
		const result: KeyValueResult = {};
		// split by new line
		const lines = data.split(/\n/g);
		for (const item of lines) {
			// split by first colon
			const line = item.split(':');

			if (line.length < 2) {
				continue;
			}

			const key = line[0]
				.trim()
				.toLowerCase()
				.replace(/ /g, '_');
			let value: string | number = '';
			for (let i = 1; i < line.length; i++) {
				if (i + 1 < line.length) {
					value += line[i].trim() + ':';
				} else {
					value += line[i].trim();
				}
			}
			if (value !== '' && !isNaN(parseInt(value, 16))) {
				value = parseFloat(value);
			} else if (value !== '' && !isNaN(Date.parse(value))) {
				value = Date.parse(value);
			}
			result[key] = value;
		}
		return result;
	}
}
