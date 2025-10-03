
const font_name_ids = [
	/* 0 */'copyright',
	/* 1 */'family',
	/* 2 */'subfamily',
	/* 3 */'font_id',
	/* 4 */'full_name',
	/* 5 */'version',
	/* 6 */'postscript_name',
	/* 7 */'trademark',
	/* 8 */'manufacturer',
	/* 9 */'designer',
	/* 10 */'description',
	/* 11 */'vendor_url',
	/* 12 */'designer_url',
	/* 13 */'license_desc',
	/* 14 */'license_url',
	/* 15 */'reserved_n15_for_some_reason',
	/* 16 */'family_typograph',
	/* 17 */'subfamily_typograph',
	/* 18 */'compatible_full_name',
	/* 19 */'sample_text',
	/* 20 */'postscript_cid',
	/* 21 */'family_wws',
	/* 22 */'subfamily_wws',
	/* 23 */'palette_light',
	/* 24 */'palette_dark',
	/* 25 */'postscript_prefix',
]

const font_std_sids = [
'.notdef',
'space', 'exclam', 'quotedbl', 'numbersign', 'dollar',
'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright',
'asterisk', 'plus', 'comma', 'hyphen', 'period',
'slash', 'zero', 'one', 'two', 'three',
'four', 'five', 'six', 'seven', 'eight',
'nine', 'colon', 'semicolon', 'less', 'equal',
'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
'W', 'X', 'Y', 'Z', 'bracketleft',
'backslash', 'bracketright', 'asciicircum', 'underscore', 'quoteleft',
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
'exclamdown', 'cent', 'sterling', 'fraction', 'yen',
'florin', 'section', 'currency', 'quotesingle', 'quotedblleft',
'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl',
'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright',
'ellipsis', 'perthousand', 'questiondown', 'grave', 'acute',
'circumflex', 'tilde', 'macron', 'breve', 'dotaccent',
'dieresis', 'ring', 'cedilla', 'hungarumlaut', 'ogonek',
'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash',
'Oslash', 'OE', 'ordmasculine', 'ae', 'dotlessi',
'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior',
'logicalnot', 'mu', 'trademark', 'Eth', 'onehalf',
'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar',
'degree', 'thorn', 'threequarters', 'twosuperior', 'registered',
'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring',
'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis',
'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave',
'Ntilde', 'Oacute', 'Ocircumflex', 'Odieresis', 'Ograve',
'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis',
'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron', 'aacute',
'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde',
'ccedilla', 'eacute', 'ecircumflex', 'edieresis', 'egrave',
'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde',
'oacute', 'ocircumflex', 'odieresis', 'ograve', 'otilde',
'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall',
'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior',
'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'zerooldstyle', 'oneoldstyle',
'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash',
'periodsuperior', 'questionsmall', 'asuperior', 'bsuperior', 'centsuperior',
'dsuperior', 'esuperior', 'isuperior', 'lsuperior', 'msuperior',
'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior',
'ff', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior',
'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall',
'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall',
'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall',
'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall',
'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary',
'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall', 'centoldstyle',
'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall',
'Caronsmall', 'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior',
'Ogoneksmall', 'Ringsmall', 'Cedillasmall', 'questiondownsmall', 'oneeighth',
'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior',
'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior',
'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall',
'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall',
'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall',
'Oslashsmall', 'Ugravesmall', 'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall',
'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000', '001.001',
'001.002', '001.003', 'Black', 'Bold', 'Book',
'Light', 'Medium', 'Regular', 'Roman', 'Semibold',
]

class CFFIndex {
	count: number
	buf: Uint8Array
	after_offset: number
	item_offset: ((index:number)=>number)
	constructor(buf: Uint8Array, offset_to_index: number) {
		this.count = buf[offset_to_index] * 256 + buf[offset_to_index+1]
		if(this.count < 1) {
			this.after_offset = offset_to_index + 2
			this.item_offset = () => {throw new Error()}
			return
		}
		const offset_size = buf[offset_to_index+2]
		const start_of_index = offset_to_index+3
		if(offset_size === 1) {
			this.item_offset = (index) => buf[start_of_index + index] - 1
		} else if(offset_size === 2) {
			this.item_offset = (index) => {
				let offset = start_of_index + index * 2
				return buf[offset]*256 + buf[offset+1] - 1
			}
		} else if(offset_size === 3) {
			this.item_offset = (index) => {
				let offset = start_of_index + index * 3
				return ((buf[offset]<<16) | (buf[offset+1]<<8) | buf[offset+2]) - 1
			}
		} else if(offset_size === 4) {
			this.item_offset = (index) => {
				let offset = start_of_index + index * 4
				return (buf[offset]*16777216) + ((buf[offset+1]<<16) |
					(buf[offset+2]<<8) | buf[offset+3]) - 1
			}
		} else {
			throw new Error(`CFF INDEX with offset size ${offset_size}, loaded offset=${offset_to_index}+${buf.byteOffset} count=${this.count}`)
		}
		let data_offset = offset_to_index+3+((this.count+1) * offset_size)
		this.after_offset = this.item_offset(this.count) + data_offset
		this.buf = buf.subarray(data_offset, this.after_offset)
	}
	forEach(f: (buf: Uint8Array, off: number, index: number, len: number) => void) {
		let last_offset = this.item_offset(0)
		for(let value_index = 1; value_index <= this.count; value_index++) {
			let value_offset = this.item_offset(value_index)
			let value_length = value_offset - last_offset
			f(this.buf, last_offset, value_index - 1, value_length)
			last_offset = value_offset
		}
	}
}

