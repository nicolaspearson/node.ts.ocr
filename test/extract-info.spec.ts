import * as path from 'path';

import { KeyValue, Ocr } from '../src/index';

describe('Extract Info Tests', () => {
	it('should be able to extract pdf info from single-page.pdf', async (done) => {
		const fileName = 'single-page.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const result: KeyValue = await Ocr.extractInfo(pdfPath);
			expect(result).toBeDefined();
			expect(result).toHaveProperty('creator');
			expect(result).toHaveProperty('producer');
			expect(result).toHaveProperty('creationdate');
			expect(result).toHaveProperty('moddate');
			expect(result).toHaveProperty('tagged');
			expect(result).toHaveProperty('form');
			expect(result).toHaveProperty('pages');
			expect(result).toHaveProperty('encrypted');
			expect(result).toHaveProperty('page_size');
			expect(result).toHaveProperty('mediabox');
			expect(result).toHaveProperty('cropbox');
			expect(result).toHaveProperty('bleedbox');
			expect(result).toHaveProperty('trimbox');
			expect(result).toHaveProperty('artbox');
			expect(result).toHaveProperty('file_size');
			expect(result).toHaveProperty('optimized');
			expect(result).toHaveProperty('pdf_version');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract pdf info from single-page-ocr.pdf', async (done) => {
		const fileName = 'single-page-ocr.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const result: KeyValue = await Ocr.extractInfo(pdfPath);
			expect(result).toBeDefined();
			expect(result).toHaveProperty('creator');
			expect(result).toHaveProperty('producer');
			expect(result).toHaveProperty('creationdate');
			expect(result).toHaveProperty('moddate');
			expect(result).toHaveProperty('tagged');
			expect(result).toHaveProperty('form');
			expect(result).toHaveProperty('pages');
			expect(result).toHaveProperty('encrypted');
			expect(result).toHaveProperty('page_size');
			expect(result).toHaveProperty('mediabox');
			expect(result).toHaveProperty('cropbox');
			expect(result).toHaveProperty('bleedbox');
			expect(result).toHaveProperty('trimbox');
			expect(result).toHaveProperty('artbox');
			expect(result).toHaveProperty('file_size');
			expect(result).toHaveProperty('optimized');
			expect(result).toHaveProperty('pdf_version');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});

	it('should be able to extract pdf info from multi-page.pdf', async (done) => {
		const fileName = 'multi-page.pdf';
		const relativePath = path.join('sample', fileName);
		const pdfPath = path.join(__dirname, relativePath);

		try {
			const result: KeyValue = await Ocr.extractInfo(pdfPath);
			expect(result).toBeDefined();
			expect(result).toHaveProperty('creator');
			expect(result).toHaveProperty('producer');
			expect(result).toHaveProperty('creationdate');
			expect(result).toHaveProperty('moddate');
			expect(result).toHaveProperty('tagged');
			expect(result).toHaveProperty('form');
			expect(result).toHaveProperty('pages');
			expect(result).toHaveProperty('encrypted');
			expect(result).toHaveProperty('page_size');
			expect(result).toHaveProperty('mediabox');
			expect(result).toHaveProperty('cropbox');
			expect(result).toHaveProperty('bleedbox');
			expect(result).toHaveProperty('trimbox');
			expect(result).toHaveProperty('artbox');
			expect(result).toHaveProperty('file_size');
			expect(result).toHaveProperty('optimized');
			expect(result).toHaveProperty('pdf_version');
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error);
		}

		done();
	});
});
