<template>
	<div>
		<el-form ref="form" :rules="rules" name='form' :model="form" label-width="80px">
			<el-form-item label="推送链接" prop='url'>
				<el-input v-model="form.url"></el-input>
			</el-form-item>
			<el-form-item label="推送标题" prop='title'>
				<el-input v-model="form.title"></el-input>
			</el-form-item>
			<el-form-item label="推送图片" prop="image">
				<el-upload list-type="picture" :on-change="onChange" :auto-upload="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="uploadSuccess" name="image" class="upload-demo" action='#' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="activityList">
					<el-tooltip content="请上传以.png.jpg.jpeg为后缀的图片(只限一个，多次上传会覆盖)" placement="top" effect="light">
						<el-button size="small" type="primary">上传图片</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">添加推送</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'ManagePush',
		data() {
			return {
				activityList: [],
				form: {
					title: '',
					url: '',
					image: ''
				},
				fileList: [],
				rules: {
					url: [{
						required: true,
						message: '请填写推送链接',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '推送标题',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			onChange(file, fileList) {
				console.log(document.querySelector("input[type=file]").files);
				console.log(fileList);
				//this.form.picture = file.url;
				//this.setImagePreview();
			},
			beforeUpload(file) {
				console.log(file)
			},
			onSubmit(formName) {
				var formData = $("form[name=form]");
				var data = new FormData(formData[0]);
				data.append('url', this.form.url);
				data.append('title', this.form.title);
				this.$refs[formName].validate((valid) => {
					if(valid) {
						axios({
								method: 'post',
								dataType: 'json',
								url: 'http://47.93.190.186:8080/addPush.do',
								headers: {
									'x-key': window.sessionStorage.getItem('adminId'),
									'x-token': window.sessionStorage.getItem('token')
								},
								data: data,
								cache: false,
								processData: false,
								contentType: false,
							})
							.then(function(response) {
								console.log(response);
								if(response.data.statusCode == 102) {
									alert(response.data.message);
								} else {
									alert(response.data.message);
								}
							}).catch(function(err) {
								console.log(err);
								alert("请检查网络连接");
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			handleRemove(file, fileList) {

			},
			handlePreview(file) {
				console.log(file);
			},
			uploadSuccess(res, files, fileList) {
				if(res.status == 4007) {
					this.$message.warning(res.msg + ",请重传以.png、.jpg、.jpeg为后缀的图片");
				}
				console.log(res);
				//this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			uploadError(err, files, fileList) {
				this.$message.warning("上传失败,请检查网络连接");
				console.log(err);
				console.log(fileList);
				//this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			}
		},
		mounted() {}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
</style>