export interface PieData {
  name:string;
  value:number;
}
export interface GaugeData {
  name:string;
  value:number;
  weather:string;
}

export interface RankOrder {
  caseIndstyNm:string;
  caseIndstyCd:string;
  amount:string;
  percent:string;
  caseIndstyLogoNm:string;
  totalRankAmount:string;
}

export interface MonthlyPerformance {
  key:string;
  name: string;
  value: number[];
}

export interface CustomerRanking {
  key:number;
  name: string;
  sales: string;
  man_month: string;
}

export interface CustomerRankingLeft {
  key:string;
  title: string;
}
export interface MainGraphLeft {
  map: any;
  key:string;
  title:string;
  actualityAmount:string;
  actualityBudgetAmount:string;
  budgetAmount:string;
  percentage:string;
  order:string,
  preorder:string,
  a:string,
  b:string,
  c:string,
  d:string,
  orderRigthData:string,
  preorderRigthData:string
  aRigthData:string,
  bRigthData:string,
  cRigthData:string,
  dRigthData:string,
}

export interface IndustryRankingData {
    key:string,
    name:string,
    rankData:string,
  }

export interface HomeRankOrderModel {
  loginUserCd:string,
  dspYear: string,
  dspCurrCd: string,
  language:string,
  userCd:string[];
  userOrgCd:string[],
  userOrgDiv:string,
  typeNm:string,
  typedDivi:string,
  disMonth:string,

  authOrgCds?:string;
  oncust:boolean;
  //   顧客・組織
}

export interface  HomeRankSettingModel {
  userCd:string,
  dspYear: string,
  type:string,
  homeRankOrderList:[],
  homePageRightDownRankList:[],
  rightData:[],
}


export interface AnalysisData {
  rankOrder: RankOrder[];
  rankUnofficial: RankOrder[];
  rankAtoD: RankOrder[];
  industryRankingData:IndustryRankingData[];
  industryRankingLeft:CustomerRankingLeft[];
  industryRankingRight:string[];
}

// @ts-ignore
export interface TransferDataList  {
  industryRankingLeft:CustomerRankingLeft[];
  industryRankingRight:CustomerRankingLeft[];
}

export interface GaugeDataList{
  titleName:string;
  gaugeDataLeft: GaugeData[];
  gaugeDataMiddle: GaugeData[];
  gaugeDataRight: GaugeData[];
}

export interface BudgetOrHistDataList{
  monthlyPerformance: MonthlyPerformance[];
  monthlyPerformanceLine: MonthlyPerformance[];
  historicalComparison: MonthlyPerformance[];
  historicalComparisonLine: MonthlyPerformance[];
}

export interface CustOrEndUserDataList{
  customerData:PieData[];
  customerRanking: CustomerRanking[];
  customerRankingLeft: CustomerRankingLeft[],
  customerRankingRight: string[],
  endUserData:PieData[],
  endUserRanking: CustomerRanking[];
  endUserRankingLeft: CustomerRankingLeft[];
  endUserRankingRight:string[];
}
