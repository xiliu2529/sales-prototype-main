import {AnalysisData, BudgetOrHistDataList, CustOrEndUserDataList, GaugeDataList} from './data.d';

// Gauge Mock Data
const gaugeDataMiddle =[{value: 120, name: 'Percent Complete\n2020' ,weather:'Sunny'}]

const gaugeDataLeft = [{value: 40, name: 'Jan~Sept',weather:'Cloudy',judge:'after'}]

const gaugeDataRight = [{value: 200, name: 'September',weather:'Showers'}]

const titleName = "Ritatsu Soft"

const rankOrder  = [
 {
    caseIndstyNm:'securities',
    caseIndstyCd:'order',
    amount:'1,260,320',
    percent:'100%',
    caseIndstyLogoNm:'@/assets/sunny.png',
    totalRankPercent:'20',
    value1: 70, value2: 30,value3:40,value4:50,
  }
]

const rankUnofficial  = [
  {
    caseIndstyNm:'finance',
    caseIndstyCd:'preorder',
    amount:'483,470',
    percent:'90%',
    caseIndstyLogoNm:'@/assets/sunny.png',
    totalRankPercent:'20',
    value1: 70, value2: 24, value3:63,value4:50,
  }
]
const rankAtoD  = [
  {
    caseIndstyNm:'industry',
    caseIndstyCd:'A~D',
    amount:'1,260,320',
    percent:'50%',
    caseIndstyLogoNm:'@/assets/sunny.png',
    totalRankPercent:'20',
    value1: 70, value2: 24, value3:63,value4:50,
  }
]

// MonthlyPerformance Mock data
const monthlyPerformance = [
  { key:'1',
    name:'Budget',
    value: [141830,144730,142735,153900,153070,173925,138630,147920,147935,130950,134990,140735]
  },
  {
    key:'2',
    name:'Sales',
    value: [150750,138503,107206,166124,170030,176603,137004,126600,160300,149000,147412,155779]
  }
]

// MonthlyPerformanceLine Mock data
const monthlyPerformanceLine = [
  { key:'1',
    name:'Budget',
    value: [0,141830,286560,429295,583195,736265,910190,1048820,1196740,1344675,1475625,1610615,1751350]
  },
  {
    key:'2',
    name:'Sales',
    value: [0,155750,294253,401459,567583,737613,914216,1051220,1177820,1338120,1487120,1634532,1790311]
  }
]

// HistoricalComparison Mock data
const historicalComparison = [
  { key:'1',
    name:'2018',
    value:  [112379,129298,163619,134660,135194,136012,117171,156217,129895,113233,124182,140787]
  },
  {
    key:'2',
    name:'2019',
    value: [139075,138929,162321,155801,151000,142745,143002,154903,154962,172984,185073,199923]
  },
  {
    key:'3',
    name:'2020',
    value: [150750,138503,107206,166124,170030,176603,137004,126600,160300,149000,147412,155779]
  }
]

// HistoricalComparisonLine Mock data
const historicalComparisonLine = [
  { key:'1',
    name:'2018',
    value:  [0,112379,241677,405296,539956,675150,811162,928333,1084550,1214445,1327678,1451860,1592647]
  },
  {
    key:'2',
    name:'2019',
    value: [0,139075,278004,440325,596126,747126,889871,1032873,1187776,1342738,1515722,1700795,1900718]
  },
  {
    key:'3',
    name:'2020',
    value: [0,250750,389253,596459,762583,932613,1109216,1246220,1372820,1533120,1682120,1829532,1985311]
  }
]

// Pie Mock Data
const customerData = [
  {value:685672,name:'NRI'},
  {value:247792,name:'SRA'},
  {value:156983,name:'DAIFUKU'},
  {value:289765,name:'CUBE'},
  {value:48695,name:'Other'}
]

