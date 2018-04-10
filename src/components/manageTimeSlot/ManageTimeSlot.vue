<template>
	<div>

		<el-button size="mini" class="add" @click="updataTimeSlotDialog = true; isAdd = true">增加时间段</el-button>

		<el-table :data="timeSlotData" style="width: 100%">
			<el-table-column prop="slotId" label="id">
			</el-table-column>
			<el-table-column prop="slotTime" label="预约时间段">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" @click="showUpdate(scope.$index)">更新</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, timeSlotData)">删除</el-button>
					<el-dialog title="更新预约时间段" :visible.sync="updataTimeSlotDialog">
						<el-form>
							<el-time-select placeholder="起始时间" v-model="startTime" :picker-options="{
      start: '08:00',
      step: '00:30',
      end: '23:00'
    }">
							</el-time-select>
							<el-time-select placeholder="结束时间" v-model="endTime" :picker-options="{
      start: '08:00',
      step: '00:30',
      end: '23:00',
      minTime: startTime
    }">
							</el-time-select>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="updataTimeSlotDialog = false">取 消</el-button>
							<el-button v-if="isAdd" type="primary" @click="addTimeSlot(selectIndex, timeSlotData)">增 加</el-button>
							<el-button v-else type="primary" @click="handleUpdate(selectIndex, timeSlotData)">确 定</el-button>
						</div>
					</el-dialog>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'
	import $ from 'jquery'

	export default {
		name: 'ManageTimeSlot',
		data() {
			return {
				isAdd: false,
				selectIndex: 0,
				timeSlotData: [],
				activityList: [],
				userProtocol: '',
				startTime: '',
				endTime: '',
				updataTimeSlotDialog: false,
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
			test(index, row) {
				console.log(index)
				console.log(row[index].slotId)
			},
			onChange(file, fileList) {
				console.log(document.querySelector("input[type=file]").files);
				console.log(fileList);
				//	this.form.image = file.url;
				//this.setImagePreview();
			},
			beforeUpload(file) {
				console.log(file)
			},
			// template中的dialog的scope.$index始终指向最后一个数据，因此点击按钮时便传递index
			showUpdate(index) {
				this.selectIndex = index;
				this.updataTimeSlotDialog = true;
			},
			addTimeSlot() {
				this.isAdd = false;
				var _this = this;
				var params = new URLSearchParams();
				this.updataTimeSlotDialog = false;
				params.append('slotTime', this.startTime + '-' + this.endTime);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/addTimeSlot.do',
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
							_this.getTimeSlots();
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
			handleDelete(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('slotId', row[index].slotId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteTimeSlot.do',
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
			getTimeSlots() {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'jsonp',
						url: 'http://47.93.190.186:8080/getTimeSlots.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},

					})
					.then(function(response) {
						_this.timeSlotData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.result;
							for(var i = 0; i < responseData.length; i++) {
								_this.timeSlotData.push(responseData[i]);
							}

						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			},
			handleUpdate(index, row) {
				console.log(index);
				var _this = this;
				var params = new URLSearchParams();
				this.updataTimeSlotDialog = false;
				params.append('slotId', row[index].slotId);
				params.append('slotTime', this.startTime + '-' + this.endTime);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/updateTimeSlot.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							_this.getTimeSlots();
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
			this.getTimeSlots();
//			$.ajax({
//				type: "get",
//				//与后端沟通好用get还是post
//				dataType: "json",
//				url: 'http://47.93.190.186:8080/getTimeSlots.do',
//				//与后端沟通好发送的地址
//				cache: false,
////				headers: {
////							'x-key': window.sessionStorage.getItem('adminId'),
////							'x-token': window.sessionStorage.getItem('token')
////				},
//				beforeSend: function(xhr) {
//					xhr.setRequestHeader('x-key', window.sessionStorage.getItem('adminId'));
//					xhr.setRequestHeader('x-token', window.sessionStorage.getItem('token'));
//				},
//				success: function(data) {
//					console.log(data);
//
//				},
//				error: function(err) {
//					console.log(err)
//				}
//			});
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
	
	.add {
		float: right;
		margin: 20px;
	}
</style>