interface FontTable {
	name: string,
	checksum: number,
	offset: number,
	length: number,
}
const EEK = 'the font file you are attempting to load, is very smelly, we can not continue'
class EEKError extends Error {
	constructor(ohnoe?:string) {
		super(ohnoe);
	}
}
const tt_platforms: (keyof typeof tt_platform_encodings)[] = [ 'unicode', 'macintosh', 'iso', 'windows', 'custom' ]
const tt_platform_encodings = {
	unknown: [],
	unicode: [
		'unicode1_0', 'unicode1_1', 'iso10646',
		'unicode_bmp', 'unicode_full', 'unicode_var', 'unicode_full_13'
	],
	macintosh: [
		/* 0 */ 'Roman',  /* 1 */ 'Japanese', /* 2 */ 'Chinese (Traditional)',
		/* 3 */ 'Korean', /* 4 */ 'Arabic',   /* 5 */ 'Hebrew',
		/* 6 */ 'Greek',  /* 7 */ 'Russian',  /* 8 */ 'RSymbol',
		/* 9 */ 'Devanagari', /* 10 */ 'Gurmukhi', /* 11 */ 'Gujarati',
		/* 12 */ 'Odia',      /* 13 */ 'Bangla',   /* 14 */ 'Tamil',
		/* 15 */ 'Telugu',    /* 16 */ 'Kannada',  /* 17 */ 'Malayalam',
		/* 18 */ 'Sinhalese', /* 19 */ 'Burmese',  /* 20 */ 'Khmer',
		/* 21 */ 'Thai',      /* 22 */ 'Laotian',  /* 23 */ 'Georgian',
		/* 24 */ 'Armenian', /* 25 */ 'Chinese (Simplified)',
		/* 26 */ 'Tibetan', /* 27 */ 'Mongolian', /* 28 */ 'Geez',
		/* 29 */ 'Slavic', /* 30 */ 'Vietnamese', /* 31 */ 'Sindhi',
		/* 32 */ 'Uninterpreted',
	],
	iso: ['ascii7', 'iso10646', 'iso8859-1'],
	windows: [
		'Symbol', 'unicode_bmp', 'ShiftJIS', 'PRC', 'Big5', 'Wansung',
		'Johab',
		'!r7', '!r8', '!r9',
		'unicode_full',
	],
	custom: [],
}
const TT_EPOCH = -3600000*24*(365*66+17)

function parse_tt_head(table: FontTable, buf: Uint8Array) {
	let view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
	let u16 = (offset: number) => view.getUint16(offset)
	let i16 = (offset: number) => view.getInt16(offset)
	let u32 = (offset: number) => view.getUint32(offset)
	let version_maj = u16(0), version_min = u16(2)
	let font_rev = u32(4), checksum_adj = u32(8)
	let magic = u32(12)
	let flags = u16(16), per_em = u16(18)
	let create_hi = u32(20), create_lo = u32(24)
	let modif_hi = u32(28), modif_lo = u32(32)
	let created = new Date(TT_EPOCH + (create_lo * 1000) + (create_hi * 0x3e800000000))
	let modifed = new Date(TT_EPOCH + (modif_lo * 1000) + (modif_hi * 0x3e800000000))
	let min_x = i16(36), min_y = i16(38), max_x = i16(40), max_y = i16(42)
	let mac_style = u16(44)
	let lowest_ppem = u16(46)
	let fdir_hint = i16(48)
	let index_to_loc = u16(50)
	let glyph_format = u16(52)
	if(version_maj != 1 || version_min != 0 || magic != 0x5f0f3cf5 || fdir_hint != 2 || glyph_format != 0) {
		console.error(EEK, `font 'head' table fields`)
	}
	console.log(`revision ${(font_rev/ 65536).toFixed(4)}`,
		'min Pix/Em:', lowest_ppem, 'units/Em:', per_em
	)
	let font_flags:any = {}
	if(mac_style & 1) font_flags.bold = true
	if(mac_style & 2) font_flags.italic = true
	if(mac_style & 4) font_flags.underline = true
	if(mac_style & 8) font_flags.outline = true
	if(mac_style & 16) font_flags.shadow = true
	if(mac_style & 32) font_flags.condensed = true
	if(mac_style & 64) font_flags.extended = true
	if(flags & 1) font_flags.baseline_y_zero = true
	if(flags & 2) font_flags.left_sidebearing_x_zero = true
	if(flags & 4) font_flags.point_size = true
	if(flags & 8) font_flags.int_scale = true
	if(flags & 16) font_flags.advance_width = true
	if(flags & 32) font_flags.vlayout = true
	if(flags & 64) font_flags.do_not_set_this_bit_or_else = true
	if(flags & 128) font_flags.layout_shenanigans = true
	if(flags & 256) font_flags.font_is_a_butterfly = true
	if(flags & 512) font_flags.rtl_headache_mode = true
	if(flags & 1024) font_flags.indic_blender = true
	if(flags & 2048) font_flags.lossless_oof = true
	if(flags & 4096) font_flags.font_metrics_look_too_familiar = true
	if(flags & 8192) font_flags.font_might_look_okay_if_blury = true
	if(flags & 16384) font_flags.this_is_not_the_font_you_are_looking_for = true
	if(flags & 32768) font_flags.font_is_made_of_pure_evil_and_should_be_excised = true
	console.log('flags', font_flags)
	console.log('c', created.toUTCString(), 'm', modifed.toUTCString())
	console.log('bounds', min_x, min_y, '-', max_x, max_y)
}

