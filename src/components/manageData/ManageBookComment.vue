<template>
	<div>
		<el-table :data="bookData" style="width: 100%">
			<el-table-column prop="bookId" label="书isbn">
			</el-table-column>
			<el-table-column label="封面">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<img width="200px" height="200px" :src="scope.row.pictures" />
						<div slot="reference" class="name-wrapper">
							<img width="50px" height="50px" :src="scope.row.pictures" />
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="bookName" label="书名">
			</el-table-column>
			<el-table-column label="书评者">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>评论id: {{ scope.row.commentId }}</p>
						<p>书评者id: {{ scope.row.userId }}</p>
						<div slot="reference" class="name-wrapper">
							{{ scope.row.nickName }}
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="书评标题">
			</el-table-column>
			<el-table-column align='center' prop="content" label="书评内容" width="200">
			</el-table-column>
			<el-table-column prop="commentCnt" label="评论量">
			</el-table-column>
			<el-table-column prop="stars" label="获赞量">
			</el-table-column>
			<!--<el-table-column prop="viewCnt" label="阅读量">
			</el-table-column>-->
			<el-table-column prop="isLegal" label="是否合法">
			</el-table-column>
			<el-table-column prop="pubDate" label="入库时间" align="center" width="160">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" @click="checkComment(scope.$index, bookData)">查看书评详情</el-button>
					<el-dialog :title="'书评标题：'+detailData[0].title" :visible.sync="commentDetail">
						<div class='comments'>
							<div v-for='item in detailData'>
								
								<div class='comment'>
									<div class='cavatar'>
										<img width="50" height="50" :src='item.fromIdPic'></img>
									</div>
									<div class='cdetail'>
										<div class='cinfo'>
											<span class='cname'>{{item.fromName}}</span>
											<span>{{item.commentType==0?'评论:':'回复'}}</span>
											<span class='cname'>{{item.commentType==1?item.atName+':':''}}</span>
											<div class='ccontent'>{{item.ucontent}}</div>
										</div>
										<div class='ctime'>{{item.time}}</div>
									</div>
								</div>
							</div>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button @click="commentDetail = false">确 定</el-button>
						</div>
					</el-dialog>
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
		name: 'ManageBookComment',
		data() {
			return {
				bookData: [],
				currentPage: 1,
				totalSize: 0,
				pageSize: 10,
				commentDetail: false,
				detailData: [{
					title: ''
				}]
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.getBookComment(val);
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
			getBookComment(currentPage = 1) {

				var _this = this;
				var params = new URLSearchParams();
				params.append('currentPage', currentPage);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getPostList.do',
						headers: {
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
								responseData[i].pubDate = _this.timestampToTime(responseData[i].pubDate);
								responseData[i].isLegal = responseData[i].isLegal == true ? '合法' : '非法';
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
			checkComment(index, row) {
				var _this = this;
				console.log(row[index])
				this.commentDetail = true;
				var params = new URLSearchParams();
				params.append('commentId', row[index].commentId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getComments.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.detailData = [];
						if(response.data.statusCode == 102) {
							var responseData = response.data.post.commentList;
							console.log(responseData)
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].time = _this.timestampToTime(responseData[i].time);
								responseData[i].title = row[index].title;
								_this.detailData.push(responseData[i]);
							}
							console.log(_this.detailData)
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
	
	.comments {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		margin-bottom: 120rpx;
	}
	
	.comment {
		display: flex;
		flex-direction: row;
	}
	
	.cavatar image {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		background-color: #f2f2f2;
		margin-right: 20rpx;
	}
	
	.cdetail {
		display: flex;
		flex: 1;
		flex-direction: column;
		border-bottom: 1rpx solid #e5e5e5;
		padding-bottom: 20rpx;
		text-align: left;
	    margin-left: 20px;
	}
	
	.cinfo {
		font-size: 26rpx;
		line-height: 2em;
		color: #666;
	}
	
	.cname {
		color: #268dcd;
	}
	
	.ctime {
		font-size: 22rpx;
		line-height: 2.2em;
		color: #999;
	}
	
	.ccontent {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6em;
		word-break: break-all;
	}
	
	.rbcomments {
		background-color: #f8f8f8;
		margin-top: 10rpx;
		padding-left: 20rpx;
		padding-bottom: 10rpx;
	}
</style>