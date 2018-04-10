<template>
	<div>
		<el-button @click="phoneDialog = true" style="float:right;margin-top: 20px;">手机号查找</el-button>
		<el-tabs v-model="activeName" @tab-click="handleClick" style="clear: both;">
			<el-tab-pane label="待交接" name="0">
				<el-table :data="shareData" style="width: 100%">
					<el-table-column prop="userId" label="分享者id">
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="proposedDate" label="分享日期" width="160" align="center">
					</el-table-column>
					<el-table-column prop="delieverWay" label="交接方式">
					</el-table-column>
					<el-table-column prop="location" label="上门领书地点">
					</el-table-column>
					</el-table-column>
					<el-table-column align='center' label="操作" width='250'>
						<template slot-scope="scope">
							<el-button size="mini" @click="pass(scope.$index, shareData)">通过</el-button>
							<el-button size="mini" @click="rejectDialog = true">取消</el-button>

							<el-dialog title="取消理由" :visible.sync="rejectDialog">
								<el-form>
									<el-form-item label="取消理由">
										<el-input placeholder="请填写不通过的理由" v-model="rejectReason" auto-complete="off"></el-input>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="rejectDialog = false">取 消</el-button>
									<el-button type="primary" @click="cancel(scope.$index, shareData)">确 定</el-button>
								</div>
							</el-dialog>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="已取消" name="1">
				<el-table :data="shareData" style="width: 100%">
					<el-table-column prop="userId" label="分享者id">
					</el-table-column>
					<el-table-column prop="phone" align="center" width="140" label="手机号">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="proposedDate" width="160" align="center" label="分享日期">
					</el-table-column>
					<el-table-column prop="delieverWay" label="交接方式">
					</el-table-column>
					<el-table-column prop="location" label="上门领书地点">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="已入库" name="2">
				<el-table :data="shareData" style="width: 100%">
					<el-table-column prop="userId" label="分享者id">
					</el-table-column>
					<el-table-column prop="phone" label="手机号" width="140" align="center">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="proposedDate" label="分享日期" align="center" width="160">
					</el-table-column>
					<el-table-column prop="delieverWay" label="交接方式">
					</el-table-column>
					<el-table-column prop="location" label="上门领书地点">
					</el-table-column>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="danger" @click="handleDelete(scope.$index, shareData)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="待交书" name="3">
				<el-table :data="shareData" style="width: 100%">
					<el-table-column prop="userId" label="分享者id">
					</el-table-column>
					<el-table-column prop="phone" label="手机号" align="center" width="140">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="proposedDate" label="分享日期" align="center" width="160">
					</el-table-column>
					<el-table-column prop="delieverWay" label="交接方式">
					</el-table-column>
					<el-table-column prop="location" label="上门领书地点">
					</el-table-column>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-form ref="form" :name='shareData[scope.$index].shareId'>
								<el-form-item label="">
									<el-upload list-type="picture" :on-change="onChange" :auto-upload="false" :before-upload="beforeUpload" :on-error="uploadError" :on-success="uploadSuccess" name="image" class="upload-demo" action='#' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="activityList">
										<el-tooltip content="请上传以.png.jpg.jpeg为后缀的图片(只限一个，多次上传会覆盖)" placement="top" effect="light">
											<el-button size="small" type="primary">上传图片</el-button>
										</el-tooltip>
									</el-upload>
								</el-form-item>
								<el-form-item>
									<el-input placeholder="图书isbn" v-model="shareData[scope.$index].bookId"></el-input>
								</el-form-item>
								<el-button size="mini" @click="addShareBook(scope.$index, shareData, shareData[scope.$index].shareId)">入库</el-button>
							</el-form>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
		</el-pagination>
		<el-dialog title="手机号查找用户分享书籍" :visible.sync="phoneDialog">
			<el-form>
				<el-form-item label="手机号">
					<el-input placeholder="请填写用户手机号来查找其分享书" v-model="phone" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="phoneDialog = false">取 消</el-button>
				<el-button type="primary" @click="searchShareBookByPhone()">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import axios from 'axios'
	import $ from 'jquery'

	export default {
		name: 'SearchShareBook',
		data() {
			return {
				phone: '',
				state: '',
				activeName: '0',
				shareData: [],
				activityList: [],
				rejectReason: '',
				// 取消理由弹窗
				rejectDialog: false,
				// 填写手机号弹窗
				phoneDialog: false,
				currentPage4: 1,
				pageSize: 10,
				startNum: 0,
				totalSize: 0,
				// 是否按电话查找
				isByPhone: false
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				if(this.isByPhone){
					this.searchShareBookByPhone(this.startNum, this.pageSize);					
					
				}else{
					this.searchShareBookByState(this.activeName, this.startNum, this.pageSize);					
				}
				
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.startNum = (val-1)*this.pageSize;
				if(this.isByPhone){
					this.searchShareBookByPhone(this.startNum, this.pageSize);					
					
				}else{
					this.searchShareBookByState(this.activeName, this.startNum, this.pageSize);					
				}
			},
			handleClick(tab, event) {
				console.log(tab.name);
				this.startNum = 0;
				this.currentPage4 = 1;
				if(!this.isByPhone){
					this.searchShareBookByState(tab.name)					
				}
				this.isByPhone = false;
			},
			onChange(file, fileList) {
				console.log(fileList);
			},
			beforeUpload(file) {
				console.log(file)
			},
			handleRemove(file, fileList) {

			},
			handlePreview(file) {
				console.log(file);
			},
			uploadSuccess(res, files, fileList) {
				if(res.status == 4007) {
					this.$message.warning(res.msg + ",请重传以.doc或.docx为后缀的文件/以.png、.jpg、.jpeg为后缀的图片");
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
				var m = myData.getMinutes() + ':';
				var s = myData.getSeconds();
				return Y + M + D + h + m + s;
			},
			addShareBook(index, row, shareId) {
				var formData = $("form[name="+shareId+"]");
				console.log(formData)
				var data = new FormData(formData[0]);
				data.append('name', row[index].name);
				data.append('author', row[index].author);
				data.append('pubHouse', row[index].pubHouse);
				data.append('isbn', row[index].bookId);
				data.append('description', row[index].description);
				data.append('shareId', row[index].shareId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/addShareBook.do',
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
							row.splice(index, 1);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err);
						alert("请检查网络连接");
					});

			},
			pass(index, row) {
				var params = new URLSearchParams();
				params.append('shareId', this.shareData[index].shareId);
				params.append('result', 0);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/checkShares.do',
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
			cancel(index, row) {
				console.log(index, row);
				var _this = this;
				var params = new URLSearchParams();
				params.append('shareId', this.shareData[index].shareId);
				params.append('result', 1);
				params.append('reason', this.rejectReason);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/checkShares.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.rejectDialog = false;
						if(response.data.statusCode == 102) {
							row.splice(index, 1);
							_this.rejectReason = '';
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			},
			handleDelete(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('isbn', row[index].bookId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteBook.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							alert(response.data.message);
//							row.splice(index, 1);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			},
			searchShareBookByPhone(startNum=0, page=100000) {
				this.isByPhone = true;
				$('#tab-3').click();
				this.shareData.length=0;
				var _this = this;
				var params = new URLSearchParams();
				params.append('phone', this.phone);
				params.append('start_num', startNum);
				params.append('page_size', page);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/searhShareBookByPhone.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.phoneDialog = false;
						
						if(_this.shareData.length == 0){
						if(response.data.statusCode == 102) {
							var responseData = response.data.result;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].delieverWay = responseData[i].delieverWay == 0 ? '分享者拿书过来' : '社团自取分享书';
								responseData[i].proposedDate = _this.timestampToTime(responseData[i].proposedDate);
								_this.shareData.push(responseData[i]);
							}
							// 第一次加载tab页并且在第一页时先获取全部数据再获取第一页数据
							if(page == 100000 && _this.startNum == 0){
								_this.totalSize = _this.shareData.length; 
								_this.shareData.length = 0;
								_this.searchShareBookByPhone(_this.startNum, _this.pageSize)				
							}
							console.log(_this.shareData)
						} else {
							alert(response.data.message);
						}}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			},

			searchShareBookByState(tab, startNum=0, page=100000) {
				this.shareData = [];
				var _this = this;
				this.isByPhone = false;
				var params = new URLSearchParams();
				params.append('state', tab);
				params.append('start_num', startNum);
				params.append('page_size', page);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/searhUserShareBook.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						console.log(response)
						if(response.data.statusCode == 102) {
							var responseData = response.data.result;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].delieverWay = responseData[i].delieverWay == 0 ? '分享者拿书过来' : '社团自取分享书';
								responseData[i].proposedDate = _this.timestampToTime(responseData[i].proposedDate);
								_this.shareData.push(responseData[i])
							}
							// 第一次加载tab页并且在第一页时先获取全部数据再获取第一页数据
							if(page == 100000 && _this.startNum == 0){
								_this.totalSize = _this.shareData.length; 
								_this.searchShareBookByState(_this.activeName, _this.startNum, _this.pageSize)				
							}
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err)
						alert("请检查网络连接");
					});
			}
		},
		mounted() {
			this.searchShareBookByState(0);
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