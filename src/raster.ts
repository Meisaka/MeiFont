
export function ohNoes() {
	return { meh: true }
}

export function sq(n: number): number { return n*n }

export class Box {
	x0 = 0
	y0 = 0
	x1 = 0
	y1 = 0
	kind = false
	constructor(x0?: number, y0?: number, x1?:number, y1?:number, _t?:boolean) {
		if(x0 !== undefined && y0 !== undefined) {
			this.x0 = x0
			this.y0 = y0
			if(x1 !== undefined && y1 !== undefined) {
				this.x1 = x1
				this.y1 = y1
				if(_t) this.kind = true
			}
		}
	}
}

export class Point {
	x = 0
	y = 0
	constructor(x?: number, y?: number) {
		if(x !== undefined && y !== undefined) {
			this.x = x
			this.y = y
		}
	}
}

export enum ShapePointKind {
	Line,
	Quadradic
}
export class ShapePoint extends Point {
	control: Point|undefined
	curve_type = ShapePointKind.Line
	tag: string = ''
	constructor(x?: number, y?: number) {
		super(x,y)
	}
	set_control(x: number, y: number) {
		if(!this.control) {
			this.control = new Point(x - this.x, y - this.y)
		} else {
			this.control.x = x - this.x
			this.control.y = y - this.y
		}
	}
}

export class Segment {
	sx: number
	sy: number
	cx: number
	cy: number
	ex: number
	ey: number
	hey_listen_watchout: number
	hcy: number
	box_min_x: number
	box_min_y: number
	box_max_x: number
	box_max_y: number
	flipped: boolean
	kind: boolean
	constructor(sx:number, sy:number, cx:number, cy:number, ex:number, ey:number,
		min_x:number, min_y:number, max_x:number, max_y:number,
		flipped: boolean, kind: boolean) {
		this.sx = sx
		this.sy = sy
		this.cx = cx
		this.cy = cy
		this.ex = ex
		this.ey = ey
		this.hey_listen_watchout = ey - sy
		this.hcy = cy - sy
		this.box_min_x = min_x
		this.box_min_y = min_y
		this.box_max_x = max_x
		this.box_max_y = max_y
		this.flipped = flipped
		this.kind = kind
	}
	intercept(in_y: number, result:MaybeIntercept):MaybeIntercept {
		let my = in_y + 0.5 - this.sy
		if((my >= 0) && (my <= this.hey_listen_watchout)) {
		} else { result.x = undefined; return result }
		let hcy2 = this.hcy + this.hcy
		if(this.kind) {
			let t = (
				this.hey_listen_watchout - hcy2 + my
			) / (
				(this.hey_listen_watchout + this.hey_listen_watchout) - hcy2
			)
			result.x = lerp(lerp(this.sx, this.cx, t), lerp(this.cx, this.ex, t), t)
		} else {
			let n = this.hcy*this.hcy + (this.hey_listen_watchout - hcy2)*my
			let d = this.hey_listen_watchout - hcy2
			let t = (Math.sqrt(n) - this.hcy) / d
			let mx = lerp(lerp(this.sx, this.cx, t), lerp(this.cx, this.ex, t), t) //+ 0.5
			result.x = mx
		}
		result.dir = this.flipped ? 1 : -1
		return result
	}
}

export class Outline {
	points: ShapePoint[] = []
	segments: Segment[] = []
}

interface MaybeIntercept {
	x: number|undefined
	dir: number
}
interface Intercept {
	x: number
	dir: number
}

export function lerp(a:number, b:number, t:number) {
	return (a * (1 - t)) + (t * b)
	// a - (a + b) * t
}
function lerplerp(a:number, b:number, c:number, t:number) {
	return (a * (1 - t)) + (t * b)
	// a + (-a -b) * t
	// b + (-b -c) * t
	// a + -a*t -b*t
	// b + -b*t -c*t
	// +a -a*t -b*t -a*t +a*t*t +b*t*t -b*t +b*t*t +c*t*t
	// a -a*t +b*t -a*t +a*t*t -b*t -c*t*t
}

let SCALE_X = 18
let SCALE_Y = 18
let INV_SCALE_X = 1 / SCALE_X
let INV_SCALE_Y = 1 / SCALE_Y
function set_scale(x:number, y:number) {
	SCALE_X = x
	SCALE_Y = y
	INV_SCALE_X = 1 / SCALE_X
	INV_SCALE_Y = 1 / SCALE_Y
}

