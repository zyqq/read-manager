<template>
	<div>
		<el-form ref="form" name='form' :model="form" label-width="80px">
			<el-form-item label="问题">
				<el-input v-model="form.question"></el-input>
			</el-form-item>
			<el-form-item label="答案">
				<el-input v-model="form.answer"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit()">新增</el-button>
				<el-button @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>		
		<el-table :data="helpData" style="width: 100%">
			<el-table-column prop="qandaId" label="id">
			</el-table-column>
			<el-table-column prop="question" label="问题">
			</el-table-column>
			<el-table-column prop="answer" label="答案">
			</el-table-column>
			<el-table-column prop="helpfulCnt" label="帮助量">
			</el-table-column>
			<el-table-column prop="pushDate" label="发布时间" align="center" width="160">
			</el-table-column>
			<el-table-column prop="isDelete" label="是否删除">
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, helpData)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'ManageHelp',
		data() {
			return {
				activityList: [],
				form: {
					question: '',
					answer: ''
				},
				helpData: []
			}
		},
		methods: {
			handleDelete(index, row) {
				var _this = this;
				console.log(row[index])
				var params = new URLSearchParams();
				params.append('helpId', row[index].qandaId);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/deleteHelp.do',
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
			onSubmit() {
				var _this = this;
				var params = new URLSearchParams();
				params.append('question', this.form.question);
				params.append('answer', this.form.answer);
				axios({
						method: 'post',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/addHelp.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						data: params
					})
					.then(function(response) {
						if(response.data.statusCode == 102) {
							_this.getHelps();
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err);
						alert("请检查网络连接");
					});
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
			getHelps(){
				var _this = this;
				
				axios({
						method: 'get',
						dataType: 'json',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key': window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						},
						url: 'http://47.93.190.186:8080/getHelps.do'
					})
					.then(function(response) {
						console.log(response);
						if(response.data.statusCode == 102) {
							_this.helpData = [];
							var responseData = response.data.helps;
							for(var i = 0; i < responseData.length; i++) {
								responseData[i].pushDate = _this.timestampToTime(responseData[i].pushDate);
								_this.helpData.push(responseData[i]);
							}
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
			this.getHelps();
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