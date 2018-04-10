<template>
	<div>
		<el-form ref="form" :rules="rules" name='form' :model="form" label-width="80px">
			<el-form-item label="图书名字" prop='title'>
				<el-input v-model="form.title"></el-input>
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
				<el-button type="primary" @click="onSubmit('form')">添加好书</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="bookData" style="width: 100%">
			<el-table-column prop="goodbookId" label="书isbn">
			</el-table-column>
			<el-table-column label="封面">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>{{ scope.row.name }}</p>
						<img width="200px" height="200px" :src="scope.row.picture" />
						
						<div slot="reference" class="name-wrapper">
							<img width="50px" height="50px" :src="scope.row.picture" />
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="书名">
			</el-table-column>
			<el-table-column prop="description" label="书籍简述">
			</el-table-column>
			<el-table-column prop="date" label="入库时间" align="center" width="165">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, bookData)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'ManageGoodBooks',
		data() {
			return {
				bookData: [],
				activityList: [],
				form: {
					title: '',
					description: '',
					image: '11'
				},
				rules: {
					title: [{
						required: true,
						message: '请填写图书名字',
						trigger: 'blur'
					}],
					description: [{
						required: true,
						message: '请填写图书介绍',
						trigger: 'blur'
					}],
				},
				fileList: [],
			}
		},
		methods: {
			onChange(file, fileList) {
				console.log(document.querySelector("input[type=file]").files);
				console.log(fileList);
				//	this.form.image = file.url;
				//this.setImagePreview();
			},
			beforeUpload(file) {
				console.log(file)
			},
			onSubmit(formName) {
				var _this = this;
				var formData = $("form[name=form]");
				var data = new FormData(formData[0]);
				data.append('title', this.form.title);
				data.append('description', this.form.description);
				this.$refs[formName].validate((valid) => {
					if(valid) {
						axios({
								method: 'post',
								dataType: 'json',
								url: 'http://47.93.190.186:8080/addGoodBook.do',
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
									_this.getBook();
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
			},

			timestampToTime(timestamp) {
				var myData = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = myData.getFullYear() + '-';
				var M = (myData.getMonth() + 1 < 10 ? '0' + (myData.getMonth() + 1) : myData.getMonth() + 1) + '-';
				var D = (myData.getDate() < 10 ? ('0' + myData.getDate()) : myData.getDate()) + ' ';
				var h = (myData.getHours() < 10 ? ('0' + myData.getHours()) : myData.getHours()) + ':';
				var m = (myData.getMinutes() < 10 ? ('0' + myData.getMinutes()) : myData.getMinutes()) + ':';
				var s = (myData.getSeconds() < 10 ? ('0' + myData.getSeconds()) : myData.getSeconds());

				return Y + M + D + h + m + s;
			},
			getBook() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getGoodBooks.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						_this.bookData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.books;
							console.log(responseData)
							for(var i = 0; i < responseData.length; i++) {
								console.log(responseData[i].pubDate)
								responseData[i].date = _this.timestampToTime(responseData[i].date);
								responseData[i].picture = 'http://47.93.190.186:8080' + responseData[i].picture;
								_this.bookData.push(responseData[i]);
							}
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			handleDelete(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('goodBookId', row[index].goodbookId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteGoodBook.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							row.splice(index, 1);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			},
			handleAdd(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('isbn', row[index].isbn);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/addBookById.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							row[index].stock++;
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			}
		},
		mounted() {
			this.getBook();
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
	
	.el-pagination {
		padding: 25px 5px;
		text-align: center;
	}
</style>