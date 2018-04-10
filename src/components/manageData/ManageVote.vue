<template>
	<div>
		<el-form ref="form" :rules="rules" name='form' :model="form" label-width="80px">
			<el-form-item label="图书名字">
				<el-input v-model="form.bookName"></el-input>
			</el-form-item>
			<el-form-item label="作者">
				<el-input v-model="form.author"></el-input>
			</el-form-item>
			<el-form-item label="出版社">
				<el-input v-model="form.pubHouse"></el-input>
			</el-form-item>
			<el-form-item label="推荐投票理由">
				<el-input type="textarea" v-model="form.voteReason"></el-input>
			</el-form-item>
			<el-form-item label="图书封面" prop="image">
				<el-upload list-type="picture" :on-change="onChange" :auto-upload="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="uploadSuccess" name="image" class="upload-demo" action='#' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="activityList">
					<el-tooltip content="请上传以.png.jpg.jpeg为后缀的图片(只限一个，多次上传会覆盖)" placement="top" effect="light">
						<el-button size="small" type="primary">上传图片</el-button>
					</el-tooltip>
				</el-upload>
			</el-form-item>

			<el-form-item label="投票书isbn">
				<el-input placeholder='新增的不必填，更新投票书的时候需填上相应书isbn' v-model="form.voteBookId"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('form')">添加/更新</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
				<el-button @click="openVote()">开启投票通道</el-button>
				<el-button @click="closeVote()">关闭投票通道</el-button>
				<el-button @click="againVote()">重置投票</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="bookData" style="width: 100%">
			<el-table-column prop="voteBookId" label="书isbn">
			</el-table-column>
			<el-table-column label="封面">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>{{ scope.row.bookName }}</p>
						<div slot="reference" class="name-wrapper">
							<img width="50px" height="50px" :src="scope.row.bookImg" />
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="bookName" label="书名">
			</el-table-column>
			<el-table-column prop="author" label="作者">
			</el-table-column>
			<el-table-column prop="pubHouse" label="出版社">
			</el-table-column>
			<el-table-column prop="voteReason" label="投票理由">
			</el-table-column>
			<el-table-column prop="votes" label="投票数">
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
	import $ from 'jquery'

	export default {
		name: 'ManageVote',
		data() {
			return {
				bookData: [],
				activityList: [],
				form: {
					bookName: '',
					author: '',
					pubHouse: '',
					voteReason: '',
					voteBookId: '',
					image: '11'
				},
				fileList: [],
				rules: {
					name: [{
							required: true,
							message: '请输入活动名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 5,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					region: [{
						required: true,
						message: '请选择活动区域',
						trigger: 'change'
					}],
					date1: [{
						type: 'date',
						required: true,
						message: '请选择日期',
						trigger: 'change'
					}],
					date2: [{
						type: 'date',
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}],
					type: [{
						type: 'array',
						required: true,
						message: '请至少选择一个活动性质',
						trigger: 'change'
					}],
					resource: [{
						required: true,
						message: '请选择活动资源',
						trigger: 'change'
					}],
					desc: [{
						required: true,
						message: '请填写活动形式',
						trigger: 'blur'
					}]
				}
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
			openVote() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/openVote.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							alert(response.data.message);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			closeVote() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/closeVote.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						}
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							alert(response.data.message);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			againVote() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/againVote.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							alert(response.data.message);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			onSubmit(formName) {
				var _this = this;
				var formData = $("form[name=form]");
				var data = new FormData(formData[0]);
				data.append('bookName', this.form.bookName);
				data.append('author', this.form.author);
				data.append('pubHouse', this.form.pubHouse);
				data.append('voteReason', this.form.voteReason);
				if(this.form.voteBookId != '') {
					data.append('voteBookId', this.form.voteBookId);
				}
				this.$refs[formName].validate((valid) => {
					if(valid) {
						axios({
								method: 'post',
								dataType: 'json',
								url: this.form.voteBookId != '' ? 'http://47.93.190.186:8080/updateVoteBook.do' : 'http://47.93.190.186:8080/addVoteBook.do',
								data: data,
								cache: false,
								processData: false,
								contentType: false,
							})
							.then(function(response) {
								console.log(response);
								if(response.data.statusCode == 102) {
									_this.getVoteBooks();
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
			getVoteBooks() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getVoteBooks.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						_this.bookData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.result;
							console.log(responseData)
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].bookImg = 'http://47.93.190.186:8080' + responseData[i].bookImg;
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
				params.append('voteBookId', row[index].voteBookId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteVoteBook.do',
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
			this.getVoteBooks();
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