"use client"

export default function OriginalPdf({ url }: { url: string }) {
	return (
		<div className="border rounded bg-white">
			<iframe
				src={`${url}#toolbar=0&navpanes=0`}
				title="Original CV"
				className="w-full h-[720px] rounded"
				style={{ border: 'none' }}
			/>
			<div className="text-sm text-gray-500 p-2">
				If the preview does not load, <a href={url} target="_blank" rel="noreferrer" className="text-primary-600 underline">open the PDF</a> in a new tab.
			</div>
		</div>
	)
}
