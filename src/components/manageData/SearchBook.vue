<template>
	<div>
		<div style="text-align: center;">
			<el-input style='width: 50%;' placeholder='请填写想要搜索的书名、作者、出版社' v-model="searchKey"></el-input>
			<el-button @click="getBook()">搜索</el-button>			
		</div>
		
		<el-table :data="bookData" style="width: 100%">
			<el-table-column prop="isbn" label="书isbn">
			</el-table-column>
			<el-table-column label="封面">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>{{ scope.row.name }}</p>
						<img width="200px" height="200px" :src="scope.row.bookImg" />
						
						<div slot="reference" class="name-wrapper">
							<img width="50px" height="50px" :src="scope.row.bookImg" />
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="provider" label="提供者">
			</el-table-column>
			<el-table-column prop="name" label="书名">
			</el-table-column>
			<el-table-column prop="author" label="作者">
			</el-table-column>
			<el-table-column prop="pubHouse" label="出版社">
			</el-table-column>
			<el-table-column prop="pubDate" label="入库时间" align="center" width="160">
			</el-table-column>
			<el-table-column label="图书评分">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>评分人数: {{ scope.row.scoreCnt }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.score }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="votes" label="投票数">
			</el-table-column>
			<el-table-column prop="commentCnt" label="评论数">
			</el-table-column>
			<el-table-column prop="readCnt" label="阅读量">
			</el-table-column>
			<el-table-column prop="stock" label="库存">
			</el-table-column>
			<el-table-column prop="description" label="书籍简述">
			</el-table-column>
			<!--<el-table-column prop="tags" label="图书类型">
					</el-table-column>-->
			<el-table-column label="库存（含详细信息）">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>评论量: {{ scope.row.commentCnt }}</p>
						<p>借阅量: {{ scope.row.readCnt }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.stock }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<!--<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleAdd(scope.$index, bookData)">增数</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, bookData)">减数</el-button>
				</template>
			</el-table-column>-->
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
		</el-pagination>

	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'SearchBook',
		data() {
			return {
				bookData: [],
				currentPage: 1,
				totalSize: 0,
				pageSize: 10,
				searchKey: '',
				startNum: 0,
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.getBook(this.startNum, this.pageSize);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.startNum = (val - 1) * this.pageSize;
				this.getBook(this.startNum, this.pageSize);
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
			getBook(start_num = 0, page_size = 1000) {

				var _this = this;
				var params = new URLSearchParams();
				params.append('key', this.searchKey);
				params.append('start_num', start_num);
				params.append('page_size', page_size);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/searchBook.do',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.bookData = [];
						if(response.data.statusCode == 100) {
							var responseData = response.data.result;
							console.log(responseData)
							for(var i = 0; i < responseData.length; i++) {
								console.log(responseData[i].pubDate)
								responseData[i].pubDate = _this.timestampToTime(responseData[i].pubDate);
								responseData[i].bookImg = 'http://47.93.190.186:8080' + responseData[i].bookImg;
								_this.bookData.push(responseData[i]);
								
							}
							// 第一次加载tab页并且在第一页时先获取全部数据再获取第一页数据
							if(page_size == 100000 && _this.startNum == 0) {
								_this.totalSize = _this.bookData.length;
								_this.bookData.length = 0;
								_this.getBook(_this.startNum, _this.pageSize)
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
				params.append('isbn', row[index].isbn);
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
							row[index].stock--;
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