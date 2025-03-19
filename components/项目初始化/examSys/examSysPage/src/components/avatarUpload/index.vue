<template>
  <div>
    <div class="user-info-head" :class="{ no_editable: !editable }" @click="editCropper()">
      <img v-bind:src="avatar" :title="editable ? '点击上传' : ''" class="" style="width: 100%; height: 100%" />
    </div>

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened" @close="closeDialog">
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :sm="3" :xs="3">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :sm="2" :xs="2">
          <el-button type="primary" size="small" @click="uploadImg()">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { VueCropper } from 'vue-cropper';
  import { debounce } from '@/utils';

  export default {
    components: { VueCropper },
    props: {
      avatar: {
        type: [String, Number],
        default: '',
      },
      editable: {
        type: Boolean,
        default: true,
      },
    },
    model: {
      prop: 'avatar',
      event: 'change',
    },
    data() {
      return {
        // 是否显示弹出层
        open: false,
        // 是否显示cropper
        visible: false,
        // 弹出层标题
        title: '修改',
        options: {
          img: this.avatar, //裁剪图片的地址
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 150, // 默认生成截图框宽度
          autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: true, // 固定截图框大小 不允许改变
          outputType: 'png', // 默认生成截图为PNG格式
          filename: 'avatar', // 文件名称
        },
        previews: {},
        resizeHandler: null,
      };
    },
    methods: {
      // 编辑头像
      editCropper() {
        if (this.editable) {
          this.open = true;
        }
      },
      // 打开弹出层结束时的回调
      modalOpened() {
        this.visible = true;
        if (!this.resizeHandler) {
          this.resizeHandler = debounce(() => {
            this.refresh();
          }, 100);
        }
        window.addEventListener('resize', this.resizeHandler);
      },
      // 刷新组件
      refresh() {
        this.$refs.cropper.refresh();
      },
      // 覆盖默认的上传行为
      requestUpload() {},
      // 向左旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      // 向右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      // 图片缩放
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      // 上传预处理
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        } else if (file.type.indexOf('image/') == -1) {
          this.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。');
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.options.img = reader.result;
            this.options.filename = file.name;
          };
        }
      },
      // 上传图片
      uploadImg() {
        this.$refs.cropper.getCropBlob((data) => {
          this.blobToBase64(data).then((response) => {
            console.log(response);
            this.$emit('change', response);
            this.open = false;
            this.visible = false;
          });
        });
      },
      // 实时预览
      realTime(data) {
        this.previews = data;
      },
      // 关闭窗口
      closeDialog() {
        this.visible = false;
        window.removeEventListener('resize', this.resizeHandler);
      },

      blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            resolve(e.target.result);
          };
          fileReader.readAsDataURL(blob);
          fileReader.onerror = () => {
            reject(new Error('文件流异常'));
          };
        });
      },
    },
  };
</script>
<style scoped lang="scss">
  .user-info-head {
    position: relative;
    display: inline-block;
    height: 160px;
    width: 100%;
  }

  .user-info-head:hover:after {
    content: '+';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 42px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 132px;
    text-align: center;
  }
  .avatar-upload-preview {
    border-radius: 0;
  }
  .no_editable:hover:after {
    display: none;
  }
  .avatar-upload-preview{
    width: 150px;
    height: 200px;
  }
</style>
