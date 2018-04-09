<template>
	<div>
		<el-form ref="form" name='form' :model="form" label-width="80px">
			<el-form-item label="已存在的书评">
				<el-input v-model="form.postContent"></el-input>
			</el-form-item>
			<el-form-item label="所评论的书名">
				<el-input v-model="form.postBookName"></el-input>
			</el-form-item>
			<el-form-item label="书评作者">
				<el-input v-model="form.postAuthor"></el-input>
			</el-form-item>
			<el-form-item label="书评id">
				<el-input placeholder="新增不用填写，若更新现有精彩书评需填写原书评id" v-model="form.wonderfulPostId"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addGoodComment()">添加/更新</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="bookData" style="width: 100%">
			<el-table-column prop="wonderfulPostId" label="评论id">
			</el-table-column>
			<el-table-column prop="postBookName" label="书名">
			</el-table-column>
			<el-table-column prop="postAuthor" label="评论者">
			</el-table-column>
			<el-table-column prop="postContent" label="评论内容">
			</el-table-column>
			<el-table-column prop="postTime" label="评论时间" align="center" width="160">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
<!--					<el-button size="mini" @click="handleAdd(scope.$index, bookData)">增数</el-button>-->
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, bookData)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
		</el-pagination>

	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'ManageGoodBookComment',
		data() {
			return {
				form: {
					postContent: '',
					postBookName: '',
					postAuthor: '',
					wonderfulPostId: ''
				},
				bookData: [],
				currentPage: 1,
				totalSize: 0,
				pageSize: 10
			}
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
			addGoodComment() {
				var _this = this;
				var params = new URLSearchParams();
				params.append('postContent', this.form.postContent);
				params.append('postBookName', this.form.postBookName);
				params.append('postAuthor', this.form.postAuthor);
				if(this.form.wonderfulPostId!=''){
					params.append('wonderfulPostId', this.form.wonderfulPostId);
				}
				axios({
						method: 'post',
						dataType: 'json',
						url: this.form.wonderfulPostId!=''?'http://47.93.190.186:8080/updateWonderfulPost.do':'http://47.93.190.186:8080/addWonderfulPost.do',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							_this.getBookComment(0, 10);
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						alert("请检查网络连接");
					});
			},
			getBookComment(currentPage = 1) {

				var _this = this;
				var params = new URLSearchParams();
				params.append('currentPage', currentPage);
				axios({
						method: 'post',
						dataType: 'jsonp',
						url: 'http://47.93.190.186:8080/getWonderfulPostList.do',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.bookData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.result.pageData;
							console.log(responseData)
							for(var i = 0; i < responseData.length; i++) {
								console.log(responseData[i].pubDate)
								responseData[i].postTime = _this.timestampToTime(responseData[i].postTime);
								responseData[i].pictures = 'http://47.93.190.186:8080' + responseData[i].pictures;
								_this.bookData.push(responseData[i]);
							}
							_this.pageSize = response.data.result.pageCount;
							_this.totalSize = response.data.result.totalCount;
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
				params.append('wonderfulPostId', row[index].wonderfulPostId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteWonderfulPost.do',
						header: {
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
						header: {
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
			this.getBookComment();
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