
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

function load_font_outlines_from_ttf(font_array: ArrayBuffer) {
	let view = new DataView(font_array)
	function u8(offset: number) { return view.getUint8(offset) }
	function u32(offset: number) { return view.getUint32(offset, false) }
	function u16(offset: number) { return view.getUint16(offset, false) }
	let file_tag = view.getUint32(0, false)
	let file_version_major = view.getUint16(4, false)
	let file_version_minor = view.getUint16(6, false)
	let file_number_o_fonts = u32(8)
	const EEK = 'the font file you are attempting to load, is very smelly, we can not continue'
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
	interface FontTable {
		name: string,
		checksum: number,
		offset: number,
		length: number,
	}
	let tables: FontTable[] = []
	let parse_name = (table: FontTable) => {
		let version = u16(table.offset)
		let count = u16(table.offset+2)
		let storage_offset = u16(table.offset+4) + table.offset
		let lang_tag_count = 0
		if(version > 2) {
			console.error(EEK, 'this name table is MESSED UP, version', version)
		}
		if(version > 0) {
			lang_tag_count = u16(table.offset+6 + count * 12)
			if(lang_tag_count > 0) {
				console.log('name table has', lang_tag_count, 'language tags')
			}
		}

		// array of name records
		for(let rec_index = 0; rec_index < count; rec_index++) {
			let rec_offset = table.offset + 6 + (rec_index * 12)
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
		console.log('name table:', table)
	}
	let parse_cff1=(table: FontTable) => {
		let cff = table.offset
		let major = u8(cff), minor = u8(cff+1)
		let header_size = u8(cff+2)
		let offsets_size = u8(cff+3)
		if(header_size !== 4) {
			// uh
			console.error(EEK, `CFF v${major}.${minor},`, header_size, offsets_size)
			return
		}
		console.log(`CFF v${major}.${minor},`, header_size, offsets_size)
		let the_offset_thing = cff+header_size
		function read_index(init:(count:number)=>void, f:(off:number, index:number, len:number)=>void) {
			let count = u16(the_offset_thing)
			the_offset_thing += 2
			init(count)
			if(count < 1) return;
			let offsize = u8(the_offset_thing++)
			let data_offset = the_offset_thing+((count+1) * offsize)-1
			let last_offset = 0
			for(let value_index = 0; value_index <= count; value_index++) {
				let value_offset = u8(the_offset_thing++)
				if(offsize > 1) { value_offset = value_offset * 0x100 + u8(the_offset_thing++) }
				if(offsize > 2) { value_offset = value_offset * 0x100 + u8(the_offset_thing++) }
				if(offsize > 3) { value_offset = value_offset * 0x100 + u8(the_offset_thing++) }
				let value_length = value_offset - last_offset
				if(value_index > 0) {
					f(data_offset + last_offset, value_index - 1, value_length)
				}
				last_offset = value_offset
			}
			the_offset_thing = data_offset + last_offset
		}
		read_index((count) => {
			console.log('CFF names', count)
		}, (offset, index, length) => {
			let s = ''
			let the_value: number
			let maybe_length = 0
			while(maybe_length < length && (the_value = u8(offset++)) > 0) {
				maybe_length++
				if(the_value < 32) {
					s += `\\${the_value.toString(8).padStart(3,'0')}`
				} else {
					s += String.fromCodePoint(the_value)
				}
			}
			console.log('name offset', index, s, length, maybe_length)
		})
		let maybe_dict:any = {}
		read_index((count) => {
			console.log('CFF Top DICT count', count)
		}, (offset, index, length) => {
			console.log('CFF Top DICT #', index, 'len=', length)
			let meh:any[] = []
			let end = offset + length
			while(offset < end) {
				let v = u8(offset++)
				if(v >= 27 && v < 28) {
					// 22..27 => very reserved, no touch
					meh.push(`evil`)
				} else if(v == 28) {
					// 28 => -32768 .. +32767  i16: (the_bytes[1] * 0x100) + the_bytes[2]
					if(offset+1 >= end) break
					meh.push(view.getInt16(offset, false))
					offset += 2
				} else if(v == 29) {
					// 29 => +-2 bajillion     i32: (the_bytes[1] * 0x1000000) + (the_bytes[2] * 0x10000) + (the_bytes[3] * 0x100) + (the_bytes[4])
					if(offset+3 >= end) break
					meh.push(view.getInt32(offset, false))
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
						let v1 = u8(offset++)
						let n = v1 >> 4
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
							break
						}
						n = v1 & 15
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
							break
						}
					}
					meh.push(fake_number)
				} else if(v >= 32 && v <= 246) {
					//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
					meh.push(v - 139)
				} else if(v >= 247 && v <= 250) {
					// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
					if(offset >= end) break
					let v1 = u8(offset++)
					meh.push((v - 247) * 256 + v1 + 108)
				} else if(v >= 251 && v <= 254) {
					// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
					if(offset >= end) break
					let v1 = u8(offset++)
					meh.push((v - 251) * -256 - v1 - 108)
				} else if(v == 12) {
					if(offset >= end) break
					let v1 = u8(offset++)
					meh.push(`${v},${v1}`)
				} else {
					switch(v) {
					//  1 notice(SID)
					case 1: maybe_dict.notice = (meh.pop()-0); break
					//  2 fullname(SID)
					case 2: maybe_dict.fullname = (meh.pop()-0); break
					//  3 familyname(SID)
					case 3: maybe_dict.family = (meh.pop()-0); break
					//  4 weight(SID)
					case 4: maybe_dict.weight = (meh.pop()-0); break
					//  15 charset(num?=0) // charset offset from start of CFF
					case 15: maybe_dict.charset_off = (meh.pop()-0)+cff // charset offset from start of CFF
					break
					//  16 encoding(num?=0) // encoding offset from start of CFF
					case 16: maybe_dict.encoding_off = (meh.pop()-0)+cff // charset offset from start of CFF
					break
					//  17 charstrings(num) // charstrings offset from start of CFF
					case 17: maybe_dict.charstrings_off = (meh.pop()-0)+cff // charset offset from start of CFF
					break
					//  18 private(num) // private DICT size and the offset from start of CFF
					case 18: maybe_dict.private_off = (meh.pop()-0)+cff // charset offset from start of CFF
					break
					default: meh.push(`op ${v}`)
					}
				}
			}
			console.log('CFF Top dict values:', meh, maybe_dict)
		})
		if(maybe_dict.charstrings_off != undefined) {
			let sv_offset = the_offset_thing
			the_offset_thing = maybe_dict.charstrings_off
			read_index((count) => {
				console.log('CFF CharStrings count', count)
			}, (offset, index, length) => {
				//if(index > 120) return;
				let meh:any[] = []
				let end = offset + length
				//meh.push(`${u8(offset)}`)
				for(; offset < end; ) {
					let v = u8(offset++)
					if(v == 0) {
						meh.push('EVIL')
					} else if(v == 12) {
						if(offset >= end) break
						let v1 = u8(offset++)
						meh.push(`opx+${v1}`)
						break
					} else if(v == 28) {
						// 28 => -32768 .. +32767  i16
						//meh.push(`n${v}`)
						if(offset+1 >= end) break
						meh.push(view.getInt16(offset, false))
						offset += 2
					} else if(v == 255) {
						//meh.push(`n${v}`)
						// 255 => +-2 bajillion -> fixed i16.16
						if(offset+3 >= end) break
						meh.push(view.getInt32(offset, false) * 0.0000152587890625)
						offset += 4
					} else if(v >= 32 && v <= 246) {
						//meh.push(`n${v}`)
						//  32..246 =>   -107 ..   +107  (the_bytes[0] - 139)
						meh.push(v - 139)
					} else if(v >= 247 && v <= 250) {
						//meh.push(`n${v}`)
						// 247..250 =>   +108 ..  +1131  (the_bytes[0] - 247) * 0x100 + the_bytes[1] + 108
						if(offset >= end) break
						let v1 = u8(offset++)
						meh.push((v - 247) * 256 + v1 + 108)
					} else if(v >= 251 && v <= 254) {
						//meh.push(`n${v}`)
						// 251..254 =>  -1131 ..   -108 -(the_bytes[0] - 251) * 0x100 - the_bytes[1] - 108
						if(offset >= end) break
						let v1 = u8(offset++)
						meh.push((v - 251) * -256 - v1 - 108)
					} else {switch(v) {
						case 1: meh.push('hstem'); break
						case 3: meh.push('vstem'); break
						case 4: meh.push('vmoveto'); break
						case 5: meh.push('rlineto'); break
						case 6: meh.push('hlineto'); break
						case 7: meh.push('vlineto'); break
						case 8: meh.push('rrcurveto'); break
						case 10: meh.push('callsubr'); break
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
				console.log('CFF CharStrings#', index, 'len=', length, String(meh))
			})
		}
		// data layout:
		// - Header
		// version: u8 major . u8 minor
		// u8 size of header
		// offsize of absolute offsets
		// - Name INDEX[n]
		// - Top DICT INDEX => INDEX[n] of DICT
		//  DICT operators:
		//  0 version(SID)
		//  12,0 copyright(SID)
		//  12,1 is_fixed_pitch(bool?=false)
		//  12,2 italic_angle(num?=0)
		//  12,3 underline_position(num?=-100)
		//  12,4 underline_thiccness(num?=50)
		//  12,5 paint_type(num?=0) // delicious
		//  12,6 charstringtype(num?=2) // iff it's not 2, gonna scream
		//  12,7 font_matrix(array?=[0.001, 0, 0, 0.001, 0, 0])
		//  13 unique_id(num)
		//  5 font_bounds_boxes_thing(array?=[0,0,0,0])
		//  12,8 stroke_width(num?=0)
		//  14 XUID(array)
		//  12,20 synthetic_base(num) // eh, idk
		//  12,21 post_script(SID) // yummy PostScript code, in your font?! more likely then you think
		//  12,22 base_font_name(SID) // meh
		//  12,23 base_font_blend(delta) // meh
		//  some... CIDFont things
		//  12,30 ROS(SID,SID,num)
		//  12,31 CIDFontVersion(num=0)
		//  12,32 CIDFontRevision(num=0)
		//  12,33 CIDFontType(num=0)
		//  12,34 CIDCount(num=8720)
		//  12,35 UIDBase(num)
		//  12,36 FDArray(num)
		//  12,37 FDSelect(num)
		//  12,38 FontName(SID)
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
	const parsers_for_font_things:{[i:string]:(t:FontTable)=>void} = {
		'name': parse_name,
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
		console.log('look a font table!', table.name, table.checksum, table.offset, table.length)
		let maybe_parser:((t:FontTable)=>void)|undefined = parsers_for_font_things[table.name] as any
		if(maybe_parser) {
			maybe_parser(table)
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

