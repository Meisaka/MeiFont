
import * as fontfile from './src/fontfile.ts'
import * as fs from 'node:fs'
(async function() {
	let file = await fs.promises.readFile('./NotoSerifCJK-Bold.ttc')
	fontfile.load_font_outlines_from_ttf(file.buffer)
})()

