<template>
	<view>
		<questionnaire :trainDetailId="trainDetailId" :trainingId="trainingId" :questionnaireId="questionnaireId" ref="questionnaire"></questionnaire>
	</view>
</template>

<script>
	// 用于问卷填报的中间
	import questionnaire from '@/pages/questionnaire/index.vue'
	export default {
		components: {
			questionnaire
		},
		data() {
			return {
				questionnaireId: "",
			}
		},
		onLoad(event) {
			this.load(event.query);
		},
		methods: {
			load(e) {
				var p = decodeURIComponent(e);
				try {
					this.detailInfo = JSON.parse(p);
				} catch (error) {
					this.detailInfo = JSON.parse(p);
				}

				this.questionnaireId = this.detailInfo?.questionnaireId;
				
				this.$nextTick(() => {
					this.$refs['questionnaire'].loadData();
				})
			},
		}
	}
</script>

<style>

</style>