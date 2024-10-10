<template>
	<div class="qrcode">
		<div id="reader"></div>
	</div>
</template>

<script>
	import {
		Html5Qrcode
	} from "html5-qrcode";
	export default {
		data() {
			return {
				cameraId: ""
			}
		},
		created() {
			this.getCameras()
		},
		beforeDestroy() {
			this.stop();
		},
		methods: {
			getCameras() {
				Html5Qrcode.getCameras()
					.then((devices) => {
						if (devices && devices.length) {
							this.html5QrCode = new Html5Qrcode("reader");
							if (devices.length > 1) {
								this.cameraId = devices[1].id;
							} else {
								this.cameraId = devices[0].id;
							}
							this.start();
						}
					})
					.catch((err) => {
						this.html5QrCode = new Html5Qrcode("reader");
						this.error = "ERROR: 您需要授予相机访问权限"
						this.$emit("err", this.error)
					});
			},
			start() {
				//environment后置 user前置
				this.html5QrCode
					.start(
						this.cameraId, {
							fps: 2,
							qrbox: {
								width: 250,
								height: 250
							},
						},
						(decodedText, decodedResult) => {
							this.$emit("ok", decodedText)
						}
					)
					.catch((err) => {
						this.$emit("err", err)
					});
			},
			stop() {
				this.html5QrCode.stop().then((ignore) => {
						console.log("QR Code scanning stopped.");
					})
					.catch((err) => {
						// Stop failed, handle it.
						console.log("Unable to stop scanning.");
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.qrcode {
		position: fixed;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 1);
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 10009;
	}

	#reader {
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}
</style>