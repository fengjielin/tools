<template>
	<view class="el-badge">
		<slot></slot>
		<transition name="el-zoom-in-center">
			<sup v-show="!hidden && (content || content === 0 || isDot)" v-text="content" class="el-badge__content"
				:class="[
          type ? 'el-badge__content--' + type : null,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]">
			</sup>
		</transition>
	</view>
</template>

<script>
	export default {
		name: 'ElBadge',

		props: {
			value: [String, Number],
			max: {
				type: [Number],
				default: 99
			},
			isDot: Boolean,
			hidden: Boolean,
			type: {
				type: String,
				default: 'danger',
				validator(val) {
					return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
				}
			}
		},

		computed: {
			content() {
				if (this.isDot) return;

				const value = this.value;
				const max = this.max;

				if (typeof value === 'number' && typeof max === 'number') {
					return max < value ? `${max}+` : value;
				}

				return value;
			}
		}
	};
</script>

<style scoped>
	.el-badge {
		position: relative;
		vertical-align: middle;
		display: inline-block
	}

	.el-badge__content {
		background-color: #F56C6C;
		border-radius: 10px;
		color: #FFF;
		display: inline-block;
		font-size: 12px;
		height: 18px;
		line-height: 18px;
		padding: 0 6px;
		text-align: center;
		white-space: nowrap;
		border: 1px solid #FFF
	}

	.el-badge__content.is-fixed {
		position: absolute;
		top: 0;
		right: 10px;
		-webkit-transform: translateY(-50%) translateX(100%);
		transform: translateY(-50%) translateX(100%)
	}

	.el-badge__content.is-fixed.is-dot {
		right: 5px
	}

	.el-badge__content.is-dot {
		height: 8px;
		width: 8px;
		padding: 0;
		right: 0;
		border-radius: 50%
	}

	.el-badge__content--primary {
		background-color: #409EFF
	}

	.el-badge__content--success {
		background-color: #67C23A
	}

	.el-badge__content--warning {
		background-color: #E6A23C
	}

	.el-badge__content--info {
		background-color: #909399
	}

	.el-badge__content--danger {
		background-color: #F56C6C
	}
</style>