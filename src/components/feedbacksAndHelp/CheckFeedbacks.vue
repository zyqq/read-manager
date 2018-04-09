<template>
	<div>
		<el-table :data="feedbacksData" style="width: 100%">
			<el-table-column label="封面">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>反馈 id: {{ scope.row.feedbackId }}</p>
						<div slot="reference" class="name-wrapper">
							<img width="50px" height="50px" :src="scope.row.printscreen" />
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="userId" label="反馈者id">
			</el-table-column>
			<el-table-column prop="title" label="标题">
			</el-table-column>
			<el-table-column prop="detail" label="反馈内容">
			</el-table-column>
			<el-table-column prop="proposedDate" label="反馈日期" align="center" width="165">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="showReply(scope.$index)">回复</el-button>
					<el-dialog title="回复意见反馈" :visible.sync="replyDialog">
						<el-form>
							<el-form-item label="回复内容">
								<el-input placeholder="请填写" v-model="feedbackResult" auto-complete="off"></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="replyDialog = false">取 消</el-button>
							<el-button type="primary" @click="reply(selectIndex, feedbacksData)">确 定</el-button>
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
		name: 'CheckFeedbacks',
		data() {
			return {
				activityList: [],
				feedbacksData: [],
				activeName: 'feedback',
				feedbackResult: '',
				selectIndex: 0,
				replyDialog: false,
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
			showReply(index) {
				this.selectIndex = index;
				this.replyDialog = true;
			},
			reply(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('feedbackId', row[index].feedbackId);
				params.append('userId', row[index].userId);
				params.append('feedbackResult', this.feedbackResult);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/dealFeedback.do',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						_this.replyDialog = false;
						if(response.data.statusCode == 102) {

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
			getFeedbacks(currentPage = 1) {
				var _this = this;
				var params = new URLSearchParams();
				params.append('currentPage', currentPage);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/getFeedbackList.do',
						data: params
					})
					.then(function(response) {
						console.log(response);
						if(response.data.statusCode == 102) {
							_this.feedbacksData = [];
							var responseData = response.data.result.pageData;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].printscreen = 'http://47.93.190.186:8080' + responseData[i].printscreen;
								responseData[i].proposedDate = _this.timestampToTime(responseData[i].proposedDate);
								_this.feedbacksData.push(responseData[i]);
							}
							_this.pageSize = response.data.result.pageCount;
							_this.totalSize = response.data.result.totalCount;
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
			this.getFeedbacks();
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