function parse_tt_name(table: FontTable, buf: Uint8Array) {
	function u16(offset: number) { return buf[offset] * 0x100 + buf[offset+1] }
	let version = u16(0)
	let count = u16(2)
	let storage_offset = u16(4)
	let lang_tag_count = 0
	if(version > 2) {
		console.error(EEK, 'this name table is MESSED UP, version', version)
		throw new EEKError('ahh')
	}
	if(version > 0) {
		lang_tag_count = u16(6 + count * 12)
		if(lang_tag_count > 0) {
			console.log('name table has', lang_tag_count, 'language tags')
		}
	}

	// array of name records
	for(let rec_index = 0; rec_index < count; rec_index++) {
		let rec_offset = 6 + (rec_index * 12)
		let platform = tt_platforms[u16(rec_offset)] ?? 'unknown',
			encoding = tt_platform_encodings[platform][u16(rec_offset+2)] ?? `Enc#${u16(rec_offset+2)}`,
			lang = u16(rec_offset+4),
			id = u16(rec_offset+6),
			length = u16(rec_offset+8),
			offset = u16(rec_offset+10) + storage_offset
		let s = ''
		//let meh: number[] = []
		let c = 0
		if(encoding === 'unicode_bmp') {
			for(let i = 0; i < length; i+=2) {
				c = u16(offset + i)
				if(c > 31) {
					s += String.fromCodePoint(c)
				} else { s += '^' + String.fromCodePoint(c + 64) }
				//meh.push(c)
			}
		}
		let key = `${platform}/${encoding}/${lang}`
		if((table as any)[key] == undefined) {
			(table as any)[key] = {}
		}
		if(font_name_ids[id] != undefined) {
			(table as any)[key][font_name_ids[id]] = s
		} else {
			(table as any)[key][`_${id}`] = s
		}
	}
	//console.log('name table:', table)
}

function parse_cmap(table: FontTable & {cmap:any}, buf: Uint8Array) {
	let u16 = (offset: number) => (buf[offset]<<8) + buf[offset+1]
	let i16 = (offset: number) => ((buf[offset]>127) ? -65536 : 0) + (buf[offset]<<8) + buf[offset+1]
	let u32 = (offset: number) => (buf[offset]*0x1000000) + (buf[offset+1]<<16) + (buf[offset+2]<<8) + buf[offset+3]
	let version = u16(0)
	let count = u16(2)
	console.log(`'cmap' table version`, version, 'with', count, 'entries')
	let cmaps:any = {}
	table.cmap = cmaps
	let oadd = (v:number) => { v = (v < 0) ? (v + 65536) : v; return v > 65535 ? v - 65536 : v }
	let hex = (v:number) => v.toString(16).padStart(4,'0')
	for(let i = 0; i < count; i++) {
		let platform = tt_platforms[u16(4+i*8)] ?? 'unknown'
		let plat_enc = tt_platform_encodings[platform]
		let encoding_id = plat_enc[u16(6+i*8)] ?? `#${u16(6+i*8)}`
		let offset = u32(8+i*8)
		let st_format = u16(offset)
		if(cmaps[encoding_id] !== undefined) {
			continue
		}
		if(st_format == 4) {
			let st_length = u16(offset+2)
			let st_lang = u16(offset+4)
			let seg_count2 = u16(offset+6)
			let seg_count = seg_count2 >> 1
			let search_range = u16(offset+8)
			let entry_sel = u16(offset+10)
			let range_shift = u16(offset+12)
			let glyphs = new Uint32Array(65536)
			cmaps[encoding_id] = glyphs
			let off_endcodes = offset+14
			let off_startcodes = off_endcodes + 2 + seg_count2
			let off_id_delta = off_startcodes + seg_count2
			let off_id_range_off = off_id_delta + seg_count2
			let off_id_array = off_id_range_off + seg_count2
			let glyph_count = 0
			for(let i = 0; i < seg_count; i++) {
				let o = i*2
				let start = u16(off_startcodes+o), end = u16(off_endcodes+o)
				let delta = i16(off_id_delta+o)
				let range_off = u16(off_id_range_off+o)
				let l = end - start + 1
				if(range_off === 0) {
					if(start == end) {
						let gid = oadd(end + delta)
						if(gid !== 0) { glyph_count++ }
						glyphs[start] = gid
						//console.log('segment', hex(end), '->', oadd(end + delta))
					} else {
						glyph_count += l
						for(let c = start; c <= end; c++) {
							glyphs[c] = oadd(c + delta)
						}
						//console.log('segment', hex(start), hex(end), '->', oadd(start + delta), oadd(end + delta))
					}
				} else {
					let gro = off_id_range_off + o + range_off //- start
					for(let c = 0; c < l; c++) {
						let gid = oadd(u16(gro + c+c) + delta)
						if(gid !== 0) {
							glyph_count++;
							glyphs[start + c] = gid
						} else {
							glyphs[start + c] = 0
						}
					}
					//console.log('segment', hex(start), hex(end), 'n', l, gro - off_id_array)
				}
			}
			console.log('cmap', encoding_id, 'glyph count:', glyph_count)
		} else if(st_format == 12) {
			let st_length = u32(offset + 4)
			let st_lang = u32(offset + 8)
			let st_groups = u32(offset + 12)
			let off_map = offset + 16
			let glyph_count = 0
			let glyph_count_bmp = 0
			let glyphs = new Uint32Array(0x110000)
			cmaps[encoding_id] = glyphs
			for(let i = 0; i < st_groups; i++) {
				let o = i * 12
				let start = u32(off_map + o)
				let end = u32(off_map + o + 4)
				let glyph_start = u32(off_map + o + 8)
				let l = end - start + 1
				for(let c = 0; c < l; c++) {
					if(c + start < 0x10000) glyph_count_bmp += 1
					glyphs[c + start] = glyph_start + c
				}
				glyph_count += l
			}
			console.log('cmap', encoding_id, 'glyph count:', glyph_count_bmp, glyph_count)
		} else {
			console.log(`cmap ${platform}/${encoding_id} @`, offset, 'format:', st_format)
		}
	}
	//console.log('cmap', table)
}

