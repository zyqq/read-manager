<template>
	<div>

		<el-button size="mini" class="add" @click="protocolDialog = true; isAdd = true">新增用户协议</el-button>
		
		<el-table :data="protocalData" style="width: 100%">
			<el-table-column prop="id" label="id">
			</el-table-column>
			<el-table-column prop="userProtocol" label="用户协议">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="protocolDialog = true">更新</el-button>
					<el-dialog title="更新用户协议" :visible.sync="protocolDialog">
						<el-form>
							<el-form-item label="用户协议">
								<el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 15}" placeholder="请填写新的用户协议" v-model="userProtocol" auto-complete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="protocolDialog = false">取 消</el-button>
							<el-button v-if="isAdd" type="primary" @click="addProtocol(scope.$index, protocalData)">确 定</el-button>
							<el-button v-else type="primary" @click="handleUpdate(scope.$index, protocalData)">确 定</el-button>
						</div>
					</el-dialog>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'UserProtocol',
		data() {
			return {
				isAdd: false,
				protocalData: [],
				activityList: [],
				userProtocol: '',
				protocolDialog: false,
				form: {
					title: '',
					pubHouse: '',
					description: '',
					image: '11'
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
			addProtocol() {
				this.isAdd = false;
				var _this = this;
				var params = new URLSearchParams();
				this.protocolDialog = false;
				params.append('userProtocol', this.userProtocol);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/addUserProtocol.do',
						data: params,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						console.log(response);
						if(response.data.statusCode == 102) {
							_this.getUserProtocol();
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err);
						alert("请检查网络连接");
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
			getUserProtocol() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getUserProtocol.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
					})
					.then(function(response) {
						_this.protocalData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.result;
							_this.protocalData.push(responseData);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			handleUpdate(index, row) {
				var _this = this;
				var params = new URLSearchParams();
				this.protocolDialog = false;
				params.append('userProtocol', this.userProtocol);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/updateUserProtocol.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							_this.getUserProtocol();
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
			this.getUserProtocol();
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
	.add{
		float: right;
		margin: 20px;
	}
</style>