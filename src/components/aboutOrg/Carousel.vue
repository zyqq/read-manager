<template>
	<div>
		<el-form :model="form" :rules="rules" ref="form" label-width="80px">
			<el-form-item label="轮播链接" prop='pushUrl'>
				<el-input v-model="form.pushUrl"></el-input>
			</el-form-item>
			<el-form-item label="轮播介绍" prop='description'>
				<el-input type="textarea" v-model="form.description"></el-input>
			</el-form-item>
			<el-form-item label="轮播图" prop="picture">
				<el-upload list-type="picture" :on-change="onChange" :auto-upload="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="uploadSuccess" name="image" class="upload-demo" action='#' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="activityList">
					<el-tooltip content="请上传以.png.jpg.jpeg为后缀的图片(只限一个，多次上传会覆盖)" placement="top" effect="light">
						<el-button size="small" type="primary">上传图片</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">添加轮播图</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'Carousel',
		data() {
			return {
				activityList: [],
				form: {
					description: '',
					pushUrl: '',
					picture: ''
				},
				rules: {
					description: [{
						required: true,
						message: '请填写轮播图介绍',
						trigger: 'blur'
					}],
					pushUrl: [{
						required: true,
						message: '轮播图链接',
						trigger: 'blur'
					}]
				},
				fileList: [],
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
				data.append('pushUrl', this.form.pushUrl);
				data.append('description', this.form.description);
				//				axios.interceptors.request.use(
				//					config => {
				//						// 判断是否存在token，如果存在的话，则每个http header都加上token
				//						// config.withCredentials = true
				//						config.headers['X-Token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuamlhamlh'
				//
				//						return config
				//					},
				//					err => {
				//						return Promise.reject(err)
				//					})
				this.$refs[formName].validate((valid) => {
					if(valid) {

						axios({
								method: 'post',
								dataType: 'json',
								url: 'http://47.93.190.186:8080/addCarousel.do',
								data: data,
								headers: {
									'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryZN8L8IJgRBAp5pTW',
									'x-key': window.sessionStorage.getItem('adminId'),
									'x-token': window.sessionStorage.getItem('token')
								},
								//						xsrfHeaderName: {
								//							'x-key': window.sessionStorage.getItem('adminId'),
								//							'x-token': window.sessionStorage.getItem('token')
								//						},
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