// CustomerBar Mock Data
const endUserData = [
  {value:585800,name:'NRI'},
  {value:405600,name:'SRA'},
  {value:341000,name:'DAIFUKU'},
  {value:253591,name:'CUBE'},
  {value:118320,name:'MINGLAMP'}
]

// customer Ranking Mock Data
const customerRanking = [
  {
    key: 1,
    name: 'NRI',
    sales: '585800',
    man_month:'1100.10',
  },
  {
    key: 2,
    name: 'SRA',
    sales: '405600',
    man_month:'762.20',
  },
  {
    key: 3,
    name: 'DAIFUKU',
    sales: '341000',
    man_month:'640.30',
  },
  {
    key: 4,
    name: 'CUBE',
    sales: '253591',
    man_month:'476.40',
  },
  {
    key: 5,
    name: 'MINGLAMP',
    sales: '109000',
    man_month:'205.50',
  },
  {
    key: 6,
    name: 'TOYOTA',
    sales: '90320',
    man_month:'169.60',
  },
  {
    key: 7,
    name: 'aaa',
    sales: '90320',
    man_month:'169.60',
  },
  {
    key: 8,
    name: 'bb',
    sales: '90320',
    man_month:'169.60',
  }
]

// customer Ranking Left Mock Data
const customerRankingLeft = [
  {
    key: '1',
    title: 'NRI',
  },
  {
    key: '2',
    title: 'SRA',
  },
  {
    key: '3',
    title: 'DAIFUKU',
  },
  {
    key: '4',
    title: 'CUBE',
  },
  {
    key: '5',
    title: 'MINGLAMP',
  },
  {
    key: '6',
    title: 'TOYOTA',
  },
]

// customer Ranking Right Mock Data
const customerRankingRight = ['1','2','3','4','5']


// endUser Ranking Mock Data
const endUserRanking = [
  {
    key: 1,
    name: 'NRI',
    sales: '585800',
    man_month:'1100.10',
  },
  {
    key: 2,
    name: 'SRA',
    sales: '405600',
    man_month:'762.20',
  },
  {
    key: 3,
    name: 'DAIFUKU',
    sales: '341000',
    man_month:'640.30',
  },
  {
    key: 4,
    name: 'CUBE',
    sales: '253591',
    man_month:'476.40',
  },
  {
    key: 5,
    name: 'aaa',
    sales: '90320',
    man_month:'169.60',
  },
  {
    key: 6,
    name: 'bb',
    sales: '90320',
    man_month:'169.60',
  }
]

// customer Ranking Left Mock Data
const endUserRankingLeft = [
  {
    key: '1',
    title: 'NRI',
  },
  {
    key: '2',
    title: 'SRA',
  },
  {
    key: '3',
    title: 'DAIFUKU',
  },
  {
    key: '4',
    title: 'CUBE',
  },
  {
    key: '5',
    title: 'MINGLAMP',
  },
  {
    key: '6',
    title: 'TOYOTA',
  },
  {
    key: '7',
    title: 'sss',
  },
  {
    key: '8',
    title: 'aaa',
  },
  {
    key: '9',
    title: 'bbbb',
  },
]

// customer Ranking Right Mock Data
const endUserRankingRight = ['1','2','3','4','5']

// Main Graph Left Mock Data
 const getMainGraphLeft=[
   {
     key:'1',
     title:'YTD 2020.01~2020.08',
     actualityAmount:'100',
     actualityBudgetAmount:'27081',
     budgetAmount:'2628600',
     percentage:-1.05,
     order:'100',
     preorder:'20',
     avalue:'10',
     bvalue:'20',
     cvalue:'10',
     dvalue:'30',
     orderRigthData:'100',
     preorderRigthData:'90',
     avalueRigthData:'80',
     bvalueRigthData:'60',
     cvalueRigthData:'40',
     dvalueRigthData:'20',
   },
   {
     key:'2',
     title:'Forecast in 2020',
     actualityAmount:'40358',
     actualityBudgetAmount:'48310',
     budgetAmount:'39960',
     percentage:1,
     order:'100',
     preorder:'81',
     a:'10002',
     b:'5000',
     c:'6000',
     d:'10010',
     orderRigthData:'100',
     preorderRigthData:'90',
     aRigthData:'80',
     bRigthData:'60',
     cRigthData:'40',
     dRigthData:'20',
   },
   {
     key:'3',
     title:'Forecast in September',
     actualityAmount:'334',
     actualityBudgetAmount:'2587',
     budgetAmount:'3150',
     percentage:9,
     order:'100',
     preorder:'81',
     a:'64',
     b:'36',
     c:'96',
     d:'40',
     orderRigthData:'100',
     preorderRigthData:'90',
     aRigthData:'80',
     bRigthData:'60',
     cRigthData:'40',
     dRigthData:'20',
   }
 ]

