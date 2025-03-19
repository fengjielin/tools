import { toast } from '@/utils/common'

// 处理多次点击
export function multipleClicks(methods, params) {
	// methods是需要点击后需要执行的函数， params是点击需要传的参数
	let that = this;
	if (that.noClick) {
		that.noClick = false;
		if (params && params !== '') {
			methods(params);
		} else {
			methods();
		}
		setTimeout(() => {
			that.noClick = true;
		}, 4000)
	} else {
		toast('数据正在处理，请勿重复提交')
	}
}
