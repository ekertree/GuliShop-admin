<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
        数据类型一定要和取出的json中的一致，否则没法回填
        因此，这里value使用动态绑定的值，保证其数据类型是number
        -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar + ''" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像</el-button
        >
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/file'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {},
      saveBtnDisabled: false, // 保存按钮是否禁用
      imagecropperShow: false, //上传弹窗是否显示
      imagecropperKey: 0, //上传组件key唯一标识
      BASE_API: process.env.BASE_API, //获取dev.env.js里面的地址
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    //取消修改返回
    cancel() {
      this.$router.push({ path: "/teacher/table" });
    },
    //上传成功
    cropSuccess(data) {
      this.imagecropperShow = false;
      this.teacher.avatar = data.url;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    //关闭上传弹窗
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getTeacherInfoById(id);
      } else {
        this.teacher = {
          avatar:
            "https://gulli-edu.oss-cn-shanghai.aliyuncs.com/2022/07/21/148902837aa743729577b03529cc115dfile.png",
        };
      }
    },
    saveOrUpdate() {
      //根据id判断是添加还是修改
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
      this.saveBtnDisabled = true;
      this.$router.push({ path: "/teacher/table" });
    },
    //添加讲师
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //回到页面列表 路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },
    //修改讲师信息
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
      });
    },
    //根据讲师id查询讲师信息
    getTeacherInfoById(id) {
      teacherApi.getTeacherInfoById(id).then((response) => {
        if (
          response.data.teacher != null &&
          response.data.teacher != undefined
        ) {
          this.teacher = response.data.teacher;
        } else {
          this.$message({
            type: "error",
            message: "该讲师不存在！",
          });
          this.$router.push({ path: "/teacher/list" });
        }
      });
    },
  },
};
</script>