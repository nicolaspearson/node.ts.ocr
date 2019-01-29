/**
 * Generic binary listener that is used to listen to output on a child process
 *
 * @param bin The invoked binary
 * @param callback The callback method
 * @returns void
 */
export function binaryListener(
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
