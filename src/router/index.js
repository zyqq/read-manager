import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import xuanxian from '@/components/xuanxian'
// 用户协议
import UserProtocol from '@/components/UserProtocol/UserProtocol'
//关于社团
import Carousel from '@/components/aboutOrg/Carousel'
import ManagePush from '@/components/aboutOrg/ManagePush'
// 审核预约数据
import ManageOrder from '@/components/checkOrder/ManageOrder'
//维护数据库
import AddBook from '@/components/manageData/AddBook'
import ManageBook from '@/components/manageData/ManageBook'
import SearchShareBook from '@/components/manageData/SearchShareBook'
import ManageGoodBooks from '@/components/manageData/ManageGoodBooks'
import ManageBookComment from '@/components/manageData/ManageBookComment'
import ManageGoodBookComment from '@/components/manageData/ManageGoodBookComment'
import ManageVote from '@/components/manageData/ManageVote'
import SearchBook from '@/components/manageData/SearchBook'

//意见反馈与帮助
import ManageHelp from '@/components/feedbacksAndHelp/ManageHelp'
import CheckFeedbacks from '@/components/feedbacksAndHelp/CheckFeedbacks'
import CheckReports from '@/components/feedbacksAndHelp/CheckReports'

//社区
import ManageWishBook from '@/components/community/ManageWishBook'

// 管理预约时间段
import ManageTimeSlot from '@/components/ManageTimeSlot/ManageTimeSlot'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/hello',
			name: 'HelloWorld',
			component: HelloWorld
		},
		{
			path: '/xuanxian',
			name: 'xuanxian',
			component: xuanxian
		},
		// 用户协议
		
		{
			path: '/UserProtocol',
			name: 'UserProtocol',
			component: UserProtocol
		},
		// 关于社团
		
		{
			path: '/Carousel',
			name: 'Carousel',
			component: Carousel
		},
		{
			path: '/ManagePush',
			name: 'ManagePush',
			component: ManagePush
		},
		//审核预约数据
		
		{
			path: '/ManageOrder',
			name: 'ManageOrder',
			component: ManageOrder
		},
		//维护数据库

		{
			path: '/AddBook',
			name: 'AddBook',
			component: AddBook
		},
		{
			path: '/ManageBook',
			name: 'ManageBook',
			component: ManageBook
		},
		{
			path: '/SearchShareBook',
			name: 'SearchShareBook',
			component: SearchShareBook
		},
		{
			path: '/ManageGoodBooks',
			name: 'ManageGoodBooks',
			component: ManageGoodBooks
		},
		{
			path: '/ManageBookComment',
			name: 'ManageBookComment',
			component: ManageBookComment
		},
		{
			path: '/ManageGoodBookComment',
			name: 'ManageGoodBookComment',
			component: ManageGoodBookComment
		},
		{
			path: '/ManageVote',
			name: 'ManageVote',
			component: ManageVote
		},
		{
			path: '/SearchBook',
			name: 'SearchBook',
			component: SearchBook
		},
		
		//意见反馈与帮助
		{
			path: '/ManageHelp',
			name: 'ManageHelp',
			component: ManageHelp
		},
		{
			path: '/CheckFeedbacks',
			name: 'CheckFeedbacks',
			component: CheckFeedbacks
		},
		{
			path: '/CheckReports',
			name: 'CheckReports',
			component: CheckReports
		},
		//社区
		{
			path: '/ManageWishBook',
			name: 'ManageWishBook',
			component: ManageWishBook
		},
		
		
		// 管理预约时间段
		
		{
			path: '/ManageTimeSlot',
			name: 'ManageTimeSlot',
			component: ManageTimeSlot
		}
	]
})