function parse_cff1(table: FontTable, cff_buf: Uint8Array) {
	function u32(offset: number) {
		return cff_buf[offset] * 0x1000000 + cff_buf[offset+1] * 0x10000 + cff_buf[offset+2] * 0x100 + cff_buf[offset+3]
	}
	function u16(offset: number) {
		return cff_buf[offset] * 0x100 + cff_buf[offset+1]
	}
	let major = cff_buf[0], minor = cff_buf[1]
	let header_size = cff_buf[2]
	let offsets_size = cff_buf[3]
	if(header_size !== 4) {
		// uh
		console.error(EEK, `CFF v${major}.${minor},`, header_size, offsets_size)
		return
	}
	console.log(`CFF v${major}.${minor},`, header_size, offsets_size)
	let cff_name_index = new CFFIndex(cff_buf, header_size)
	console.log('CFF names', cff_name_index.count)
	cff_name_index.forEach((buf, offset, index, length) => {
		let s = ''
		let the_value: number
		let maybe_length = 0
		while(maybe_length < length && (the_value = buf[offset++]) > 0) {
			maybe_length++
			if(the_value < 32) {
				s += `\\${the_value.toString(8).padStart(3,'0')}`
			} else {
				s += String.fromCodePoint(the_value)
			}
		}
		console.log('name offset', index, s, length, maybe_length)
	})
	interface CFFTopDict {
		cid_version: number,
		cid_revision: number,
		cid_count: number,
		cid_fonttype: number,
		cid_fontname?: string,
		uid_base?: number,
		fd_array?: any[],
		fd_select_off?: number,
		ros?: {
			registry: string,
			ordering: string,
			supplement: number,
		},
		italic_angle: number,
		underline_position: number,
		underline_thiccness: number,
		paint_type: number,
		charstring_type: number,
		font_matrix: [number, number, number, number, number, number],
		stroke_width: number,
		is_fixed_pitch: boolean,
		copyright?: string,
		version?: string,
		notice?: string,
		fullname?: string,
		family?: string,
		weight?: string,
		charset_off?:number,
		encoding_off?:number,
		charstrings?:CFFIndex,
		private_off?:number,
		unique_id?:number,
		bounds: [number, number, number, number],
		//[i:string]:any,
	}
	let cff_top_dict_index = new CFFIndex(cff_buf, cff_name_index.after_offset)
	let cff_strings_index = new CFFIndex(cff_buf, cff_top_dict_index.after_offset)
	let cff_gsubrs_index = new CFFIndex(cff_buf, cff_strings_index.after_offset)
	function sid_lookup(sid: number): string {
		if(sid > 390) {
			sid -= 391
			let offset = cff_strings_index.item_offset(sid)
			let end = cff_strings_index.item_offset(sid+1)
			let c: number, s:string = ''
			while(offset < end && (c = cff_strings_index.buf[offset++]) > 0) {
				s += String.fromCodePoint(c)
			}
			return s
		} else {
			return font_std_sids[sid]
		}
	}
	console.log('CFF Top DICT count', cff_top_dict_index.count)
	//
	//   operators have operands (duh)
	//   numbers are int or real'
	//   bools are ints of 0 or 1
	//   SID are string ID yummu
	//   array are like, one or more numbers, eek
	//   delta is a number or delta encoded array o' numbers
	//   delta is ***fun***, just difference between number and hte last
	enum DictKind {
		string = 0,
		number,
		bool,
		SID,
		INDEX,
		ABS_INDEX, // relative to CFF start
		DICT,
		ARRAY,
		Delta,
	}
	type DICT_ENTRY =
		[string, DictKind] |
		[string, DictKind, any] |
		[string, DictKind.ARRAY, number] |
		[string, DictKind.ARRAY, number, any] |
		((context: any, args: any[], offset:number)=>void);
	type DICT_DEF = {[i:string]: DICT_ENTRY|undefined }
	let private_dict_entries: DICT_DEF = {
		6: ['blues', DictKind.Delta],
		7: ['other_blues', DictKind.Delta],
		8: ['family_blues', DictKind.Delta],
		9: ['family_other_blues', DictKind.Delta],
		10: ['std_hw', DictKind.number],
		11: ['std_vw', DictKind.number],
		19: (context: any, args: any[], offset:number) => { // Subrs offset from start of private dict
			context.subrs = new CFFIndex(cff_buf, offset + args[0])
		},
		20: ['default_width_x', DictKind.number, 0],
		21: ['nominal_width_x', DictKind.number, 0],
		_9: ['blue_scale', DictKind.number, 0.039625], // mystery goo number (very important, probably)
		_10: ['blue_shift', DictKind.number, 7], // for lightspeed travel only
		_11: ['blue_fuzz', DictKind.number, 1], // somewhat fuzzy
		_12: ['stem_snap_h', DictKind.Delta],
		_13: ['stem_snap_v', DictKind.Delta],
		_14: ['force_bold', DictKind.bool, false],
		_17: ['language_group', DictKind.number, 0],
		_18: ['expansion_factor', DictKind.number, 0.06],
		_19: ['initial_random_seed', DictKind.number, 0],
	}
	let top_dict_entries: DICT_DEF
	top_dict_entries = {
		0: ['version', DictKind.SID],
		1: ['notice', DictKind.SID],
		2: ['fullname', DictKind.SID],
		3: ['familyname', DictKind.SID],
		4: ['weight', DictKind.SID],
		5: ['bounds', DictKind.ARRAY, 4, [0,0,0,0]],
		13: ['unique_id', DictKind.number],
		14: ['XUID', DictKind.ARRAY, 0],
		15: (context: any, args: any[]) => { // charset(num?=0) // charset offset from start of CFF
			context.charset_off = args[0] // charset offset from start of CFF
			context.charset_format = cff_buf[context.charset_off]
		},
		16: ['encoding_off', DictKind.number, 0], // encoding offset from start of CFF
		17: ['charstrings', DictKind.ABS_INDEX], // charstrings offset from start of CFF
		18: ['private', DictKind.DICT, private_dict_entries], // private DICT size and the offset from start of CFF
		_0: ['copyright', DictKind.SID],
		_1: ['is_fixed_pitch', DictKind.bool, false],
		_2: ['italic_angle', DictKind.number, 0],
		_3: ['underline_position', DictKind.number, -100],
		_4: ['underline_thiccness', DictKind.number, 50],
		_5: ['paint_type', DictKind.number, 0], // delicious
		_6: ['charstring_type', DictKind.number, 2], // iff it's not 2, gonna scream
		_7: ['font_matrix', DictKind.ARRAY, 6, [0.001, 0, 0, 0.001, 0, 0]],
		_8: ['stroke_width', DictKind.number, 0],
		_20: ['synthetic_base', DictKind.number], // eh, idk
		_21: ['post_script', DictKind.SID], // yummy PostScript code, in your font?! more likely then you think
		_22: ['base_font_name', DictKind.SID], // meh
		_23: ['base_font_blend', DictKind.Delta], // meh
		// some... CIDFont things
		_31: ['cid_version', DictKind.number, 0],
		_32: ['cid_revision', DictKind.number, 0],
		_33: ['cid_fonttype', DictKind.number, 0],
		_34: ['cid_count', DictKind.number, 8720],
		_35: ['uid_base', DictKind.number],
		_30: (context: any, args: any[]) => { // 12,30 ROS(SID,SID,num)
			if(args.length < 3) {
				throw new EEKError('CFF ROS is missing arguments')
			}
			if(context.ros) {
				throw new EEKError('CFF encountered ROS, more than once!?')
			}
			context.ros = {
				registry: sid_lookup(args.at(-3)-0),
				ordering: sid_lookup(args.at(-2)-0),
				supplement: args.at(-1),
			}
		},
		_36: (context: any, args: any[]) => {// 12,36 FDArray(num)
			let the_index = new CFFIndex(cff_buf, args[0])
			context.fd_array = []
			the_index.forEach(
			function(buf, offset:number, index:number, length:number) {
				let font_dict = load_dict(buf, offset, length, top_dict_entries)
				context.fd_array.push(font_dict)
			})
		},
		_37: (context: any, args: any[]) => { // 12,37 FDSelect(num)
			context.fd_select_off = args[0]
			context.fd_select_format = cff_buf[context.fd_select_off]
		},
		_38: ['cid_fontname', DictKind.SID],
	}
	function load_dict(buf: Uint8Array, offset:number, length:number, entries: DICT_DEF) {
		let maybe_dict: CFFTopDict = { } as CFFTopDict
		let meh:any[] = []
		let start_offset = offset
		let end = offset + length
		//  Top DICT operators:
		while(offset < end) {
			let v = buf[offset++]
			if(v >= 27 && v < 28) {
				// 22..27 => very reserved, no touch
				meh.push(`evil`)
			} else if(v == 28) {
				// 28 => -32768 .. +32767  i16: (the_bytes[1] * 0x100) + the_bytes[2]
				if(offset+1 >= end) break
				meh.push((buf[offset]<<8) | buf[offset+1])
				offset += 2
			} else if(v == 29) {
				// 29 => +-2 bajillion     i32: (the_bytes[1] * 0x1000000) + (the_bytes[2] * 0x10000) + (the_bytes[3] * 0x100) + (the_bytes[4])
				if(offset+3 >= end) break
				meh.push(buf[offset] * (1<<24) + (
					(buf[offset+1]<<16) | (buf[offset+2]<<8) | buf[offset+3]))
				offset += 4
			} else if(v == 30) {
				// 30 => real numbers, totally not fake
				//    all the bytes are nibbles, nibble[0] = the_byte >> 4, nibble[1] = the_byte & f
				//    nibbles:
				//    0..9 => digits 0..9
				//    a    => decimal point
				//    b    => the E
				//    c    => the E, but negative
				//    d    => pure evil, don't use this (aka reserved)
				//    e    => the minus, probably should only be one of these
				//    f    => end of the number,
				//            use ff iff you need to end on nibble 0,
				//            so the byte is nice and ffull
				let fake_number = 0
				let fake_exp = 1
				let fake_bias = 0
				let fake_esign = 1
				let fake_sign = 1
				let dec = 0
				while(offset < end) {
					let v1 = buf[offset++]
					function do_num(n:number) {
						if(n < 10) {
							if(dec==2) {
								fake_bias = fake_bias * 10 + n
							} else {
								fake_number = fake_number * 10 + n
							}
							if(dec==1) { fake_exp-- }
						} else if(n == 0xa) { dec = 1
						} else if(n == 0xb) { dec = 2
						} else if(n == 0xc) {
							dec = 2
							fake_esign = -1;
						} else if(n == 0xd) {
						} else if(n == 0xe) { fake_sign = -1
						} else if(v1 == 0xff || n == 0xf) {
							return true
						}
						return false
					}
					if(do_num(v1 >> 4)) { break }
					if(do_num(v1 & 15)) { break }
				}
				fake_exp += fake_esign * fake_bias
				let meh_number = fake_number
				let meh_exp = fake_exp
				let meh_div = 1
				while(fake_exp >  10) { meh_div *= 1e+10; fake_exp -= 10 }
				while(fake_exp-- > 0) { meh_div *= 10 }
				while(fake_exp < -10) { meh_div *= 1e+10; fake_exp += 10 }
				while(fake_exp++ < 0) { meh_div *= 10 }
				if(meh_exp < 0) {
					fake_number = fake_number / meh_div
				} else {
					fake_number = fake_number * meh_div
				}
				meh.push(fake_number * fake_sign)
			} else if(v >= 32 && v <= 246) {
				//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
				meh.push(v - 139)
			} else if(v >= 247 && v <= 250) {
				// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
				if(offset >= end) break
				let v1 = buf[offset++]
				meh.push((v - 247) * 256 + v1 + 108)
			} else if(v >= 251 && v <= 254) {
				// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
				if(offset >= end) break
				let v1 = buf[offset++]
				meh.push((v - 251) * -256 - v1 - 108)
			} else {
				let key: string
				if(v == 12) {
					if(offset >= end) break
					let v1 = buf[offset++]
					key = `_${v1}`
				} else {
					key = `${v}`
				}
				let maybe_entry = entries[key]
				if(maybe_entry) {
					if(typeof maybe_entry == 'function') {
						maybe_entry(maybe_dict, meh, start_offset)
					} else {
						let [prop, kind, len_or_default, array_default] = maybe_entry;
						if(kind === DictKind.INDEX) {
							maybe_dict[prop] = new CFFIndex(buf, meh[0])
						} else if(kind === DictKind.ABS_INDEX) {
							maybe_dict[prop] = new CFFIndex(cff_buf, meh[0])
						} else if(kind === DictKind.SID) {
							maybe_dict[prop] = sid_lookup(meh[0])
						} else if(kind < DictKind.DICT) {
							maybe_dict[prop] = meh[0]
						} else if(kind === DictKind.DICT) {
							maybe_dict[prop] = load_dict(cff_buf, meh[1], meh[0], len_or_default ?? {})
						} else {
							maybe_dict[prop] = meh
						}
					}
				} else {
					maybe_dict[key] = meh
				}
				meh = []
			}
		}
		console.log('DICT:', maybe_dict)
		return maybe_dict
	}
	let last_top_dict: CFFTopDict = {} as CFFTopDict
	cff_top_dict_index.forEach(function(buf, offset:number, index:number, length:number) {
		last_top_dict = load_dict(buf, offset, length, top_dict_entries)
		console.log('CFF Top DICT #', index, 'len=', length, last_top_dict)
	})
	let number_of_charstrings_we_wasted_time_on = 0
	if(last_top_dict.charstrings != undefined) {
		console.log('CFF CharStrings count', last_top_dict.charstrings.count)
		last_top_dict.charstrings.forEach((buf, offset, index, length) => {
			//if(index > 120) return;
			let meh:any[] = []
			let end = offset + length
			for(; offset < end; ) {
				let v = buf[offset++]
				if(v == 0) {
					meh.push('EVIL')
				} else if(v == 12) {
					if(offset >= end) break
					let v1 = buf[offset++]
					meh.push(`opx+${v1}`)
					break
				} else if(v == 28) {
					// 28 => -32768 .. +32767  i16
					//meh.push(`n${v}`)
					if(offset+1 >= end) break
					meh.push(buf[offset] * 0x100 + buf[offset+1])
					offset += 2
				} else if(v == 255) {
					//meh.push(`n${v}`)
					// 255 => +-2 bajillion -> fixed i16.16
					if(offset+3 >= end) break
					meh.push(
						(buf[offset] * 0x1000000
						+ (buf[offset+1]<<16)
						+ (buf[offset+2]<<8)
						+ buf[offset+3]) * 0.0000152587890625)
					offset += 4
				} else if(v >= 32 && v <= 246) {
					//meh.push(`n${v}`)
					//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
					meh.push(v - 139)
				} else if(v >= 247 && v <= 250) {
					//meh.push(`n${v}`)
					// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
					if(offset >= end) break
					let v1 = buf[offset++]
					meh.push((v - 247) * 256 + v1 + 108)
				} else if(v >= 251 && v <= 254) {
					//meh.push(`n${v}`)
					// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
					if(offset >= end) break
					let v1 = buf[offset++]
					meh.push((v - 251) * -256 - v1 - 108)
				} else {switch(v) {
					case 1: meh.push('hstem'); break
					case 3: meh.push('vstem'); break
					case 4: meh.push('vmoveto'); break
					case 5: meh.push('rlineto'); break
					case 6: meh.push('hlineto'); break
					case 7: meh.push('vlineto'); break
					case 8: meh.push('rrcurveto'); break
					case 10:
						meh.push('callsubr');
						//console.warn('callsubr without a local subroutine table')
					break
					case 11: meh.push('return'); break
					case 18: meh.push('hstemhm'); break
					case 19: meh.push('hintmask'); break
					case 20: meh.push('cntrmask'); break
					case 21: meh.push('rmoveto'); break
					case 22: meh.push('hmoveto'); break
					case 23: meh.push('vstemhm'); break
					case 24: meh.push('rcurveline'); break
					case 25: meh.push('rlinecurve'); break
					case 26: meh.push('vvcurveto'); break
					case 27: meh.push('hhcurveto'); break
					case 29: meh.push('callgsubr'); break
					case 30: meh.push('vhcurveto'); break
					case 31: meh.push('hvcurveto'); break
					case 14: meh.push(`endchar`); break
					default: meh.push(`op${v}`)
				}}
			}
			//console.log('CFF CharStrings#', index, 'len=', length, String(meh))
			number_of_charstrings_we_wasted_time_on++
		})
	}
	console.log('CFF CharStrings processed', number_of_charstrings_we_wasted_time_on)
	// data layout:
	// - Header
	// version: u8 major . u8 minor
	// u8 size of header
	// offsize of absolute offsets
	// - Name INDEX[n]
	// - Top DICT INDEX => INDEX[n] of DICT
	// - String INDEX
	// - Global Subr INDEX
	// - Encodings
	// - Charsets
	// - FDSelect on CIDFonts (onlyness)
	// - CharStrings INDEX
	// - Font DICT INDEX
	// - Private DICT
	// - Local Subr INDEX
	// - copyright junk
	// DICT type
	// keys: 1 or 2 byte operators
	// mhmhmhmhm
	// values: (variable sized number thing)
	// operator then operand(s)
	// first byte:
	// 0..21 => the oh so special operators
	//   operators have operands (duh)
	//   numbers are int or real'
	//   bools are ints of 0 or 1
	//   SID are string ID yummu
	//   array are like, one or more numbers, eek
	//   delta is a number or delta encoded array o' numbers
	//   delta is ***fun***, just difference between number and hte last
	// 12 => is the escape hatch for getting 2-byte operators
	//   DICT keys have defaults, if not provided
	// 31 => idk, special, also reserved
	//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
	// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
	// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
	// 255 => pure EVIL, definitely reserve that one
	//
	// INDEX
	// u16 count, if this is 0, it's empty
	// offsize setsizeofoffsetstoelementsofarray
	// offset[count + 1] offsets are relative to the blob o' data minus 1, first offset in blob is 1
	// u8[whatever] blob o' data
	//
}

