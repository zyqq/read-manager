<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="没处理" name="0">
				<el-table :data="wishBookData" style="width: 100%">
					<el-table-column prop="userId" label="用户id">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="wishId" label="愿望id">
					</el-table-column>
					<el-table-column prop="wishDetail" label="愿望描述">
					</el-table-column>
					<el-table-column prop="wishDate" label="许愿日期" align="center" width="165">
					</el-table-column>
					<el-table-column align="center" label="操作" width="160">
						<template slot-scope="scope">
							<el-button size="mini" @click="pass(scope.$index, wishBookData)">入库</el-button>
							<el-button size="mini" type="danger" @click="ignore(scope.$index, wishBookData)">忽略</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="已处理" name="1">
				<el-table :data="wishBookData" style="width: 100%">
					<el-table-column prop="userId" label="用户id">
					</el-table-column>
					<el-table-column prop="bookName" label="书名">
					</el-table-column>
					<el-table-column prop="author" label="作者">
					</el-table-column>
					<el-table-column prop="pubHouse" label="出版社">
					</el-table-column>
					<el-table-column prop="wishId" label="愿望id">
					</el-table-column>
					<el-table-column prop="wishDetail" label="愿望描述">
					</el-table-column>
					<el-table-column prop="wishDate" label="许愿日期" align="center" width="165">
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
		name: 'ManageWishBook',
		data() {
			return {
				activityList: [],
				wishBookData: [],
				activeName: '0',
				feedbackResult: '',
				currentPage: 1,
				totalSize: 0,
				pageSize: 10			}
		},
		methods: {			
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.getBook(val);
			},
			handleClick(tab, event) {
				console.log(tab, event);
				this.getWishBook(1,tab.name);
			},
			ignore(index, row) {			
				var _this = this;
				var params = new URLSearchParams();
				params.append('wishId', row[index].wishId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/ignoreWishBook.do',
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
				var _this = this;
				var params = new URLSearchParams();
				params.append('wishId', row[index].wishId);
				params.append('userId', row[index].userId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/storageWishBook.do',
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
			getWishBook(currentPage = 1, tabName = 0) {
				var _this = this;
				var params = new URLSearchParams();
				params.append('currentPage', currentPage);
				params.append('type', tabName);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getWishBookList.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						console.log(response);
						if(response.data.statusCode == 102) {
							_this.wishBookData = [];
							var responseData = response.data.result.pageData;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].wishDate = _this.timestampToTime(responseData[i].wishDate);
								_this.wishBookData.push(responseData[i]);
							}
							_this.pageSize = response.data.result.pageCount;
							_this.totalSize = response.data.result.totalCount;
							console.log(_this.wishBookData)
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
			}
		},
		mounted() {
			this.getWishBook();		
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