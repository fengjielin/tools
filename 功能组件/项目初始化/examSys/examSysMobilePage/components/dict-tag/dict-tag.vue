<template>
	<view>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.dictValue)">
				<text :key="item.dictValue" :index="index">{{ item.dictLabel }}</text>
			</template>
		</template>
	</view>
</template>

<script>
	export default {
		name: "dict-tag",
		props: {
			options: {
				type: Array,
				default: null,
			},
			value: [Number, String, Array],
		},
		computed: {
			values() {
				if (this.value !== null && typeof this.value !== 'undefined') {
					return Array.isArray(this.value) ? this.value : [String(this.value)];
				} else {
					return [];
				}
			},
		},
		created() {
			console.log('', this.value);
			console.log(this.options);
		}
	};
</script>
<style scoped>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
</style>