export interface KeyValueResult {
	[key: string]: string | number;
}

export default class Ocr {
	static pdfInfo(path: string): Promise<KeyValueResult>;
}