export class TheRasterThing {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	debug_points: Point[] = []
	segments: Segment[] = []
	outlines: Outline[] = []
	debug_boxes: Box[] = []
	active_point = -1
	active_outline: Outline|undefined
	before_active_point: ShapePoint|undefined
	after_active_point: ShapePoint|undefined
	down_x = 0
	down_y = 0
	start_dx = 0
	start_dy = 0
	drag_start_cdx = 0
	drag_start_cdy = 0
	drag_control_angle_difference = 0
	drag_start_to_next_control_ratio = 0
	drag_next_cdx = 0
	drag_next_cdy = 0
	drag_next_to_control_angle = 0
	drag_next_to_control_dist = 0
	drag_next_to_start_dist = 0
	drag_prev_to_control_angle = 0
	drag_prev_to_control_dist = 0
	drag_prev_to_start_dist = 0
	drag_prev_to_start_ratio = 0
	drag_prev_control_angle_difference = 0
	test_x = 0
	test_y = 0
	dragging_the_point = false
	dragging_control_point = false
	raster_canvas: HTMLCanvasElement
	raster_ctx: CanvasRenderingContext2D
	raster_image: ImageData;
	raster_array: Uint32Array;
	div_a: HTMLDivElement
	div_b: HTMLDivElement
	div_c: HTMLDivElement
	div_ab: HTMLDivElement
	div_cc: HTMLDivElement
	points_html: HTMLInputElement
	offset_y: number = 0
	do_draw_intercept = true
	do_draw_bounds = true
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d') || (()=>{throw Error()})();
		this.ctx.imageSmoothingEnabled = false
		this.div_a = document.getElementById('a') as HTMLDivElement
		this.div_b = document.getElementById('b') as HTMLDivElement
		this.div_c = document.getElementById('c') as HTMLDivElement
		this.div_ab = document.getElementById('ab') as HTMLDivElement
		this.div_cc = document.getElementById('cc') as HTMLDivElement
		this.points_html = document.getElementById('points') as HTMLInputElement
		let path = this.points_html.value
		let reeeeee = /\s*([LlMmQq])\s*/gy;
		let ren = /([\-+]?(?:\d*\.)?\d+(?:[eE][\-+]\d+)?)/gy;
		let the_comma_space = /(?:\s+|(?:\s*,\s*))/gy;
		let renpair = /([\-+]?(?:\d*\.)?\d+(?:[eE][\-+]\d+)?)(?:\s+|(?:\s*,\s*))([\-+]?(?:\d*\.)?\d+(?:[eE][\-+]\d+)?)/gy;
		let main_outline = new Outline()
		let n = 0
		let path_kind = 'M'
		//debugger
		let found = true
		let cpx = 0
		let cpy = 0
		while(found && n < path.length) {
			found = false
			reeeeee.lastIndex = n
			let m = reeeeee.exec(path)
			if(m) {
				n += m[0].length
				found = true
				console.log('path command:', m[1])
				path_kind = m[1]
			} else {
				the_comma_space.lastIndex = n
				m = the_comma_space.exec(path)
				if(m) {
					n += m[0].length
				}
			}
			if(path_kind === 'Q') {
				renpair.lastIndex = n
				let control = renpair.exec(path)
				if(!control) { break }
				n += control[0].length
				the_comma_space.lastIndex = n
				let comma = the_comma_space.exec(path)
				if(!comma) { break }
				n += comma[0].length
				renpair.lastIndex = n
				m = renpair.exec(path)
				if(control && comma && m) {
					n += m[0].length
					found = true
					let x1 = parseFloat(control[1]), y1 = parseFloat(control[2])
					let x = parseFloat(m[1]), y = parseFloat(m[2])
					if(!isNaN(x) && !isNaN(y) && !isNaN(x1) && !isNaN(y1)) {
						console.log('quad points:', x1, y1, x, y, 'len=', m[0].length)
						let point = new ShapePoint(cpx, cpy)
						point.curve_type = ShapePointKind.Quadradic
						point.control = new Point(x1 - point.x, y1 - point.y)
						main_outline.points.push(point)
						cpx = x
						cpy = y
					}
				}
			} else {
				renpair.lastIndex = n
				m = renpair.exec(path)
				if(m) {
					n += m[0].length
					found = true
					let x = parseFloat(m[1]), y = parseFloat(m[2])
					if(!isNaN(x) && !isNaN(y)) {
						console.log('path point:', x, y, 'len=', m[0].length)
						if(path_kind === 'M') {
							path_kind = 'L'
						} else {
							let point = new ShapePoint(cpx, cpy)
							main_outline.points.push(point)
						}
						cpx = x; cpy = y
					}
				}
			}
		}
		this.outlines.push(main_outline)
		this.raster_canvas = document.createElement('canvas')
		this.raster_canvas.width = 1200
		this.raster_canvas.height = 800
		this.raster_ctx = this.raster_canvas.getContext('2d') || (()=>{throw Error()})();
		this.raster_image = this.raster_ctx.createImageData(this.raster_canvas.width, this.raster_canvas.height);
		this.raster_array = new Uint32Array(this.raster_image.data.buffer)
		for(let e = 0; e < 32; e++) {
			this.raster_array[e + e * 500] = 0xffffffff
		}
		this.raster_ctx.putImageData(this.raster_image, 0, 0)
		let scale_x = document.getElementById('scale_x') as HTMLInputElement;
		let scale_y = document.getElementById('scale_y') as HTMLInputElement;
		let rescale = () => {
			set_scale(Number(scale_x.value), Number(scale_y.value))
			this.rasterize()
		}
		set_scale(Number(scale_x.value), Number(scale_y.value))
		let offset_y = document.getElementById('offset_y') as HTMLInputElement
		let set_offset = () => {
			this.offset_y = Number(offset_y.value)
			if(isNaN(this.offset_y)) this.offset_y = 0
			this.rasterize()
		}
		set_offset()
		offset_y.addEventListener('input', set_offset)
		scale_x.addEventListener('input', rescale)
		scale_y.addEventListener('input', rescale)
		let draw_intercept = document.getElementById('draw_inter') as HTMLInputElement
		this.do_draw_intercept = draw_intercept.checked
		draw_intercept.addEventListener('input', ()=>{
			this.do_draw_intercept = draw_intercept.checked
			this.rasterize()
		})
		let draw_bounds = document.getElementById('draw_bounds') as HTMLInputElement
		this.do_draw_bounds = draw_bounds.checked
		draw_bounds.addEventListener('input', ()=>{
			this.do_draw_bounds = draw_bounds.checked
			this.rasterize()
		})
		let add_outline = document.getElementById('outline_add') as HTMLButtonElement
		let next_outline = document.getElementById('outline_next') as HTMLButtonElement
		add_outline.addEventListener('click', () => {
			this.add_outline()
		})
		next_outline.addEventListener('click', () => {
			this.next_outline()
		})
		canvas.addEventListener('pointermove', (ev) => {
			this.move(ev.offsetX, ev.offsetY, ev.buttons)
		})
		canvas.addEventListener('contextmenu', (ev) => {
			ev.preventDefault()
		})
		canvas.addEventListener('dblclick', (ev) => {
			if(ev.button == 0) {
				this.primary_double()
			}
			ev.preventDefault()
		})
		canvas.addEventListener('pointerdown', (ev) => {
			if(ev.button == 2) {
				this.secondary_down(ev.offsetX, ev.offsetY)
			} else if(ev.button == 1) {
				this.test_x = ev.offsetX
				this.test_y = ev.offsetY
				this.rasterize()
			} else if(ev.button == 0) {
				this.primary_down(ev.offsetX, ev.offsetY)
			}
			ev.preventDefault()
		})
		canvas.addEventListener('pointerup', (ev) => {
			if(ev.button == 2) {
				//this.secondary_up(ev.offsetX, ev.offsetY)
			} else if(ev.button == 0) {
				this.primary_up(ev.offsetX, ev.offsetY)
			}
			ev.preventDefault()
		})
		canvas.addEventListener('pointerleave', (ev) => {
			console.log('the pointer left me!?')
		})
	}

	save_points() {
		let out = ''
		for(let o = 0; o < this.outlines.length; o++) {
			let outline = this.outlines[o]
			if(o == 0) {
				for(let i = 0; i < outline.points.length; i++) {
					let point = outline.points[i]
					out += `${point.x},${point.y} `
				}
			}
		}
		//this.points_html.value = out
	}
	next_outline() {
		let i = -1
		if(this.active_outline) {
			i = this.outlines.indexOf(this.active_outline)
		}
		i++;
		if(i >= this.outlines.length) {
			i = this.outlines.length
		}
		this.active_outline = this.outlines.at(i)
		this.redraw_points()
	}
	add_outline() {
		this.active_outline = new Outline()
		this.outlines.push(this.active_outline)
		this.dragging_the_point = false
		this.dragging_control_point = false
		this.active_point = -1
		this.before_active_point = undefined
		this.after_active_point = undefined
		this.redraw_points()
	}
	fill_simple_curve(sx:number, sy:number, cx:number, cy:number, ex:number, ey:number, kind:boolean) {
		const pixels = this.raster_array
		const pitch = this.raster_canvas.width
		const debug_points = this.debug_points
		const c1 = 0xffffffff
		const c2 = 0xff000000
		const c3 = 0x88000000
		//
		let flipped = false
		if(sy > ey) {
			let t = sy
			sy = ey
			ey = t
			t = sx
			sx = ex
			ex = t
			flipped = true
		}
		let max_x = Math.ceil(Math.max(sx, ex))
		let max_y = Math.floor(ey + 0.5)
		let min_x = Math.floor(Math.min(sx, ex))
		let min_y = Math.floor(sy + 0.5)
		this.segments.push(new Segment(sx, sy, cx, cy, ex, ey, min_x, min_y, max_x, max_y, flipped, kind))
		// the curve is like C(t)
		// there should be a point "N", where N.y is on the curve (0 <= N.t <= 1)
		// if there is a horizontal inflection point, C(h)
		//   then we can assume that  0 <= N.t < h  or  h < N.t <= 1
		//   this might need special case
		// we will probably need: inv C(N.y) that gives t
		// and I want the x coordinate: C(t).x
		//
		// mx = lerp(lerp(start_x, control_x, t), lerp(control_x, end_x, t), t)
		// my = lerp(lerp(start_y, control_y, t), lerp(control_y, end_y, t), t) // solve this one for t
		// with s = start_y, c = control_y, e = end_y
		// a = (s * (1-t)) + (c*t)
		// b = (c * (1-t)) + (e*t)
		// my = (a * (1-t)) + (b*t)
		// my = s*(1-t)*(1-t) + c*2*t*(1-t) + e*t*t
		//
		// a = s -s*t +c*t
		// b = c -c*t +e*t
		// my = (a) -(a)*t + (b)*t
		// my = s -s*t*2 +c*t*2 -c*t*t*2 +e*t*t +s*t*t
		// my = s + (-s*2 +c*2)*t + (-c*2 +e +s)*t*t
		//
		// -- another way
		// a1 = s - (s + c) * t
		// b1 = c - (c + e) * t
		// my = a - (a + b) * t
		// my = sy - (sy + cy)*t -(sy -(sy + cy)*t +cy -(cy + ey)*t)*t
		// assume cy and ey are offset by sy and sy is 0
		// my = -cy*2*t +cy*2*t*t +ey*t*t
		// assume that x works the same way
		// mx = -cx*2*t +cx*2*t*t +ex*t*t
		//
		// (my +cy*2) / (+cy*2 +ey)  = t
		// mx = ( -cx*2 +(cx*2 +ex)*t ) *t
		//  meh = cy*2 +ey
		// mx = ( -cx*2*(my +cy*2) +(((cx*2 +ex)*(my +cy*2)*(my +cy*2)) / meh) ) / meh
		//
		// my = 2*c*(t - t*t) + e*t*t
		// my/(2*c) = (1 - ((2*c + e)/(2*c))*t) *t
		//
		//
		{
			let my = this.test_y * INV_SCALE_Y
			if(my > sy && my < ey) {
				let t = 0
				if(cy+cy === sy + ey) {
					t = (
						ey - (cy + cy) + my
					) / (
						(ey + ey) - (cy + cy)
					)
				} else {
					t = (
						Math.sqrt(
							-sy*ey + sy*my + ey*my + cy*cy - 2*cy*my
						)
						+ sy - cy
					) / (
						sy + ey - 2*cy
					)
				}
				let mx = lerp(lerp(sx, cx, t), lerp(cx, ex, t), t)
				debug_points.push(new Point(mx * SCALE_X, my * SCALE_Y))
				//
			}
		}
		if((cy+cy === sy + ey) || kind) {
			for(let i = min_y; i < max_y; i++) {
				let my = i
				let row = Math.floor(my) * pitch
				my = (my + 0.5)
				if((my >= sy) && (my <= ey)) {
					let t = (
						ey - (cy + cy) + my
					) / (
						(ey + ey) - (cy + cy)
					)
					let mx = lerp(lerp(sx, cx, t), lerp(cx, ex, t), t)
					let xt = Math.floor(mx)
					if(flipped) {
						for(let x = min_x; x < max_x; x++) {
							if(x === xt) {
								// dark -> x > mx
								let dx = Math.floor(Math.min((mx - x) * 255, 255))
								// dark -> x < mx
								//let dx = 255 - Math.floor(Math.min((mx - x) * 255, 255))
								//pixels[row + x] = c2 | (0x10101 * dx)
							} else if((x + 0.5) >= mx) {
								//pixels[row + x] = c3
							} else {
								//pixels[row + x] = c1
							}
						}
					} else {
						for(let x = min_x; x < max_x; x++) {
							if(x === xt) {
								// dark -> x > mx
								//let dx = Math.floor(Math.min((mx - x) * 255, 255))
								// dark -> x < mx
								let dx = 255 - Math.floor(Math.min((mx - x) * 255, 255))
								//pixels[row + x] = c2 | (0x10101 * dx)
							} else if((x + 0.5) >= mx) {
								//pixels[row + x] = c1
							} else {
								//pixels[row + x] = c3
							}
						}
					}
				}
			}
		} else {
			//let half_y = 0.5 * INV_SCALE_Y
			//let half_x = 0.5 * INV_SCALE_X
			for(let i = min_y; i < max_y; i++) {
				let my = i
				let row = Math.floor(my) * pitch
				my = (my + 0.5)
				if((my >= sy) && (my <= ey)) {
					let t = (
						Math.sqrt(
							cy*cy - sy*ey + (sy + ey - 2*cy)*my
						)
						+ sy - cy
					) / (
						sy + ey - 2*cy
					)
					let mx = lerp(lerp(sx, cx, t), lerp(cx, ex, t), t) //+ 0.5
					let xt = Math.floor(mx)
					if(this.do_draw_intercept) {
						debug_points.push(new Point(mx * SCALE_X, my * SCALE_Y))
						debug_points.push(new Point(xt * SCALE_X, my * SCALE_Y))
					}
					if(flipped) {
						for(let x = min_x; x < max_x; x++) {
							if(x === xt) {
								// dark -> x > mx
								let dx = Math.floor(Math.min((mx - x) * 255, 255))
								// dark -> x < mx
								//let dx = 255 - Math.floor(Math.min((mx - x) * 255, 255))
								//pixels[row + x] = c2 | (0x10101 * dx)
							} else if((x + 0.5) >= mx) {
								//pixels[row + x] = c3
							} else {
								//pixels[row + x] = c1
							}
						}
					} else {
						for(let x = min_x; x < max_x; x++) {
							if(x === xt) {
								// dark -> x > mx
								//let dx = Math.floor(Math.min((mx - x) * 255, 255))
								// dark -> x < mx
								let dx = 255 - Math.floor(Math.min((mx - x) * 255, 255))
								//pixels[row + x] = c2 | (0x10101 * dx)
							} else if((x + 0.5) >= mx) {
								//pixels[row + x] = c1
							} else {
								//pixels[row + x] = c3
							}
						}
					}
				} else {
					for(let x = min_x; x < max_x; x++) {
						//pixels[row + x] = c3
					}
				}
			}
		}
	}
	plot_curve(
		start_x: number, start_y: number,
		control_x: number, control_y: number,
		end_x: number, end_y: number)
	{
		let int_start_x = Math.floor(start_x)
		let int_start_y = Math.floor(start_y)
		let int_control_x = Math.floor(control_x)
		let int_control_y = Math.floor(control_y)
		let int_end_x = Math.floor(end_x)
		let int_end_y = Math.floor(end_y)
		let diff0_x = int_control_x - int_start_x, diff0_y = int_control_y - int_start_y
		let diff1_x = int_end_x - int_control_x, diff1_y = int_end_y - int_control_y
		//debug_boxes.push(new Box(start_x * SCALE_X, start_y * SCALE_Y, end_x * SCALE_X, end_y * SCALE_Y))
		//debug_boxes.push(new Box(start_x * SCALE_X, start_y * SCALE_Y, control_x * SCALE_X, control_y * SCALE_Y))
		//debug_boxes.push(new Box(control_x * SCALE_X, control_y * SCALE_Y, end_x * SCALE_X, end_y * SCALE_Y))
		let most_lengthy = Math.max(Math.max(Math.abs(diff0_x), Math.abs(diff0_y)), Math.max(Math.abs(diff1_x), Math.abs(diff1_y)));

		let mid_p0x = 0
		let mid_p0y = 0
		let mid_sc0x = 0
		let mid_sc0y = 0
		let mid_ce0x = 0
		let mid_ce0y = 0
		let mid_t0 = -1
		let mid_p1x = 0
		let mid_p1y = 0
		let mid_sc1x = 0
		let mid_sc1y = 0
		let mid_ce1x = 0
		let mid_ce1y = 0
		let mid_t1 = -1
		let se_max_x = Math.max(start_x, end_x)
		let se_max_y = Math.max(start_y, end_y)
		let se_min_x = Math.min(start_x, end_x)
		let se_min_y = Math.min(start_y, end_y)
		let curve_kind_eek = false
		if(Math.abs((se_min_y + se_max_y) - (control_y+control_y)) < 0.00001) {
			curve_kind_eek = true
		}
		if(control_x < se_min_x || control_x > se_max_x) {
			// a vertical inflection point exists
			// we want the value t kinda, to get the y coordinate on the curve
			// p0x will equal p1x at some t
			// this should be on one side of the t == 0.5 point
			//lerp(start_x, control_x, t) = lerp(control_x, end_x, t)
			// (start * (1 - t)) + (t * ctrl) = (ctrl * (1 - t)) + (t * end)
			// t * (-start +ctrl*2 -end) = +ctrl -start
			//
			// t =  +ctrl -start
			//    / +ctrl*2 -start -end
			let t = (control_x - start_x) / (control_x + control_x - start_x - end_x)
			let p0x = lerp(start_x, control_x, t)
			let p1x = lerp(control_x, end_x, t)
			let p0y = lerp(start_y, control_y, t)
			let p1y = lerp(control_y, end_y, t)
			let mx = lerp(p0x, p1x, t)
			let my = lerp(p0y, p1y, t)
			if(this.do_draw_bounds) {
				this.debug_points.push(new Point(p0x * SCALE_X, p0y * SCALE_Y))
				this.debug_points.push(new Point(p1x * SCALE_X, p1y * SCALE_Y))
				this.debug_points.push(new Point(mx * SCALE_X, my * SCALE_Y))
			}
			mid_sc0x = p0x
			mid_sc0y = p0y
			mid_ce0x = p1x
			mid_ce0y = p1y
			mid_p0x = mx
			mid_p0y = my
			mid_t0 = t
		}
		if(control_y < se_min_y || control_y > se_max_y) {
			// a horizontal inflection point exists
			let t = (control_y - start_y) / (control_y + control_y - start_y - end_y)
			let p0x = lerp(start_x, control_x, t)
			let p1x = lerp(control_x, end_x, t)
			let p0y = lerp(start_y, control_y, t)
			let p1y = lerp(control_y, end_y, t)
			let mx = lerp(p0x, p1x, t)
			let my = lerp(p0y, p1y, t)
			if(this.do_draw_bounds) {
				this.debug_points.push(new Point(p0x * SCALE_X, p0y * SCALE_Y))
				this.debug_points.push(new Point(p1x * SCALE_X, p1y * SCALE_Y))
				this.debug_points.push(new Point(mx * SCALE_X, my * SCALE_Y))
			}
			mid_sc1x = p0x
			mid_sc1y = p0y
			mid_ce1x = p1x
			mid_ce1y = p1y
			mid_p1x = mx
			mid_p1y = my
			mid_t1 = t
		}
		//this.div_a.innerText = `${sy}`
		//this.div_b.innerText = `${ey}`
		//this.div_c.innerText = `${cy}`
		//this.div_ab.innerText = `${sy + ey}`
		//this.div_cc.innerText = `${cy+cy}`
		if(mid_t0 > -1 && mid_t1 > -1) {
			if(mid_t0 < mid_t1) {
				this.fill_simple_curve(start_x, start_y, mid_sc0x, mid_sc0y, mid_p0x, mid_p0y, curve_kind_eek)
				this.fill_simple_curve(mid_p1x, mid_p1y, mid_ce1x, mid_ce1y, end_x, end_y, curve_kind_eek)
				this.fill_simple_curve(mid_p0x, mid_p0y, mid_p0x, mid_p1y, mid_p1x, mid_p1y, curve_kind_eek)
			} else {
				this.fill_simple_curve(start_x, start_y, mid_sc1x, mid_sc1y, mid_p1x, mid_p1y, curve_kind_eek)
				this.fill_simple_curve(mid_p0x, mid_p0y, mid_ce0x, mid_ce0y, end_x, end_y, curve_kind_eek)
				this.fill_simple_curve(mid_p1x, mid_p1y, mid_p0x, mid_p1y, mid_p0x, mid_p0y, curve_kind_eek)
			}
			//fill_simple_curve(mid_p0x, mid_p0y, mid_p1x, mid_p0y, mid_p1x, mid_p1y)
		} else if(mid_t1 > -1) {
			//fill_simple_curve(start_x, start_y, control_x, control_y, end_x, end_y)
			this.fill_simple_curve(start_x, start_y, mid_sc1x, mid_sc1y, mid_p1x, mid_p1y, curve_kind_eek)
			this.fill_simple_curve(mid_p1x, mid_p1y, mid_ce1x, mid_ce1y, end_x, end_y, curve_kind_eek)
		} else if(mid_t0 > -1) {
			this.fill_simple_curve(start_x, start_y, mid_sc0x, mid_sc0y, mid_p0x, mid_p0y, curve_kind_eek)
			this.fill_simple_curve(mid_p0x, mid_p0y, mid_ce0x, mid_ce0y, end_x, end_y, curve_kind_eek)
		} else {
			// fullest box
			this.fill_simple_curve(start_x, start_y, control_x, control_y, end_x, end_y, curve_kind_eek)
		}
	}
	rasterize() {
		// do something
		let pixels = this.raster_array
		let width = this.raster_canvas.width
		let height = this.raster_canvas.height
		let pitch = width
		const c0 = 0
		const c1 = 0xffffffff
		const c2 = 0xff000000
		const c3 = 0x88000000
		//const ceek = 0x88ff0000
		const ceek = 0x88ffa040
		const debug_points = this.debug_points;
		debug_points.length = 0
		this.debug_boxes.length = 0
		this.segments.length = 0
		function plot_line_x_pixels(start_x:number, start_y:number, end_x:number, end_y:number) {
			if(start_y > end_y) {
				let meh = end_x
				end_x = start_x
				start_x = meh
				meh = end_y
				end_y = start_y
				start_y = meh
			}
			let diff_x = end_x - start_x
			let diff_y = end_y - start_y
			if(diff_y == 0) diff_y = 1
			let floof = diff_x / diff_y
			let offset_y = 0
			let int_start_x = Math.floor(start_x)
			let leftovers_of_x = start_x - int_start_x
			let int_start_y = Math.floor(start_y)
			let leftovers_of_y = start_y - int_start_y
			let int_length_y = Math.floor(end_y) - int_start_y
			while(offset_y <= int_length_y) {
				let y = offset_y - leftovers_of_y + 0.5
				let erm = floof * y + leftovers_of_x - 0.5
				debug_points.push(new Point((int_start_x + erm) * SCALE_X, (int_start_y + offset_y) * SCALE_Y))
				let row = int_start_x + (int_start_y + offset_y) * pitch
				if(diff_x < 0) {
					//pixels[Math.round(start_y) * pitch + Math.round(erm)] = c1
				} else {
					let oof = false
					for(let x = 0; x < (diff_x+1); x++) {
						if(x < erm) {
							pixels[row + x] = c1
							oof = true
						}
					}
				}
				offset_y++;
			}
		}
		function plot_line(start_x: number, start_y: number, end_x: number, end_y: number) {
			start_x = Math.floor(start_x)
			start_y = Math.floor(start_y)
			end_x = Math.floor(end_x)
			end_y = Math.floor(end_y)
			let diff_x = end_x - start_x, diff_y = end_y - start_y
			if(Math.abs(diff_x) > Math.abs(diff_y)) {
				if(start_x > end_x) {
					let meh = end_x
					end_x = start_x
					start_x = meh
					meh = end_y
					end_y = start_y
					start_y = meh
				}
				diff_x = end_x - start_x
				diff_y = end_y - start_y
				let floof = (-diff_x / 2) | 0
				let dir = 1
				if(diff_y < 0) {
					diff_y = -diff_y
					dir = -1
				}
				while(start_x <= end_x) {
					pixels[start_y * pitch + start_x] = c1
					start_x++;
					floof += diff_y
					if(floof >= 0) {
						floof -= diff_x
						start_y += dir;
					}
				}
			} else {
				if(start_y > end_y) {
					let meh = end_x
					end_x = start_x
					start_x = meh
					meh = end_y
					end_y = start_y
					start_y = meh
				}
				diff_x = end_x - start_x
				diff_y = end_y - start_y
				let floof = (-diff_y / 2) | 0
				let dir = 1
				if(diff_x < 0) {
					diff_x = -diff_x
					dir = -1
				}
				while(start_y <= end_y) {
					pixels[start_y * pitch + start_x] = c1
					start_y++;
					floof += diff_x
					if(floof >= 0) {
						floof -= diff_y
						start_x += dir;
					}
				}
			}
		}

		for(let y = 0; y < height; y++) {
			let row = y * pitch
			let flag = false
			for(let x = 0; x < width; x++) {
				pixels[row + x] = c0
			}
		}
		for(let outline_index = 0; outline_index < this.outlines.length; outline_index++) {
			let outline = this.outlines[outline_index]
			let last: ShapePoint|undefined
			let first: ShapePoint|undefined
			for(let p = 0; p < outline.points.length; p++) {
				let point = outline.points[p]
				let end_x = point.x * INV_SCALE_X, end_y = (point.y * INV_SCALE_Y)
				//pixels[row + end_x] = c1
				if(last) {
					let start_x = (last.x * INV_SCALE_X), start_y = (last.y * INV_SCALE_Y)
					let mid_x: number, mid_y: number
					if(last.curve_type === ShapePointKind.Quadradic && last.control) {
						mid_x = (last.x + last.control.x) * INV_SCALE_X
						mid_y = (last.y + last.control.y) * INV_SCALE_Y
					} else {
						mid_x = (start_x + end_x) * 0.5
						mid_y = (start_y + end_y) * 0.5
					}
					//plot_line_x_pixels(start_x, start_y, end_x, end_y)
					//plot_line(start_x, start_y, end_x, end_y)
					this.plot_curve(start_x, start_y, mid_x, mid_y, end_x, end_y)
				}
				last = point
				if(!first) { first = point }
			}
			if(first && last) {
				let start_x = (last!.x * INV_SCALE_X), start_y = (last!.y * INV_SCALE_Y)
				let end_x = (first.x * INV_SCALE_X), end_y = (first.y * INV_SCALE_Y)
				let mid_x: number, mid_y: number
				if(last.curve_type === ShapePointKind.Quadradic && last.control) {
					mid_x = (last.x + last.control.x) * INV_SCALE_X
					mid_y = (last.y + last.control.y) * INV_SCALE_Y
				} else {
					mid_x = (start_x + end_x) * 0.5
					mid_y = (start_y + end_y) * 0.5
				}
				this.plot_curve(start_x, start_y, mid_x, mid_y, end_x, end_y)
			}
		}
		let most_miny = this.raster_canvas.height
		let most_maxy = 0
		for(let i = 0; i < this.segments.length; i++) {
			most_miny = Math.min(most_miny, this.segments[i].box_min_y)
			most_maxy = Math.max(most_maxy, this.segments[i].box_max_y)
		}
		let row_x_coords:Intercept[] = []
		let inter:MaybeIntercept = { x: undefined, dir: 0 }
		for(let e = most_miny; e < most_maxy; e++) {
			let row = e * pitch
			row_x_coords.length = 0
			for(let i = 0; i < this.segments.length; i++) {
				let curve = this.segments[i]
				let miny = curve.box_min_y
				let maxy = curve.box_max_y
				if((e >= miny) && (e < maxy)) {
					curve.intercept(e, inter)
					if(inter.x !== undefined) {
						if(isNaN(inter.x)) {
							//debugger
							curve.intercept(e, inter)
							inter.x = curve.box_max_x
						}
						if(inter.x > curve.box_max_x) {
							console.log(`overrun x scanline at row ${e}, curve segment ${i}`)
						}
						row_x_coords.push(inter as Intercept)
						inter = { x: undefined, dir: 0 }
					} else {
						console.log(`segment row without an intercept row=${e}, curve segment ${i}`)
						//row_x_coords.push(curve.box_max_x)
					}
				}
			}
			row_x_coords.sort((a, b) => a.x - b.x)
			let x_index = 0
			let n = 0
			let x = 0
			let current_inter = row_x_coords[x_index]
			for(; x < width; x++) {
				while(current_inter && (x + 0.5) >= current_inter.x) {
					//if(n < 1) { n = 1 } else { n = 0 }
					n += current_inter.dir
					current_inter = row_x_coords[++x_index]
				}
				if(!current_inter) break
				if(n > 0) {
					//pixels[row + x] = ceek
					pixels[row + x] = c0
				} else if(n === 0) {
					pixels[row + x] = c0
				} else {
					//pixels[row + x] = c0
					pixels[row + x] = ceek
				}
			}
			for(; x < width; x++) {
				pixels[row + x] = n ? c3 : c0
			}
		}
		this.raster_ctx.putImageData(this.raster_image, 0, 0)
		this.redraw_points()
	}
	redraw_points() {
		let ctx = this.ctx;
		ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
		ctx.drawImage(this.raster_canvas, 0, 0,
			this.raster_canvas.width * SCALE_X,
			this.raster_canvas.height * SCALE_Y)
		ctx.fillStyle = '#ff0000'
		ctx.strokeStyle = '#ff5e25'
		for(let i = 0; i < this.debug_points.length; i++) {
			let point = this.debug_points[i]
			//ctx.strokeRect(point.x, point.y - 2, SCALE_X / 2, SCALE_Y + 4)
			ctx.strokeRect(point.x - 2, point.y - 2, 4, 4)
		}
		for(let i = 0; i < this.debug_boxes.length; i++) {
			let box = this.debug_boxes[i]
			let minx = Math.min(box.x0, box.x1)
			let miny = Math.min(box.y0, box.y1)
			let maxx = Math.max(box.x0, box.x1)
			let maxy = Math.max(box.y0, box.y1)
			ctx.strokeStyle = box.kind ? '#2c82ee' : '#4fee75'
			ctx.strokeRect(minx, miny, maxx - minx, maxy - miny)
		}
		let inter: MaybeIntercept = { x: undefined, dir: 1 }
		for(let i = 0; i < this.segments.length; i++) {
			let curve = this.segments[i]
			let minx = curve.box_min_x
			let miny = curve.box_min_y
			let maxx = curve.box_max_x
			let maxy = curve.box_max_y
			if(this.do_draw_bounds) {
				ctx.strokeStyle = curve.kind ? '#ec82ee' : '#ff6e15'
				ctx.strokeRect(minx * SCALE_X, miny * SCALE_Y, (maxx - minx) * SCALE_X, (maxy - miny) * SCALE_Y)
				ctx.strokeStyle = '#af3e25'
				ctx.strokeRect(curve.sx * SCALE_X - 4, curve.sy * SCALE_Y - 4, 8, 8)
				ctx.strokeRect(curve.cx * SCALE_X - 4, curve.cy * SCALE_Y - 4, 8, 8)
				ctx.strokeRect(curve.ex * SCALE_X - 4, curve.ey * SCALE_Y - 4, 8, 8)
			}
			let diff_y = maxy - miny
			ctx.strokeStyle = '#11eeee'
			for(let e = 0; e < diff_y; e++) {
				curve.intercept(miny + e, inter)
				if((inter.x !== undefined) && this.do_draw_intercept) {
					ctx.strokeRect(inter.x * SCALE_X - 4, (miny + e) * SCALE_Y - 2, 8, 4)
				}
			}
		}
		ctx.strokeStyle = '#ff88ff'
		ctx.strokeRect(this.test_x - 4, this.test_y - 4, 8, 8)
		ctx.beginPath()
		ctx.fillStyle = '#ffffff'
		for(let outline_index = 0; outline_index < this.outlines.length; outline_index++) {
			let outline = this.outlines[outline_index]
			let last: Point|undefined
			let first: Point|undefined
			let activated = outline === this.active_outline
			for(let i = 0; i < outline.points.length; i++) {
				let point = outline.points[i]
				if(i == this.active_point) {
					ctx.strokeStyle = '#11ffff'
				} else if(point === this.after_active_point) {
					ctx.strokeStyle = '#ffaa25'
				} else if(i == 0) {
					ctx.strokeStyle = '#ff5555'
				} else {
					ctx.strokeStyle = '#ff0000'
				}
				if(activated) {
					ctx.strokeRect(point.x - 10, point.y - 10, 20, 20)
					ctx.fillText(`${i}-${point.tag}`, point.x, point.y)
				}
				if(last) {
					ctx.lineTo(point.x, point.y)
				} else {
					ctx.moveTo(point.x, point.y)
				}
				if(!first) { first = point }
				if(point.control && point.curve_type === ShapePointKind.Quadradic) {
					if(point === this.before_active_point) {
						ctx.strokeStyle = '#ffaa25'
					}
					if(activated) {
						ctx.strokeRect(point.x + point.control.x - 7, point.y + point.control.y - 7, 14, 14)
					}
					ctx.lineTo(point.x + point.control.x, point.y + point.control.y)
				}
				last = point
			}
			if(first && outline.points.length > 2) {
				ctx.lineTo(first.x, first.y)
			}
		}
		ctx.strokeStyle = '#eaaaaa33'
		ctx.stroke()
	}
	primary_up(x: number, y: number) {
		if(this.dragging_the_point) {
			this.dragging_the_point = false;
			this.dragging_control_point = false;
			this.rasterize()
		}
	}
	primary_double() {
		let outline = this.active_outline
		if(!outline || outline.points.length < 1) {
			return
		}
		if(this.active_point > -1) {
			let point = outline.points[this.active_point]!
			if(this.after_active_point) {
				if(point.curve_type === ShapePointKind.Line) {
					point.curve_type = ShapePointKind.Quadradic
					let mid_x = Math.floor((point.x + this.after_active_point.x) * 0.5) - point.x
					let mid_y = Math.floor((point.y + this.after_active_point.y) * 0.5) - point.y
					if(!point.control) {
						point.control = new Point(mid_x, mid_y)
					} else {
						point.control.x = mid_x
						point.control.y = mid_y
					}
				} else {
					point.curve_type = ShapePointKind.Line
				}
				this.rasterize()
			}
		}
	}
	primary_down(x: number, y: number) {
		let near: ShapePoint|undefined
		let next_point: ShapePoint|undefined
		let prev_point: ShapePoint|undefined
		let dist = 0
		let outline = this.active_outline
		if(!outline || outline.points.length < 1) {
			return
		}
		let last_point = outline.points.at(-1)!
		for(let i = 0; i < outline.points.length; i++) {
			let point = outline.points[i]
			let d = sq(point.x - x) + sq(point.y - y)
			if(near) {
				if(!next_point) {
					next_point = point
				}
				if(d < dist) {
					near = point
					prev_point = last_point
					dist = d
					next_point = undefined
					this.active_point = i
					this.dragging_control_point = false
				}
			} else {
				near = point
				prev_point = last_point
				dist = d
				next_point = undefined
				this.active_point = i
				this.dragging_the_point = true
			}
			if(point.curve_type === ShapePointKind.Quadradic && point.control) {
				d = sq(point.x + point.control.x - x) + sq(point.y + point.control.y - y)
				if(d < dist) {
					near = point
					prev_point = last_point
					dist = d
					next_point = undefined
					this.active_point = i
					this.dragging_control_point = true
				}
			}
			last_point = point
		}
		if(near && !next_point && outline.points.length > 0) {
			next_point = outline.points[0]
		}
		this.before_active_point = prev_point
		this.after_active_point = next_point
		this.down_x = x
		this.down_y = y
		if(near && prev_point) {
			if(this.dragging_control_point) {
				this.start_dx = near.x + near.control!.x - x
				this.start_dy = near.y + near.control!.y - y
			} else {
				this.start_dx = near.x - x
				this.start_dy = near.y - y
				if(prev_point && prev_point.curve_type === ShapePointKind.Quadradic && prev_point.control) {
					let control_abs_x = prev_point.x + prev_point.control!.x
					let control_abs_y = prev_point.y + prev_point.control!.y
					this.drag_prev_to_control_angle = Math.atan2(prev_point.control.y, prev_point.control.x)
					this.drag_prev_to_control_dist = Math.sqrt(sq(prev_point.control.x) + sq(prev_point.control.y))
					this.drag_prev_to_start_dist = Math.sqrt(sq(near.x - prev_point.x) + sq(near.y - prev_point.y))
					let drag_start_angle = Math.atan2(near.y - prev_point.y, near.x - prev_point.x)
					if(this.drag_prev_to_start_dist < 1) {
						this.drag_prev_to_start_dist = 1
					}
					this.drag_prev_control_angle_difference = this.drag_prev_to_control_angle - drag_start_angle
				}
				if(near.curve_type === ShapePointKind.Quadradic && near.control && next_point) {
					let control_abs_x = near.x + near.control!.x
					let control_abs_y = near.y + near.control!.y
					this.drag_next_to_control_angle = Math.atan2(control_abs_y - next_point.y, control_abs_x - next_point.x)
					this.drag_next_to_control_dist = Math.sqrt(sq(control_abs_x - next_point.x) + sq(control_abs_y - next_point.y))
					this.drag_next_to_start_dist = Math.sqrt(sq(near.x - next_point.x) + sq(near.y - next_point.y))
					if(this.drag_next_to_start_dist < 1) {
						this.drag_next_to_start_dist = 1
					}
					let drag_start_angle = Math.atan2(near.y - next_point.y, near.x - next_point.x)
					this.drag_control_angle_difference = this.drag_next_to_control_angle - drag_start_angle
					this.drag_start_cdx = near.control!.x
					this.drag_start_cdy = near.control!.y
					this.drag_next_cdx = control_abs_x
					this.drag_next_cdy = control_abs_y
				}
			}
		}
		this.redraw_points()
	}
	add_point(x: number, y: number, tag?: string): ShapePoint {
		let outline = this.active_outline
		let p = new ShapePoint(x,y)
		if(outline) {
			if(tag != undefined) {
				p.tag = tag
			}
			outline.points.push(p)
		}
		return p
	}
	secondary_down(x: number, y: number) {
		this.add_point(x, y)
		if(this.active_outline) {
			this.save_points()
			this.rasterize();
		}
	}
	move(x: number, y: number, buttons: number) {
		let outline = this.active_outline
		if(!outline) {
			return
		}
		if((buttons & 1) != 0 && this.dragging_the_point && this.active_point != -1) {
			let dx = x + this.start_dx, dy = y + this.start_dy
			let point = outline.points[this.active_point]
			if(this.dragging_control_point && point.control) {
				point.control.x = dx - point.x
				point.control.y = dy - point.y
			} else {
				point.x = dx
				point.y = dy
				// angular difference to prev
				let prev_point = this.before_active_point
				if(prev_point && prev_point.control && prev_point.curve_type === ShapePointKind.Quadradic) {
					let new_point_angle = Math.atan2(point.y - prev_point.y, point.x - prev_point.x) + this.drag_prev_control_angle_difference
					let current_point_to_prev = Math.sqrt(sq(point.x - prev_point.x) + sq(point.y - prev_point.y)) / this.drag_prev_to_start_dist
					let new_cpx = current_point_to_prev * this.drag_prev_to_control_dist * Math.cos(new_point_angle)
					let new_cpy = current_point_to_prev * this.drag_prev_to_control_dist * Math.sin(new_point_angle)
					prev_point.control.x = Math.round(new_cpx)
					prev_point.control.y = Math.round(new_cpy)
					this.div_b.innerText = `${current_point_to_prev}`
				}
				if(point.control && point.curve_type === ShapePointKind.Quadradic) {
					// mid point average:
					//let new_cpx = Math.floor(0.5 * ((point.x + this.drag_start_cdx) + this.drag_next_cdx)) - point.x
					//let new_cpy = Math.floor(0.5 * ((point.y + this.drag_start_cdy) + this.drag_next_cdy)) - point.y
					// sticky control point
					//let new_cpx = this.drag_next_cdx - point.x
					//let new_cpy = this.drag_next_cdy - point.y
					//point.control.x = new_cpx
					//point.control.y = new_cpy
					// angular difference
					let next_point = this.after_active_point!
					let new_point_angle = Math.atan2(point.y - next_point.y, point.x - next_point.x) + this.drag_control_angle_difference
					let current_point_to_next = Math.sqrt(sq(point.x - next_point.x) + sq(point.y - next_point.y)) / this.drag_next_to_start_dist
					let new_cpx = current_point_to_next * this.drag_next_to_control_dist * Math.cos(new_point_angle) + next_point.x - point.x
					let new_cpy = current_point_to_next * this.drag_next_to_control_dist * Math.sin(new_point_angle) + next_point.y - point.y
					point.control.x = Math.round(new_cpx)
					point.control.y = Math.round(new_cpy)
					this.div_a.innerText = `${current_point_to_next}`

					//this.drag_next_to_start_dist = Math.sqrt(sq(near.x - next_point.x) + sq(near.y - next_point.y))
					//this.div_b.innerText = `${'aaaa'}`
					//this.div_c.innerText = `${'aaaa'}`
					//this.div_ab.innerText = `${'aaaa'}`
					//this.div_cc.innerText = `${'aaaa'}`
				}
			}
			this.rasterize()
			this.save_points()
		} else {
			this.redraw_points()
		}
		let ctx = this.ctx;
		ctx.fillStyle = (buttons & 1) != 0 ? '#ffffff' : '#44ff4411';
		ctx.fillRect(x, y, 10, 20)
	}
}

export function raster_main():TheRasterThing {
	console.log("yell unto the void");
	let oof = document.getElementById('oof') as HTMLDivElement;
	let canvas = document.createElement('canvas');
	canvas.width = 1200
	canvas.height = 900
	oof.appendChild(canvas);
	let r = new TheRasterThing(canvas)
	r.rasterize()
	return r
}

