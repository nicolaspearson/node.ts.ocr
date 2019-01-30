import * as path from 'path';
import * as temp from 'temp';

import { ExtractTextOptions, Ocr } from '../src/index';

describe('Extract Text Tests', () => {
	it('should be able to extract pdf text from single-page.pdf', async (done) => {
		jest.setTimeout(15 * 1000);
		const fileName = 'single-page.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const result: string = await Ocr.extractText(pdfPath);
			expect(result).toBeDefined();
			expect(result).toContain('00001-001-0002');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract pdf text from single-page-ocr.pdf', async (done) => {
		jest.setTimeout(15 * 1000);
		const fileName = 'single-page-ocr.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const result: string = await Ocr.extractText(pdfPath);
			expect(result).toBeDefined();
			expect(result).toContain('00001-001-0002');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract pdf text from multi-page.pdf', async (done) => {
		jest.setTimeout(15 * 1000);
		const fileName = 'multi-page.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const options: ExtractTextOptions = { convertDensity: 400, convertArgs: { trim: '' } };
			const result: string = await Ocr.extractText(pdfPath, options);
			expect(result).toBeDefined();
			expect(result).toContain('National Airspace System');
			expect(result).toContain('WHAT BENEFITS ARE PROVIDED BY CDRs?');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract pdf text from multi-page-ocr.pdf', async (done) => {
		jest.setTimeout(15 * 1000);
		const fileName = 'multi-page-ocr.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const options: ExtractTextOptions = { pdfToTextArgs: { f: 1, l: 4 } };
			const result: string = await Ocr.extractText(pdfPath, options);
			expect(result).toBeDefined();
			expect(result).toContain('TraceMonkey');
			expect(result).toContain('relationships and object representations can change during exec');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract text from sample.png', async (done) => {
		jest.setTimeout(15 * 1000);
		const fileName = 'sample.png';
		const relativePath = path.join('sample', fileName);
		const pngPath = path.join(__dirname, relativePath);

		try {
			const tmpDir = temp.mkdirSync('tmp');
			const options: ExtractTextOptions = {
				tesseractLang: 'eng',
				tesseractArgs: { psm: 6 }
			};
			const result: string = await Ocr.invokeImageOcr(tmpDir, pngPath, options);
			expect(result).toBeDefined();
			expect(result).toContain('HellO World');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});
});
