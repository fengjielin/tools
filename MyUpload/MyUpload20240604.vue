<template>
  <div class="container">
    <Upload
      :multiple="isMultiple"
      ref="uploadRefs"
      :show-upload-list="false"
      :action="uploadUrl"
      :on-progress="handleProgress"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-format-error="formatError"
      :format="format"
      :data="paramsData"
      v-if="isDel"
    >
      <slot>
        <Button type="primary">选择文件</Button>
      </slot>
    </Upload>
    <span style="line-height: 24px" class="upload-tip" v-if="showTip && isDel">
      {{ '仅支持上传 ' + this.format + ' 格式的文件，且上传文件大小不能超过' + this.size + 'Mb' }}
      <template v-if="format.includes('mp4')">{{ '；且上传的视频文件时长不能超过' + this.videoSize + '分钟' }}</template>
    </span>
    <div v-if="showUploadList" class="upload-list-wrapper">
      <Progress v-if="showProgress" :percent="percentage" :stroke-width="5"></Progress>
      <div class="upload_list" v-for="(item, index) in uploadListTemp" :key="index">
        <template v-if="item.status === 'finished'">
          <div class="upload_list-cover">
            <div class="ellipsis">
              <span v-if="item" target="_blank" :href="interfaceUrl + item.attachUrl" @click="showDetails(item)" class="attach_name">
                {{ item ? item.attachName : '' }}
              </span>
            </div>
            <div v-if="isDel">
              <Icon class="remove_icon" type="md-close" @click.native="handleRemove(item)"></Icon>
            </div>
          </div>
        </template>
        <template v-else></template>
      </div>
    </div>

    <!-- <Modal v-model="detailsModal" :title="title" width="1500" footer-hide @on-cancel="detailsClose" :styles="{ top: '10px' }" class="file-viewer-model"></Modal> -->

    <el-dialog :title="title" :visible.sync="detailsModal" width="1500px" append-to-body>
      <div class="modal desc_modal">
        <Spin size="large" fix v-if="spinShow">加载中...</Spin>
        <div v-if="isImg">
          <!-- <image-viewer :image="docPath"></image-viewer> -->
        </div>
        <div v-if="isDoc">
          <!-- <word-viewer :buffer="buffer"></word-viewer> -->
        </div>
        <div v-if="isXls">
          <div class="default_page">
            <h3>暂不支持预览Excel文档</h3>
            <div>
              <Button type="primary" @click="downloadFile(detailsData.attachId)">下载文档</Button>
            </div>
          </div>
        </div>
        <div v-if="isPdf">
          <iframe class="preview_iframe" frameborder="0" scrolling="auto" :src="docPath"></iframe>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MyUpload',
    props: {
      // 上传的url
      uploadUrl: {
        type: String,
        default: '',
      },
      // 上传文件的列表
      uploadList: {
        type: Array,
        default: () => [],
      },
      // 上传文件的大小限制 M
      size: {
        type: Number,
        default: 10,
      },
      videoSize: {
        type: Number,
        default: 5,
      },
      format: {
        type: Array,
        default: () => ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'txt', 'wps', 'rar', 'zip', 'jpg', 'jpeg', 'png'],
      },
      // 是否显示提示语
      showTip: {
        type: Boolean,
        default: true,
      },
      // 是否显示文件列表
      showUploadList: {
        type: Boolean,
        default: true,
      },
      // 是否可上传多个文件 需要使用 v-if
      isMultiple: {
        type: Boolean,
        default: false,
      },
      // 上传时附带的额外参数
      paramsData: {
        type: Object,
        default: () => {
          return {};
        },
      },
      // 文件列表是否可删除
      isDel: {
        type: Boolean,
        default: true,
      },
      // 额外的移除逻辑
      extraRemove: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        uploadListTemp: this.uploadList,
        downloadUrl: this.interfaceUrl + '',
        showProgress: '',
        percentage: 0,
        isImg: false,
        isDoc: false,
        isXls: false,
        isPdf: false,

        fileTemp: [], // 上传前将上传的File对象保存起来

        detailsModal: false,
        detailsData: '',
        docPath: '',
        title: '',
        spinShow: false,

        tipModal: false,
        tipTitle: '',
        tipContent: '',
      };
    },
    created() {},
    mounted() {},
    watch: {
      uploadList: {
        handler(val) {
          this.uploadListTemp = val;
        },
      },
    },
    computed: {},
    methods: {
      tipShow() {
        this.tipModal = true;
      },
      tipClose() {
        this.tipModal = false;
      },
      showDetails(row) {
        // this.title = `文档详情 (${row.attachName})`;
        // this.detailsData = row;
        // this.detailsModal = true;
        // this.judgeDocType(row.attachUrl);
        // if (this.isPdf || this.isImg) {
        //   this.docPath = this.interfaceUrl + row.attachUrl;
        // } else if (!this.isXls) {
        //   this.getDoc(row.attachId);
        // }
        let url = this.interfaceUrl + row.attachUrl;
        window.open(url);
      },
      detailsClose() {
        this.detailsModal = false;
      },
      // 根据文件名获取文件类型
      judgeDocType(filename) {
        let imgExt = ['.png', '.jpg', '.jpeg', '.bmp', '.gif']; //图片文件的后缀名
        let docExt = ['.doc', '.docx']; //word文件的后缀名
        let xlsExt = ['.xls', '.xlsx']; //excel文件的后缀名
        let pdfExt = ['.pdf']; //pdf文件的后缀名

        this.isImg = typeMatch(imgExt, filename);
        this.isDoc = typeMatch(docExt, filename);
        this.isXls = typeMatch(xlsExt, filename);
        this.isPdf = typeMatch(pdfExt, filename);

        function typeMatch(typeArr, filename) {
          var ext = extension(filename);
          if (contain(typeArr, ext)) {
            return true;
          }
          return false;
        }
        //获取文件名后缀名
        function extension(filename) {
          let suffix = '';
          let name = filename.toLowerCase();
          let i = name.lastIndexOf('.');
          if (i > -1) {
            suffix = name.substring(i);
          }
          return suffix;
        }
        //判断Array中是否包含某个值
        function contain(typeArr, obj) {
          for (let i = 0; i < typeArr.length; i++) {
            if (typeArr[i] === obj) return true;
          }
          return false;
        }
      },

      // 上传 statrt
      handleProgress(progressEvent) {
        this.showProgress = true;
        this.$emit('setShowProgress', true);
        this.$emit('setSpin', true);
        this.$forceUpdate();
        this.percentage = parseInt(progressEvent.percent);
        this.$emit('setPercentage', this.percentage);
      },
      handleBeforeUpload(file) {
        return new Promise((resolve, reject) => {
          this.fileTemp.push(file);
          let flag = file.size > this.size * 1024 * 1024; // 字节
          if (flag) {
            this.$modal.msgWarning('上传文件大小不能超过' + this.size + 'Mb');
            reject();
          }
          if (file.type == 'video/mp4') {
            this.FileValue(file).then((duration) => {
              console.log('视频时长：', duration);
              file.duration = duration;
              let videoSize = this.videoSize * 60;
              if (file.duration > videoSize) {
                this.$modal.msgWarning('上传的视频文件时长不能超过' + this.videoSize + '分钟');
                reject();
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      },
      formatError() {
        this.tipContent = `仅支持上传${this.format}格式的文件`;
        if (this.format.includes('mp4')) {
          let videoTip = `且上传的视频文件时长不能超过${this.videoSize}分钟`;
          this.tipContent = this.tipContent + videoTip;
        }
        // this.$Modal.error({
        //   title: '提示',
        //   content: '仅支持上传 ' + this.format + ' 格式的文件，且上传文件大小不能超过' + this.size + 'Mb',
        //   closable: true,
        //   className: 'formatError',
        // });
        this.$modal.alertError(this.tipContent);
        this.$emit('setSpin', false);
      },
      handleRemove(file) {
        this.$forceUpdate();
        let fileList = '';
        if (this.isMultiple) {
          fileList = this.uploadListTemp;
        } else {
          fileList = this.$refs['uploadRefs'].fileList;
        }
        if (this.extraRemove) {
          let index = this.uploadListTemp.indexOf(file);
          this.$emit('on-remove', index);
        } else {
          let index = fileList.indexOf(file);
          this.$refs['uploadRefs'].fileList.splice(index, 1);
          this.uploadListTemp.splice(index, 1);
        }
      },
      handleSuccess(res, file, fileList) {
        if (res.state) {
          res.showProgress = false;
          file.attachUrl = res.url ? '/' + res.url : res.attachUrl;
          file.attachName = file.name;

          // 判断资源是否为视频
          this.judgeDocType(file.attachUrl);
          if (this.isVideo) {
            let FileObj = this.fileTemp.find((item) => item.uid == file.uid);
            console.log(FileObj);
            if (FileObj) {
              this.FileValue(FileObj).then((duration) => {
                console.log('视频时长：', duration);
                file.duration = duration;
              });
            }
            this.uploadedSuccessfully();
          } else {
            this.uploadedSuccessfully();
          }
        } else {
          this.$Message.error(res.message);
        }
        this.showProgress = false;
        this.percentage = 0;
        this.$emit('setPercentage', this.percentage);
        this.$emit('setShowProgress', false);
        this.$emit('setSpin', false);
      },
      // 上传结束处理
      uploadedSuccessfully() {
        // let tempList = [...this.uploadListTemp]; // 上传多条
        let tempList = this.isMultiple ? [...this.uploadListTemp] : []; // 上传单条
        for (const t of this.$refs['uploadRefs'].fileList) {
          if (tempList.find((c) => c.uid == t.uid && c.attachName == t.attachName)) {
            continue;
          }
          tempList.push(t);
        }
        if (!this.isMultiple) {
          this.$refs['uploadRefs'].clearFiles(); // 上传单条
        }
        this.uploadListTemp = tempList;
        this.$emit('on-upload', this.uploadListTemp);
      },
      // 上传 end

      /**
       *
       * @param {*} file 用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象
       * @returns {number} 视频的时长 单位：秒
       */
      FileValue(file) {
        let fileurl = URL.createObjectURL(file);
        let audioElement = new Audio(fileurl);
        // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。
        // 音频/视频的元数据包括：时长、尺寸（仅视频）以及文本轨道。
        let duration;
        return new Promise((resolve, reject) => {
          audioElement.addEventListener('loadedmetadata', function (_event) {
            duration = audioElement.duration;
            // console.log("视频的时长为:",duration); //单位：秒
            resolve(duration);
          });
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .upload_list {
    margin-top: 6px;
    /* margin-right: 132px; */
  }
  .upload_list-cover {
    min-width: 200px;
    height: 50px;
    line-height: 50px;
    background: #f8f8f9;
    padding-left: 20px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .remove_icon {
    margin-left: 5px;
    color: #ed4014;
    cursor: pointer;
    font-size: 20px;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .preview_iframe {
    width: 100%;
    height: 86vh;
    margin: auto;
    background: #fff;
  }
  .desc_modal {
    padding: 0;
  }
  .attach_name {
    cursor: pointer;
    color: #2b85e4;
  }
  .upload-tip {
    margin-top: 8px;
    margin-left: 8px;
  }
</style>

<style lang="less">
  .file-viewer-model {
    .ivu-modal-mask,
    .ivu-modal-wrap {
      z-index: 999999 !important;
    }
  }
</style>
