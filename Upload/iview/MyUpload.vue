<template>
  <div class="upload-wrapper">
    <Upload
      :multiple="isMultiple"
      ref="uploadRefs"
      :show-upload-list="false"
      :default-file-list="defaultFileList"
      :action="uploadUrl"
      :on-progress="handleProgress"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-format-error="formatError"
      :on-error="handleError"
      :format="format"
      :data="paramsData"
      :headers="headers"
      v-if="isDele"
    >
      <slot>
        <Button type="primary" @click.stop="handleUploadConfirm">选择文件</Button>
      </slot>
    </Upload>
    <div class="upload-tip" v-if="showTip">
      {{ '仅支持上传 ' + this.format + ' 格式的文件，且上传文件大小不能超过' + this.size + 'Mb' }}
    </div>
    <div v-if="showUploadList" class="upload-list-wrapper">
      <div class="upload_list" v-for="(item, index) in uploadListTemp" :key="index">
        <template v-if="item.status === 'finished'">
          <div class="upload_list-cover">
            <div class="ellipsis" style="max-width: 420px" @click="checkFile(item)" :title="item.attachName">
              <!-- <Icon type="document" style="font-size: 16px" /> -->
              <a v-if="item" target="_blank" class="attach_name">
                {{ item ? item.attachName : '' }}
              </a>
            </div>
            <div v-if="isDele">
              <Icon class="remove_icon" type="close-round" @click.native="handleRemove(item)"></Icon>
            </div>
            <div v-if="isDownload">
              <Icon class="remove_icon" type="ios-cloud-download" @click.native="handleDownload(item)" style="color: #57a3f3"></Icon>
            </div>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="parseInt(item.percentage)" :stroke-width="5"></Progress>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyUpload', // 2024-10-29
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
      // 这个默认列表为静态的初始化数据，后续不要动态改变，因为在后面存在一下赋值，导致Upload组件内出现fileList的uid对不上的问题
      defaultFileList: {
        type: Array,
        default: () => [],
      },
      // 上传文件的大小限制 M
      size: {
        type: Number,
        default: 5000,
      },
      // 文件的格式限制
      format: {
        type: Array,
        default: () => ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'ppt', 'pptx', 'txt', 'wps', 'rar', 'zip', 'jpg', 'jpeg', 'png', 'mp4'],
      },
      // 是否显示提示语
      showTip: {
        type: Boolean,
        default: false,
      },
      // 是否显示文件列表
      showUploadList: {
        type: Boolean,
        default: false,
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
      isDele: {
        type: Boolean,
        default: true,
      },
      // 额外的移除逻辑
      extraRemove: {
        type: Boolean,
        default: false,
      },
      // 是否显示下载按钮
      isDownload: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        uploadListTemp: this.uploadList,
        downloadUrl: this.interfaceUrl + '',
        showProgress: false,
        percentage: 0,
        isImg: false,
        isDoc: false,
        isXls: false,
        isPdf: false,

        fileTemp: [], // 上传前将上传的File对象保存起来
        headers: {
          // Authorization: `Bearer ${this.$store.state.jwt.token}`,
        },
      };
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      handleUploadConfirm() {
        this.$Modal.confirm({
          title: '重要提示',
          content: '严禁在本互联网非涉密平台处理，传输国家秘密，请确认扫描，传输的文件资料不涉及国家秘密',
          onOk: () => {
            console.log(this.$refs['uploadRefs']);
            this.$refs['uploadRefs'].handleClick();
          },
          onCancel: () => {},
        });
      },
      handleDownload(item) {
        this.$emit('handleDownload', item);
      },
      checkFile(item) {
        this.$emit('checkFile', item);
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

        let videoExt = ['.mp4']; //mp4文件的后缀名
        this.isVideo = typeMatch(videoExt, filename);

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
      handleProgress(progressEvent, file, fileList) {
        // console.log(file, fileList);
        this.showProgress = true;
        this.$emit('setShowProgress', true);
        this.$emit('setSpin', true);
        this.$forceUpdate();
        this.percentage = parseInt(progressEvent.percent);
        this.$emit('setPercentage', this.percentage);
      },
      handleBeforeUpload(file) {
        this.fileTemp.push(file);
        let flag = file.size > this.size * 1024 * 1024; // 字节
        if (flag) {
          this.$Message.warning('上传文件大小不能超过' + this.size + 'Mb');
          return false;
        }
        // 2024-10-29 将文件列表对象的引用地址赋值为上传组件中绑定的对象，实现每一个文件的单独进度条显示
        this.uploadListTemp = this.$refs['uploadRefs'].fileList;
        this.$emit('on-upload', this.$refs['uploadRefs'].fileList);
      },
      formatError() {
        this.$Modal.error({
          title: '提示',
          content: '仅支持上传 ' + this.format + ' 格式的文件，且上传文件大小不超过' + this.size + 'Mb',
          closable: true,
        });
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
          this.$emit('on-remove', index);
        }
      },
      handleSuccess(res, file, fileList) {
        console.log(res);
        if (res.state || res.status) {
          res.showProgress = false;
          file.id = res.id ? res.id : res.assessSchoolFillAttach ? res.assessSchoolFillAttach.id : '';
          file.attachUrl = res.url ? '/' + res.url : res.assessSchoolFillAttach ? res.assessSchoolFillAttach.attachUrl : res.attachUrl;
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
      handleError(error, file, fileList) {
        console.error({ error });
        this.$Message.error(`上传失败，失败原因：${error.message}`);
      },
      // 上传结束处理
      uploadedSuccessfully() {
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

<style scoped>
  /* .upload-list-wrapper {
    margin-left: 8px;
  } */
  .upload_list {
    margin-top: 6px;
  }
  .upload_list-cover {
    min-width: 200px;
    /* height: 50px; */
    /* line-height: 50px; */
    background: #f8f8f9;
    padding-left: 20px;
    padding: 6px 16px;
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
