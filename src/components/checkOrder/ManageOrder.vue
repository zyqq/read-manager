<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick" style="clear: both;">
			<el-tab-pane label="待审核" name="0">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
					<el-table-column align='center' label="操作" width='250'>
						<template slot-scope="scope">
							<el-button size="mini" @click="pass(scope.$index, orderData)">通过</el-button>
							<el-button size="mini" @click="showReject(scope.$index)">拒绝</el-button>
							<!--daigai-->
							<el-dialog title="拒绝理由" :visible.sync="rejectDialog">
								<el-form>
									<el-form-item label="拒绝理由">
										<el-input placeholder="请填写不通过的理由" v-model="rejectReason" auto-complete="off"></el-input>
									</el-form-item>
								</el-form>
								<div slot="footer" class="dialog-footer">
									<el-button @click="rejectDialog = false">取 消</el-button>
									<el-button type="primary" @click="cancel(selectIndex, orderData)">确 定</el-button>
								</div>
							</el-dialog>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="待领取" name="1">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
					<el-table-column align='center' label="操作" width='250'>
						<template slot-scope="scope">
							<el-button size="mini" @click="received(scope.$index, orderData)">已领取</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="未通过" name="2">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="待归还" name="3">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="deadline" label="预订归还日期" width="165" align="center">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
					<el-table-column align='center' label="操作" width='250'>
						<template slot-scope="scope">
							<el-button size="mini" @click="returnBook(scope.$index, orderData)">确认归还</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="已超期" name="4">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					<el-table-column prop="deadline" label="预订归还日期" width="165" align="center">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="已归还" name="5">
				<el-table :data="orderData" style="width: 100%">
					<el-table-column prop="reservationId" label="订单id">
					</el-table-column>
					<el-table-column label="封面">
						<template slot-scope="scope">
							<img width="200px" height="200px" :src="scope.row.rbBook.bookImg" />
							
							<div slot="reference" class="name-wrapper">
								<img width="50px" height="50px" :src="scope.row.rbBook.bookImg"/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="预约书名">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>书id: {{ scope.row.rbBook.isbn }}</p>
								<p>作者: {{ scope.row.rbBook.author }}</p>
								<p>出版社: {{ scope.row.rbBook.pubHouse }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbBook.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="预约者">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>用户id: {{ scope.row.userId }}</p>
								<p>学号: {{ scope.row.rbUser.stuNum }}</p>
								<p>学院: {{ scope.row.rbUser.college }}</p>
								<div slot="reference" class="name-wrapper">
									{{ scope.row.rbUser.name }}
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="phone" label="手机号" width="140">
					</el-table-column>
					</el-table-column>
					<el-table-column prop="deadline" label="预订归还日期" width="165" align="center">
					</el-table-column>
					<el-table-column prop="returnDate" label="归还日期" width="165" align="center">
					</el-table-column>
					<el-table-column prop="takenDate" label="领取日期" width="165" align="center">
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
		</el-pagination>
	</div>

</template>

<script>
	import axios from 'axios'
	import $ from 'jquery'

	export default {
		name: 'ManageOrder',
		data() {
			return {
				state: '',
				activeName: '0',
				orderData: [],
				activityList: [],
				rejectReason: '',
				// 取消理由弹窗
				rejectDialog: false,
				currentPage: 1,
				totalSize: 0,
				pageSize: 10,
				selectIndex: 0
			}
		},
		methods: {
			showReject(index){
				this.selectIndex = index;
				this.rejectDialog = true;
			},
			fitOrderState(orderState) {
				var state = '';
				switch(orderState) {
					case 0:
						state = "待审核"
						break;
					case 1:
						state = "待领取"
						break;
					case 2:
						state = "审核失败"
						break;
					case 3:
						state = "待归还"
						break;
					case 4:
						state = "已超期"
						break;
					case 5:
						state = "已归还"
						break;
				}
				return state;
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.getBook(val);
			},
			handleClick(tab, event) {
				console.log(tab.name);
				this.getOrders(tab.name)
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
				var m = myData.getMinutes() + ':';
				var s = myData.getSeconds();
				return Y + M + D + h + m + s;
			},
			addShareBook(index, row, shareId) {
				var formData = $("form[name=" + shareId + "]");
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
							row.splice(index, 1);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err);
						alert("请检查网络连接");
					});

			},
			received(index, row) {
				var params = new URLSearchParams();
				params.append('reservationId', row[index].reservationId);
				params.append('userId', row[index].userId);
				params.append('bookId', row[index].bookId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/reservationBookReceive.do',
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
			pass(index, row) {
				var params = new URLSearchParams();
				params.append('reservationId', row[index].reservationId);
				params.append('result', 0);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/check.do',
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
				params.append('reservationId', row[index].reservationId);
				params.append('result', 1);
				params.append('reason', this.rejectReason);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/check.do',
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
			returnBook(index, row) {
				var params = new URLSearchParams();
				params.append('reservationId', row[index].reservationId);
				params.append('userId', row[index].userId);
				params.append('bookId', row[index].bookId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/reservationBookReturn.do',
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
			getOrders(tab, currentPage = 1) {
				var _this = this;
				this.isByPhone = false;
				var params = new URLSearchParams();
				params.append('randby', tab);
				params.append('currentPage', currentPage);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getReservationList.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.orderData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.result.pageData;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].rbBook.bookImg =  'http://47.93.190.186:8080' + responseData[i].rbBook.bookImg;
								responseData[i].takenDate = _this.timestampToTime(responseData[i].takenDate);
								responseData[i].deadline = _this.timestampToTime(responseData[i].deadline);
								responseData[i].returnDate = _this.timestampToTime(responseData[i].returnDate);
								responseData[i].state = _this.fitOrderState(responseData[i].state);
								_this.orderData.push(responseData[i])
							}
							_this.pageSize = response.data.result.pageCount;
							_this.totalSize = response.data.result.totalCount;
							console.log(_this.orderData)
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
			this.getOrders(0);
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