import { Unibabel } from 'unibabel';

export default function(b64Data, extension) {
	const mimeTypesTable = {
		pdf: 'application/pdf',
		xls: 'application/vnd.ms-excel',
	};
	const contentType = mimeTypesTable[extension];
	const byteArrays = [Unibabel.base64ToArr(b64Data)];
	return new Blob(byteArrays, { type: contentType });
}
