
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

class CFFIndex {
	count: number
	buf: Uint8Array
	start_of_index: number
	offset_size: number
	data_offset: number
	after_offset: number
	constructor(buf: Uint8Array, offset_to_index: number) {
		this.buf = buf
		this.count = buf[offset_to_index] * 0x100 + buf[offset_to_index+1]
		if(this.count < 1) {
			this.offset_size = 0
			this.after_offset = offset_to_index + 2
			this.data_offset = offset_to_index + 1
			this.start_of_index = offset_to_index + 2
			return
		}
		this.offset_size = buf[offset_to_index+2]
		this.start_of_index = offset_to_index+3
		this.data_offset = offset_to_index+3+((this.count+1) * this.offset_size)-1
		this.after_offset = this.item_offset(this.count)
	}
	item_offset(index:number):number {
		let offset = this.start_of_index + index * this.offset_size
		let value_offset = this.buf[offset]
		if(this.offset_size > 1) {
			value_offset = value_offset * 0x100 + this.buf[offset+1]
		}
		if(this.offset_size > 2) {
			value_offset = value_offset * 0x100 + this.buf[offset+2]
		}
		if(this.offset_size > 3) {
			value_offset = value_offset * 0x100 + this.buf[offset+3]
		}
		return value_offset + this.data_offset
	}
	forEach(f: (off: number, index: number, len: number) => void) {
		let last_offset = 0
		for(let value_index = 0; value_index <= this.count; value_index++) {
			let value_offset = this.item_offset(value_index)
			let value_length = value_offset - last_offset
			if(value_index > 0) {
				f(last_offset, value_index - 1, value_length)
			}
			last_offset = value_offset
		}
	}
}

