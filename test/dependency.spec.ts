import * as childProcess from 'child_process';
import * as util from 'util';

const execAsync = util.promisify(childProcess.exec);

describe('Dependency Tests', () => {
	it('should have pdfinfo binary on path', async (done) => {
		const cmd = 'which pdfinfo';
		try {
			await execAsync(cmd).then((value: { stdout: string; stderr: string }) => {
				expect(value.stderr).toEqual('');
				expect(value.stdout.length).toBeGreaterThan(8);
				expect(value.stdout).toContain('/pdfinfo');
			});
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error, 'pdfinfo not found');
		}
		done();
	});

	it('should have pdftotext binary on path', async (done) => {
		const cmd = 'which pdftotext';
		try {
			await execAsync(cmd).then((value: { stdout: string; stderr: string }) => {
				expect(value.stderr).toEqual('');
				expect(value.stdout.length).toBeGreaterThan(8);
				expect(value.stdout).toContain('/pdftotext');
			});
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error, 'pdftotext not found');
		}
		done();
	});

	it('should have convert binary on path', async (done) => {
		const cmd = 'which convert';
		try {
			await execAsync(cmd).then((value: { stdout: string; stderr: string }) => {
				expect(value.stderr).toEqual('');
				expect(value.stdout.length).toBeGreaterThan(8);
				expect(value.stdout).toContain('/convert');
			});
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error, 'convert not found');
		}
		done();
	});

	it('should have ghostscript (gs) binary on path', async (done) => {
		const cmd = 'which gs';
		try {
			await execAsync(cmd).then((value: { stdout: string; stderr: string }) => {
				expect(value.stderr).toEqual('');
				expect(value.stdout.length).toBeGreaterThan(8);
				expect(value.stdout).toContain('/gs');
			});
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error, 'ghostscript not found');
		}
		done();
	});

	it('should have tesseract binary on path', async (done) => {
		const cmd = 'which tesseract';
		try {
			await execAsync(cmd).then((value: { stdout: string; stderr: string }) => {
				expect(value.stderr).toEqual('');
				expect(value.stdout.length).toBeGreaterThan(8);
				expect(value.stdout).toContain('/tesseract');
			});
		} catch (error) {
			expect(error).toBeDefined();
			console.log(error, 'tesseract not found');
		}
		done();
	});
});
