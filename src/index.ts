import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as temp from 'temp';
import * as util from 'util';

interface KeyValue {
	[key: string]: string | number;
}

interface ExtractTextOptions {
	pdfToTextArgs?: KeyValue;
	convertArgs?: KeyValue;
	convertDensity?: number;
	tesseractArgs?: KeyValue;
	tesseractLang?: string;
}

const execAsync = util.promisify(childProcess.exec);
const existsAsync = util.promisify(fs.exists);
const readFileAsync = util.promisify(fs.readFile);

class Ocr {
	/**
	 * Retrieve the pdf info using the pdfinfo binary
	 * and parse the result to a key value object.
	 *
	 * Note: requires pdfinfo to be installed
	 *
	 * @param filePath absolute path to the file
	 * @returns Promise<KeyValue> the extracted pdf info
	 */
	public static async extractInfo(filePath: string): Promise<KeyValue> {
		try {
			const exists = await existsAsync(filePath);
			if (!exists) {
				throw new Error('No file exists at the path you specified');
			}
			const bin = childProcess.spawn('pdfinfo', ['-box', filePath]);
			return new Promise<KeyValue>((resolve, reject) => {
				this.binaryListener(bin, (error: Error | string | undefined, data?: string) => {
					if (error) {
						reject(error);
					} else if (data === undefined) {
						reject(new Error('PDF info could NOT be extracted'));
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
	 * Extracts the text from the pdf using the pdftotext binary
	 *
	 * Note: requires pdftotext, Tesseract, ImageMagick, and GhostScript to be installed
	 *
	 * @param filePath absolute path to the file
	 * @param options ExtractTextOptions e.g. { pdfToTextArgs: { f: 1, l: 4 } }, includes page 1 to 4
	 * @returns Promise<string> the text contained in the pdf file
	 */
	public static async extractText(filePath: string, options?: ExtractTextOptions): Promise<string> {
		try {
			const exists = await existsAsync(filePath);
			if (!exists) {
				throw new Error('No file exists at the path you specified');
			}

			const args: string[] = [];
			// Skip this step if the file is not a PDF
			if (filePath.endsWith('.pdf')) {
				if (options && options.pdfToTextArgs) {
					// Parse all provided options to command line arguments
					for (const [key, value] of Object.entries(options.pdfToTextArgs)) {
						args.push(`-${key}`);
						args.push(`${value}`);
					}
				}
				args.push('-layout');
				args.push('-enc');
				args.push('UTF-8');
				args.push(filePath);
				args.push('-');

				const bin = childProcess.spawn('pdftotext', args);
				const pdfToTextResult: string = await new Promise<string>((resolve, reject) => {
					this.binaryListener(bin, (error: Error | string | undefined, data?: string) => {
						if (error) {
							reject(error);
						} else if (data === undefined) {
							reject(new Error('PDF text could NOT be extracted'));
						} else {
							resolve(data);
						}
					});
				});

				if (pdfToTextResult && pdfToTextResult.trim() !== '') {
					// We were able to extract the text without using OCR
					return pdfToTextResult;
				}
			}

			// We need to extract the result using OCR
			// Step 1: Create a temp directory
			const tmpDir = temp.mkdirSync('tmp');

			// Step 2: Convert the PDF to a TIFF
			let tiffOutputPath: string;
			try {
				tiffOutputPath = await this.invokePdfToTiff(tmpDir, filePath, options);
			} catch (error) {
				if (error) {
					throw error;
				}
				throw new Error('Conversion from PDF to TIFF failed');
			}

			// Step 3: Perform OCR on the TIFF
			return this.invokeImageOcr(tmpDir, tiffOutputPath, options);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Converts a PDF file to its TIFF representation using the convert binary
	 *
	 * Note: requires ImageMagick, and GhostScript to be installed
	 *
	 * @param outDir the desired output directory
	 * @param filePath absolute path to the file
	 * @param options ExtractTextOptions e.g. { convertDensity: 600, convertArgs: { trim: '' } }, sets the convert density to 600, and trim to on
	 * @returns Promise<string> the output path of the generated tiff
	 */
	public static async invokePdfToTiff(
		outDir: string,
		filePath: string,
		options?: ExtractTextOptions
	): Promise<string> {
		const args: string[] = [];
		args.push('-density');
		args.push(`${options && options.convertDensity ? options.convertDensity : 300}`);
		args.push(filePath);
		if (options && options.convertArgs) {
			// Parse all provided options to command line arguments
			for (const [key, value] of Object.entries(options.convertArgs)) {
				args.push(`-${key}`);
				args.push(`${value}`);
			}
		}

		const outputPath = path.join(outDir, 'tiff_output.tiff');
		fs.writeFileSync(outputPath, undefined);
		args.push(outputPath);

		// Convert the PDF to a TIFF
		const cmd = `convert ${args.join(' ')}`;
		try {
			const { stderr } = await execAsync(cmd);
			if (stderr) {
				throw stderr;
			}
			return outputPath;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Performs OCR on an image in order to extract the text using the tesseract binary
	 *
	 * Note: requires Tesseract to be installed
	 *
	 * @param outDir the desired output directory
	 * @param imagePath absolute path to the image file
	 * @param options ExtractTextOptions e.g. { tesseractLang: 'eng', tesseractArgs: { '-psm': 6 } }, sets page segmentation mode = 6
	 * @returns Promise<string> the text contained in the image
	 */
	public static async invokeImageOcr(
		outDir: string,
		imagePath: string,
		options?: ExtractTextOptions
	): Promise<string> {
		const args: string[] = [];
		args.push('-l');
		args.push(`${options && options.tesseractLang ? options.tesseractLang : 'eng'}`);
		if (options && options.tesseractArgs) {
			// Parse all provided options to command line arguments
			for (const [key, value] of Object.entries(options.tesseractArgs)) {
				args.push(`-${key}`);
				args.push(`${value}`);
			}
		}

		const outputPath = path.join(outDir, 'output');
		const cmd = `tesseract ${imagePath} ${outputPath} ${args.join(' ')}`;
		try {
			await execAsync(cmd);
			return await readFileAsync(outputPath + '.txt', 'utf8');
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Converts input data to a key value object
	 *
	 * @param data the input data
	 * @returns KeyValue
	 */
	public static convertDataToKeyValueObject(data: string) {
		const result: KeyValue = {};
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

	/**
	 * Generic binary listener that is used to listen to output on a child process
	 *
	 * @param bin The invoked binary
	 * @param callback The callback method
	 * @returns void
	 */
	public static binaryListener(
		bin: any,
		callback: (error: Error | string | undefined, data?: string) => void
	): void {
		const monitorErr: string[] = [];
		const monitorData: string[] = [];

		bin.stdout.setEncoding('utf8');
		bin.stdout.on('data', (data: any) => {
			monitorData.push(data.toString());
		});

		bin.stderr.setEncoding('utf8');
		bin.stderr.on('data', (data: any) => {
			monitorErr.push(data.toString());
		});

		bin.on('exit', (code: number) => {
			if (code === 0) {
				return callback && callback(undefined, monitorData.join(''));
			}
			// Return errors
			return callback && callback(new Error(monitorErr.join('')));
		});
	}
}

export { ExtractTextOptions, KeyValue, Ocr };
