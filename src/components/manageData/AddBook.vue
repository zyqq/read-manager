<template>
	<div>
		<el-form ref="form" :rules="rules" name='form' :model="form" label-width="80px">
			<el-form-item label="图书名字" prop='name'>
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="图书作者" prop='author'>
				<el-input v-model="form.author"></el-input>
			</el-form-item>
			<el-form-item label="出版社" prop='pubHouse'>
				<el-input v-model="form.pubHouse"></el-input>
			</el-form-item>
			<el-form-item label="图书isbn" prop='isbn'>
				<el-input placeholder='位于图书背面的一串数字' v-model="form.isbn"></el-input>
			</el-form-item>
			<el-form-item label="图书供方" prop='provider'>
				<el-input v-model="form.provider"></el-input>
			</el-form-item>
			<el-form-item label="图书介绍" prop='description'>
				<el-input type="textarea" v-model="form.description"></el-input>
			</el-form-item>
			<el-form-item label="图书封面" prop="image">
				<el-upload list-type="picture" :on-change="onChange" :auto-upload="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="uploadSuccess" name="image" class="upload-demo" action='#' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="activityList">
					<el-tooltip content="请上传以.png.jpg.jpeg为后缀的图片(只限一个，多次上传会覆盖)" placement="top" effect="light">
						<el-button size="small" type="primary">上传图片</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'AddBook',
		data() {
			return {
				activityList: [],
				form: {
					name: '',
					author: '',
					pubHouse: '',
					isbn: '',
					description: '',
					provider: '荔进社',
					image: '11'
				},
				rules: {
					name: [{
						required: true,
						message: '请填写图书名字',
						trigger: 'blur'
					}],
					author: [{
						required: true,
						message: '请填写图书作者',
						trigger: 'blur'
					}],
					pubHouse: [{
						required: true,
						message: '请填写出版社',
						trigger: 'blur'
					}],
					isbn: [{
						required: true,
						message: '请填写图书isbn',
						trigger: 'blur'
					}],
					description: [{
						required: true,
						message: '请填写图书介绍',
						trigger: 'blur'
					}],
					provider: [{
						required: true,
						message: '请填写提供方',
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
				this.form.image = file.url;
				//this.setImagePreview();
			},
			beforeUpload(file) {
				console.log(file)
			},
			onSubmit(formName) {
				var formData = $("form[name=form]");
				var data = new FormData(formData[0]);
				data.append('name', this.form.name);
				data.append('author', this.form.author);
				data.append('pubHouse', this.form.pubHouse);
				data.append('isbn', this.form.isbn);
				data.append('description', this.form.description);
				data.append('provider', this.form.provider);
				this.$refs[formName].validate((valid) => {
					if(valid) {
						axios({
								method: 'post',
								dataType: 'json',
								url: 'http://47.93.190.186:8080/addBook.do',
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
								if(response.data.statusCode == 4005) {
									alert(response.data.message);
								} else if(response.data.statusCode == 102) {
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
		mounted() {

			//			var iframe = document.getElementById('info');
			//			if(iframe.attachEvent) {
			//				iframe.attachEvent("onload", function() {
			//					console.log(iframe.contentWindow.document.body.innerHTML);
			//				});
			//			} else {
			//				iframe.onload = function() {
			//					console.log(iframe.contentWindow.document.body.innerHTML);
			//				};
			//			}
		}
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