const industryRankingData =[
  {
    key:'1',
    name:'securities',
    rankData:'10000',
  },
  {
    key:'2',
    name:'finance',
    rankData:'9000',
  },
  {
    key:'3',
    name:'industry',
    rankData:'8000',
  },
  {
    key:'4',
    name:'medical',
    rankData:'7000',
  }, {
    key:'5',
    name:'insurance',
    rankData:'6000',
  },
  {
    key:'6',
    name:'public',
    rankData:'5000',
  },
  {
    key:'7',
    name:'circulation',
    rankData:'4000',
  },
  {
    key:'8',
    name:'E-commerce',
    rankData:'3000',
  },
  {
    key:'9',
    name:'Security',
    rankData:'2000',
  },
  {
    key:'10',
    name:'Railway',
    rankData:'1000',
  }
]


// customer Ranking Left Mock Data
const industryRankingLeft = [
  {
    key: '1',
    title: 'NRI',
  },
  {
    key: '2',
    title: 'SRA',
  },
  {
    key: '3',
    title: 'DAIFUKU',
  },
  {
    key: '4',
    title: 'CUBE',
  },
  {
    key: '5',
    title: 'MINGLAMP',
  },
  {
    key: '6',
    title: 'TOYOTA',
  },
  {
    key: '7',
    title: 'qqq',
  },
  {
    key: '8',
    title: 'iii',
  },
   {
    key: '9',
    title: 'qqq',
  },
  {
    key: '10',
    title: 'iii',
  },
  {
    key: '11',
    title: 'qqq',
  },
  {
    key: '12',
    title: 'iii',
  }
]

// customer Ranking Right Mock Data
const industryRankingRight = ['1','2','3','4','5','6','7','8','9','10']


// @ts-ignore
const getSalesData: AnalysisData = {
  rankOrder,
  rankUnofficial,
  rankAtoD,
  industryRankingData,
  industryRankingLeft,
  industryRankingRight,
}

// @ts-ignore
const getTransferData: TransferDataList = {
  industryRankingLeft,
  industryRankingRight,
}

const getGaugeData:GaugeDataList ={
  titleName,
  gaugeDataLeft,
  gaugeDataMiddle,
  gaugeDataRight,
}

const getBudgetOrHistData:BudgetOrHistDataList ={
  monthlyPerformance,
  monthlyPerformanceLine,
  historicalComparison,
  historicalComparisonLine,
}



const getCustOrEndUserData:CustOrEndUserDataList ={
  customerData,
  customerRanking,
  customerRankingLeft,
  customerRankingRight,
  endUserData,
  endUserRanking,
  endUserRankingLeft,
  endUserRankingRight,
}

export default {
  'GET /api/getSalesData': getSalesData,
  'GET /api/getMainGraphLeft': getMainGraphLeft,
  'GET /api/getGaugeData': getGaugeData,
  'GET /api/getBudgetOrHistData':getBudgetOrHistData,
  'GET /api/getCustOrEndUserData':getCustOrEndUserData,
  'GET /api/getIndustryRankingLeft':industryRankingLeft,
  'GET /api/getIndustryRankingRight':industryRankingRight,
};