const parsers_for_font_things:{[i:string]:((t:FontTable, buf:Uint8Array)=>void)|undefined} = {
	'head': parse_tt_head,
	'name': parse_tt_name,
	'CFF ': parse_cff1,
	'cmap': parse_cmap,
}

export function load_font_outlines_from_ttf(font_array: ArrayBuffer) {
	let view = new DataView(font_array)
	let font_buf = new Uint8Array(font_array)
	console.log('      parsing font file', font_array.byteLength)
	function u32(offset: number) { return view.getUint32(offset, false) }
	function u16(offset: number) { return font_buf[offset] * 0x100 + font_buf[offset+1] }
	let file_tag = u32(0)
	let file_version_major = u16(4)
	let file_version_minor = u16(6)
	let file_number_o_fonts = u32(8)
	if(file_tag !== 0x74746366) {
		console.error(EEK, 'main tag', file_tag)
		return
	}
	if((file_version_major !== 1 && file_version_major !== 2) || file_version_minor !== 0) {
		console.error(EEK, 'version is not very version', `${file_version_major}.${file_version_minor}`)
		return
	}
	if(file_number_o_fonts > 42069) {
		console.error(EEK, 'file has a sus number of fonts', file_number_o_fonts)
		return
	}
	let offset = 12 + (file_number_o_fonts * 4)
	if(file_version_major === 2) {
		let maybe_dsig  = u32(offset)
		let dsig_length = u32(offset+4)
		let dsig_offset = u32(offset+8)
		if(maybe_dsig === 0x44534947) {
			if(dsig_offset >= font_array.byteLength || (dsig_offset + dsig_length) >= font_array.byteLength) {
				console.error(EEK, 'font digi-signature is wandering through Narnia', dsig_offset, '>=', font_array.byteLength)
				return
			}
		}
	}
	let tables: FontTable[] = []
	for(let font_index = 0; font_index < file_number_o_fonts; font_index++) {
		let font_offset = u32(12 + (font_index * 4))
		if((font_offset + 12) >= font_array.byteLength) {
			console.error(EEK, 'font entry is lost in Narnia', font_index, 'offset:', font_offset)
			return
		}
		let font_version = u32(font_offset)
		if((font_version !== 0x10000) && (font_version !== 0x4f54544f)) {
			console.error(EEK, 'font looks too funny, unsure what it is', font_version.toString(16).padStart(8, '0'))
			return
		}
		let font_num_tables = u16(font_offset+4)
		let font_search_range_thing = u16(font_offset+6)
		let font_entry_selector_thing = u16(font_offset+8)
		let font_range_shift_thing = u16(font_offset+10)
		for(let table_index = 0; table_index < font_num_tables; table_index++) {
			let table_head_offset = font_offset + 12 + (table_index * (4+4+4+4))
			let table_tag = u32(table_head_offset)
			let table_tag_name = ''
			let table_checksum = u32(table_head_offset+4)
			let table_offset = u32(table_head_offset+8)
			let table_length = u32(table_head_offset+12)
			if(    (((table_tag >>> 24) & 255) >= 32) && (((table_tag >>> 24) & 255) < 127)
				&& (((table_tag >>> 16) & 255) >= 32) && (((table_tag >>> 16) & 255) < 127)
				&& (((table_tag >>>  8) & 255) >= 32) && (((table_tag >>>  8) & 255) < 127)
				&& (( table_tag         & 255) >= 32) && (( table_tag         & 255) < 127)
			) {
				table_tag_name = `${
					String.fromCodePoint((table_tag >>> 24) & 255) }${
					String.fromCodePoint((table_tag >>> 16) & 255) }${
					String.fromCodePoint((table_tag >>> 8) & 255) }${
					String.fromCodePoint(table_tag & 255) }`
			} else {
				table_tag_name = table_tag.toString(16).padStart(8,'0')
			}
			if((table_offset + table_length) >= font_array.byteLength) {
				console.error(EEK, 'font has a table that is lost in Narnia', font_index, 'offset:', table_offset)
				return
			}
			let existing_table = tables.find((v) =>
				(v.name === table_tag_name)
				&& (v.checksum === table_checksum)
				&& (v.offset === table_offset)
				&& (v.length === table_length))
			if(!existing_table) {
				tables.push({
					name: table_tag_name,
					checksum: table_checksum,
					offset: table_offset,
					length: table_length,
				})
			}
		}
	}
	for(let table of tables) {
		let buf = new Uint8Array(font_array, table.offset, table.length)
		let maybe_parser = parsers_for_font_things[table.name]
		if(maybe_parser) {
			console.log(`look a font '${table.name}' table!`, table.checksum.toString(16).padStart(8,'0'), table.offset, table.length)
			maybe_parser(table, buf)
		} else {
			console.log(`the '${table.name}' table is not implemented yet check=${table.checksum.toString(16).padStart(8,'0')}`, table.offset, table.length)
		}
	}
}


export async function get_the_font_data_pls() {
	let res = await fetch('NotoSerifCJK-Bold.ttc')
	if(!res.ok) {
		console.error('complaint: the font file was not downloadedable')
		return
	}
	let font_array = await res.arrayBuffer()
	load_font_outlines_from_ttf(font_array)
}

