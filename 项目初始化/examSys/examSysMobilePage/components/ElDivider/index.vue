<template>
	<div :class="['el-divider', `el-divider--${direction}`]">
		<div :class="['el-divider__text', `is-${contentPosition}`]">
			<slot />
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ElDivider',
		props: {
			direction: {
				type: String,
				default: 'horizontal',
				validator(val) {
					return ['horizontal', 'vertical'].indexOf(val) !== -1;
				}
			},
			contentPosition: {
				type: String,
				default: 'center',
				validator(val) {
					return ['left', 'center', 'right'].indexOf(val) !== -1;
				}
			}
		}
	}
</script>

<style scoped>
	.el-divider {
		background-color: #DCDFE6;
		position: relative
	}

	.el-divider--horizontal {
		display: block;
		height: 1px;
		width: 100%;
		margin: 24px 0
	}

	.el-divider--vertical {
		display: inline-block;
		width: 1px;
		height: 1em;
		margin: 0 8px;
		vertical-align: middle;
		position: relative
	}

	.el-divider__text {
		position: absolute;
		background-color: #FFF;
		padding: 0 14px;
		font-weight: 500;
		color: #303133;
		font-size: 14px
	}

	.el-divider__text.is-left {
		left: 20px;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%)
	}

	.el-divider__text.is-center {
		left: 50%;
		-webkit-transform: translateX(-50%) translateY(-50%);
		transform: translateX(-50%) translateY(-50%)
	}

	.el-divider__text.is-right {
		right: 20px;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%)
	}
</style>