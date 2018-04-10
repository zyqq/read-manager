<template id="app">
	<div>
		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<el-menu-item index="1"><router-link to="/UserProtocol" class="router">用户协议</router-link></el-menu-item>
			<el-submenu index="2">
				<template slot="title">关于社团</template>
				<el-menu-item index="2-1"><router-link to="/Carousel" class="router">管理轮播图</router-link></el-menu-item>
				<el-menu-item index="2-2"><router-link to="/ManagePush" class="router">管理推送</router-link></el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title">审核预约数据</template>
				<el-menu-item index="3-1"><router-link to="/ManageOrder" class="router">管理预约数据</router-link></el-menu-item>
			</el-submenu>
			<!--<el-menu-item index="4">
				<a href="https://www.ele.me" target="_blank">创建【帮助】</a>
			</el-menu-item>-->
			<el-submenu index="5">
				<template slot="title">意见反馈与帮助</template>
				<el-menu-item index="5-1"><router-link to="/CheckFeedbacks" class="router">查看意见反馈</router-link></el-menu-item>
				<el-menu-item index="5-2"><router-link to="/CheckReports" class="router">查看举报</router-link></el-menu-item>
				<el-menu-item index="5-3"><router-link to="/ManageHelp" class="router">管理帮助项</router-link></el-menu-item>
			</el-submenu>
			<el-submenu index="6">
				<template slot="title">维护书库</template>
				<el-menu-item index="6-1"><router-link to="/AddBook" class="router">添加新书</router-link></el-menu-item>
				<el-menu-item index="6-2"><router-link to="/ManageBook" class="router">管理书库</router-link></el-menu-item>
				<el-menu-item index="6-3"><router-link to="/SearchShareBook" class="router">管理分享书籍</router-link></el-menu-item>
				<el-menu-item index="6-4"><router-link to="/ManageGoodBooks" class="router">管理好书</router-link></el-menu-item>
				<el-menu-item index="6-5"><router-link to="/ManageBookComment" class="router">管理书评</router-link></el-menu-item>
				<el-menu-item index="6-6"><router-link to="/ManageGoodBookComment" class="router">管理精彩书评</router-link></el-menu-item>
				<el-menu-item index="6-7"><router-link to="/ManageVote" class="router">管理投票</router-link></el-menu-item>
				<el-menu-item index="6-8"><router-link to="/SearchBook" class="router">搜索图书</router-link></el-menu-item>
			</el-submenu>

			<el-submenu index="7">
				<template slot="title">【社区】</template>
				<el-menu-item index="7-1"><router-link to="/ManageWishBook" class="router">管理愿望书单</router-link></el-menu-item>
			</el-submenu>
			<el-menu-item index="4"><router-link to="/ManageTimeSlot" class="router">管理预约时间地点</router-link></el-menu-item>
			<el-menu-item v-if="!isLogin" index="8" @click="showLogin = true">
				登录
			</el-menu-item>
			<el-menu-item v-else index="8" @click="logout">
				退出登录
			</el-menu-item>
		</el-menu>

		<el-dialog :before-close="handleClose" title="登录" :visible.sync="showLogin">
			<el-form :rules="rules" :model="validateForm" ref="validateForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="帐号" prop="account">
					<el-input type="account" v-model.account="validateForm.account" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model.password="validateForm.password" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showLogin = false">取 消</el-button>
				<el-button type="primary" @click="login('validateForm')">登 录</el-button>
			</div>
		</el-dialog>
		
    <router-view/>
		
	</div>
</template>
<script>
	import axios from 'axios'

	export default {
		name: 'App',
		data() {
			return {
				activeIndex: '1',
				showLogin: false,
				isLogin: window.sessionStorage.getItem('isLogin')=='true'?true:false,
				validateForm: {
					account: '',
					password: ''
				},
				rules: {
					account: [{
						required: true,
						message: '请选择',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请选择',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			},
			login(formName) {
				var _this = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var params = new URLSearchParams();
						params.append('username', this.validateForm.account);
						params.append('password', this.validateForm.password);
						axios({
								method: 'post',
								dataType: 'json',
								url: 'http://47.93.190.186:8080/admin/login.do',
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								data: params
							})
							.then(function(response) {
								console.log(response);
								if(response.data.statusCode == 4005) {
									alert(response.data.message);
								} else if(response.data.statusCode == 102) {
									window.sessionStorage.setItem('adminId', response.data.result.adminId)
									window.sessionStorage.setItem('token', response.data.result.token)
									window.sessionStorage.setItem('isLogin', true)
									_this.isLogin = true;
									_this.showLogin = false;
								} else {
									alert(response.data.message);
								}
							}).catch(function(err) {
								console.log(err);
								alert("请检查网络连接");
							});

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			logout(formName) {
				var _this = this;
				axios({
						method: 'get',
						dataType: 'json',
						url: 'http://47.93.190.186:8080/logout.do',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'x-key':  window.sessionStorage.getItem('adminId'),
							'x-token': window.sessionStorage.getItem('token')
						}
					})
					.then(function(response) {
						console.log(response);
						if(response.data.statusCode == 4005) {
							alert(response.data.message);
						} else if(response.data.statusCode == 102) {
							_this.isLogin = false;
							window.sessionStorage.setItem('isLogin', false)
							
							alert("成功退出登录");
						} else {
							alert(response.data.message);
						}
					}).catch(function(err) {
						console.log(err);
						alert("请检查网络连接");
					});
			},
			handleClose(done) {
				done();
			}
		},
		mounted(){
			console.log(this.isLogin);
		}
	}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.router{
	display: inline-block;
	width: 100%;
	height: 100%;
	color: inherit;
	text-decoration: none;
}
	.el-pagination {
		padding: 25px 5px;
		text-align: center;
	}
	.el-menu--horizontal{
		margin-bottom: 40px;
	}
</style>