function read_index(
	buf: Uint8Array, the_offset_thing: number,
	init: (count: number) => void,
	f: (off: number, index: number, len: number) => void
):CFFIndex {
	let index_obj = new CFFIndex(buf, the_offset_thing)
	init(index_obj.count)
	let last_offset = 0
	for(let value_index = 0; value_index <= index_obj.count; value_index++) {
		let value_offset = index_obj.item_offset(value_index)
		let value_length = value_offset - last_offset
		if(value_index > 0) {
			f(index_obj.data_offset + last_offset, value_index - 1, value_length)
		}
		last_offset = value_offset
	}
	return index_obj
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
		let platform = u16(rec_offset),
			encoding = u16(rec_offset+2),
			lang = u16(rec_offset+4),
			id = u16(rec_offset+6),
			length = u16(rec_offset+8),
			offset = u16(rec_offset+10) + storage_offset
		let s = ''
		//let meh: number[] = []
		let c = 0
		if(platform === 3 && encoding === 1) {
			for(let i = 0; i < length; i+=2) {
				c = u16(offset + i)
				if(c > 31) {
					s += String.fromCodePoint(c)
				} else { s += '^' + String.fromCodePoint(c + 64) }
				//meh.push(c)
			}
			let key = `windows_unicode_${lang}`
			if((table as any)[key] == undefined) {
				(table as any)[key] = {}
			}
			if(font_name_ids[id] != undefined) {
				(table as any)[key][font_name_ids[id]] = s
			} else {
				(table as any)[key][`_${id}`] = s
			}
		} else {
			console.log('name rec with a most uncomprehensible encoding', platform, encoding, lang, id, length, offset)
		}
	}
	//console.log('name table:', table)
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
	cff_name_index.forEach((offset, index, length) => {
		let s = ''
		let the_value: number
		let maybe_length = 0
		while(maybe_length < length && (the_value = cff_buf[offset++]) > 0) {
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
			while(offset < end && (c = cff_buf[offset++]) > 0) {
				s += String.fromCodePoint(c)
			}
			return s
		} else {
			return '<predefined string that i am too lazy to put in the source code yet>'
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
		number = 1,
		bool = 2,
		SID = 3,
		INDEX = 4,
		DICT = 5,
		ARRAY = 6,
		Delta = 7,
	}
	type DICT_ENTRY =
		[string, DictKind] |
		[string, DictKind, any] |
		[string, DictKind.ARRAY, number] |
		[string, DictKind.ARRAY, number, any] |
		((context: any, args: any[], offset:number)=>void);
	type DICT_DEF = {[i:string]: DICT_ENTRY|undefined }
	let private_dict_entries: DICT_DEF = {
		19: (context: any, args: any[], offset:number) => { // Subrs offset from start of private dict
			context.private = new CFFIndex(cff_buf, offset + args[0])
		},
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
		17: ['charstrings', DictKind.INDEX], // charstrings offset from start of CFF
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
			function(offset:number, index:number, length:number) {
				let font_dict = load_dict(offset, length, top_dict_entries)
				context.fd_array.push(font_dict)
			})
		},
		_37: (context: any, args: any[]) => { // 12,37 FDSelect(num)
			context.fd_select_off = args[0]
			context.fd_select_format = cff_buf[context.fd_select_off]
		},
		_38: ['cid_fontname', DictKind.SID],
	}
	function load_dict(offset:number, length:number, entries: DICT_DEF) {
		let maybe_dict: CFFTopDict = { } as CFFTopDict
		let meh:any[] = []
		let start_offset = offset
		let end = offset + length
		//  Top DICT operators:
		while(offset < end) {
			let v = cff_buf[offset++]
			if(v >= 27 && v < 28) {
				// 22..27 => very reserved, no touch
				meh.push(`evil`)
			} else if(v == 28) {
				// 28 => -32768 .. +32767  i16: (the_bytes[1] * 0x100) + the_bytes[2]
				if(offset+1 >= end) break
				meh.push(u16(offset))
				offset += 2
			} else if(v == 29) {
				// 29 => +-2 bajillion     i32: (the_bytes[1] * 0x1000000) + (the_bytes[2] * 0x10000) + (the_bytes[3] * 0x100) + (the_bytes[4])
				if(offset+3 >= end) break
				meh.push(u32(offset))
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
				let fake_number = ''
				while(offset < end) {
					let v1 = cff_buf[offset++]
					function do_num(n:number) {
						if(n < 10) {
							fake_number += `${n}`
						} else if(n == 10) {
							fake_number += '.'
						} else if(n == 0xb) {
							fake_number += 'E'
						} else if(n == 0xc) {
							fake_number += 'E-'
						} else if(n == 0xd) {
							fake_number += '?'
						} else if(n == 0xe) {
							fake_number += '-'
						} else if(v1 == 0xff || n == 0xf) {
							return true
						}
						return false
					}
					if(do_num(v1 >> 4)) { break }
					if(do_num(v1 & 15)) { break }
				}
				meh.push(fake_number)
			} else if(v >= 32 && v <= 246) {
				//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
				meh.push(v - 139)
			} else if(v >= 247 && v <= 250) {
				// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
				if(offset >= end) break
				let v1 = cff_buf[offset++]
				meh.push((v - 247) * 256 + v1 + 108)
			} else if(v >= 251 && v <= 254) {
				// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
				if(offset >= end) break
				let v1 = cff_buf[offset++]
				meh.push((v - 251) * -256 - v1 - 108)
			} else {
				let key: string
				if(v == 12) {
					if(offset >= end) break
					let v1 = cff_buf[offset++]
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
							maybe_dict[prop] = new CFFIndex(cff_buf, meh[0])
						} else if(kind === DictKind.SID) {
							maybe_dict[prop] = sid_lookup(meh[0])
						} else if(kind < DictKind.DICT) {
							maybe_dict[prop] = meh[0]
						} else if(kind === DictKind.DICT) {
							maybe_dict[prop] = load_dict(meh[1], meh[0], len_or_default ?? {})
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
		console.log('CFF Top dict values:', meh, maybe_dict)
		return maybe_dict
	}
	let last_top_dict: CFFTopDict = {} as CFFTopDict
	cff_top_dict_index.forEach(function(offset:number, index:number, length:number) {
		console.log('CFF Top DICT #', index, 'len=', length)
		last_top_dict = load_dict(offset, length, top_dict_entries)
	})
	let number_of_charstrings_we_wasted_time_on = 0
	if(last_top_dict.charstrings != undefined) {
		console.log('CFF CharStrings count', last_top_dict.charstrings.count)
		last_top_dict.charstrings.forEach((offset, index, length) => {
			//if(index > 120) return;
			let meh:any[] = []
			let end = offset + length
			for(; offset < end; ) {
				let v = cff_buf[offset++]
				if(v == 0) {
					meh.push('EVIL')
				} else if(v == 12) {
					if(offset >= end) break
					let v1 = cff_buf[offset++]
					meh.push(`opx+${v1}`)
					break
				} else if(v == 28) {
					// 28 => -32768 .. +32767  i16
					//meh.push(`n${v}`)
					if(offset+1 >= end) break
					meh.push(u16(offset))
					offset += 2
				} else if(v == 255) {
					//meh.push(`n${v}`)
					// 255 => +-2 bajillion -> fixed i16.16
					if(offset+3 >= end) break
					meh.push(u32(offset) * 0.0000152587890625)
					offset += 4
				} else if(v >= 32 && v <= 246) {
					//meh.push(`n${v}`)
					//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
					meh.push(v - 139)
				} else if(v >= 247 && v <= 250) {
					//meh.push(`n${v}`)
					// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
					if(offset >= end) break
					let v1 = cff_buf[offset++]
					meh.push((v - 247) * 256 + v1 + 108)
				} else if(v >= 251 && v <= 254) {
					//meh.push(`n${v}`)
					// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
					if(offset >= end) break
					let v1 = cff_buf[offset++]
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
	const parsers_for_font_things:{[i:string]:((t:FontTable, buf:Uint8Array)=>void)|undefined} = {
		'name': parse_tt_name,
		'CFF ': parse_cff1,
	}
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

