import React, { Component } from "react";
// @ts-ignore
import { PropTypes } from "prop-types";
// @ts-ignore
import {Upload, message, Icon, Card, Select, Spin} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import XLSX from "xlsx";
import UploadExcel from "@/components/UploadExcel";
import TableUtils from '@/components/UploadExcel/TableUtils';
import {formatMessage} from "@@/plugin-locale/localeExports";
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates
import './style.less';
import {Dispatch, UserModelState} from "@@/plugin-dva/connect";
import {connect} from "@@/plugin-dva/exports";
import {ConnectState} from "@/models/connect";
// eslint-disable-next-line import/no-duplicates
import styles from "./style.less";
import {UploadExcelData, FetchCaseType, FormatNameType} from "./data";
import "@/utils/messageConfig";

const { Dragger } = Upload;
const {Option} = Select;

// 解析excel后得到的header
const excelHeader: { index: React.ReactText; title: any; }[] = [];

// 本地localSchema
let localHeader: { index: React.ReactText; title: any;}[] = [];

// 合并excel、localShema和数据库中的配置后 用于数据对应表头
let jsonDataHeader: { index: React.ReactText; fieldClm:string; title: any;}[] = [];

// 列号和表头对应的map
const headerMapForData = new Map();

// sheet页名称List
let sheetNames: any[] = [];

// json 每一个sheet页的数据
let jsonResultData: any[] = [];

// json 所有sheet页数据
let jsonSheetsData: any[] = [];

// loading...
let searchLoading: boolean = true;

const isExcel = (file: { name: string; }) => {
  return /\.(xlsx|xls|csv)$/.test(file.name);
};

interface TableFormProps {
  dispatch: Dispatch;
  uploadExcel: UploadExcelData;
  user: UserModelState;
}

// システムの現在年取得
const myDate = new Date();
const tMonth = myDate.getMonth();
const tYear = myDate.getFullYear();
// フォーマット年
const nowYear = tMonth+1>=6?tYear+1:tYear;


class UploadExcelIndex extends Component<TableFormProps> {
  static propTypes = {
    uploadSuccess: PropTypes.func.isRequired,
  };

  state = {
    // 本身的状态
    loadingSchema: false,  // 是否正在从远程加载schema
    year:nowYear,
    layCd:'',
    layNm:'',
    init: true,

    fileList: [],
    searchLoading: false,
  };

// @ts-ignore
  changeRightMenu = (parma1: boolean,parma2: boolean,parma3: boolean,parma4: boolean,parma5: boolean,parma6: boolean): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'message/changeRightMenu',
        payload1: {
          parma1,
        },
        payload2: {
          parma2,
        },
        payload3: {
          parma3,
        },
        payload4: {
          parma4,
        },
        payload5: {
          parma5,
        },
        payload6: {
          parma6,
        },
      });
    }
  };

  componentDidMount() {

    const {dispatch} = this.props;

    const language = this.props.user.currentUser?.dspLang;
    const caseYear = nowYear.toString();
    const orgGroupId = this.props.user.currentUser?.orgGroupId;

    // ページの先頭にあるメニューが表示されますか
    // @ts-ignore
    const changeBaseMenuShowState = (payload: boolean): void => {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'global/displayBaseMenuFlag',
          payload
        });
      }
    };

    changeBaseMenuShowState(false);
    this.changeRightMenu(false,false,false,true,false,false);
    // 此处不用 loginUserCd
    const loginUserCd = '';
    const caseParam: FetchCaseType = { language, caseYear, orgGroupId, loginUserCd };

    const caseInfoModel = JSON.stringify(caseParam);
    dispatch({
      type: 'uploadExcel/getFormatNameData',
      payload: {
        caseInfoModel,
      },
    });
  }

  static getDerivedStateFromProps(nextProps: TableFormProps) {
    return {
      searchLoading: nextProps.uploadExcel.setSearchLoading.searchLoading,
    };
  }

  draggerProps = () => {

    // 这个参数用于判断获取schema是同步还是异步
    if (!this.state.loadingSchema) {
      this.setState({loadingSchema: true});
    }
    // eslint-disable-next-line no-underscore-dangle
    const _this = this;

    return {
      name: "file",
      multiple: false,
      accept: ".xlsx, .xls",
      // 限制上传数量一个，始终用最新上传的代替当前。
      onChange(info: { file: { name?: any; status?: any; }; }) {
        _this.setState(({
          fileList: _this.state.fileList.slice(-1),
        }));
      },
      // @ts-ignore
      // eslint-disable-next-line consistent-return,@typescript-eslint/no-unused-vars
      async beforeUpload(file: { name: string; }, fileList: any) {
        if (!isExcel(file)) {
          message.info("?支持上?.xlsx, .xls, .csv 文件");
          return false;
        }

        _this.setState(({
          fileList: _this.state.fileList.concat(fileList),
        }));

        _this.setState({
          searchLoading: true,
        })
        searchLoading = true;
      },
      customRequest(e: { file: any; onSuccess: () => void; }) {
        _this.readerData(e.file).then(() => {
          e.onSuccess();
        });
      },
      onRemove () {
        _this.setState(({
          fileList: [],
        }));
        return true;
      },

    };
    if (this.state.loadingSchema) {
      this.setState({loadingSchema: false});
    }

  };



  // 节点取得共同方法
  // eslint-disable-next-line consistent-return
  getSubHeader = (col:any, fatherTitle: string) =>{

    fatherTitle === '' ? col.title = col.title : col.title = fatherTitle +'.'+col.title;
    const {children} = col;
    if(children !== undefined && children.length>0){
      for(let len = 0; len < children.length; len+=1){
        this.getSubHeader(children[len],col.title);
      }
    }else{
      localHeader.push(col);
    }
  }

  readerData = async(rawFile: Blob) => {

    this.setState({
      init: false,
    })

    if(this.state.layCd === ''){
      message.info(formatMessage({ id: 'uploadExcel.error.message' }));
      this.setState(({
        fileList: [],
        init: true,
      }));
      return false;
    }

    // 从数据库中取得需要的表结构
    const {dispatch} = this.props;

    const language = this.props.user.currentUser?.dspLang;
    const caseYear = this.state.year.toString();
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    const loginUserCd = this.state.layCd;
    const caseParam: FetchCaseType = {language, caseYear, orgGroupId, loginUserCd};

    const caseInfoModel = JSON.stringify(caseParam);
    await dispatch({
      type: 'uploadExcel/getFormatHeaderData',
      payload: {
        caseInfoModel,
      },
    });

    if (this.props.uploadExcel.formatHeaderData === undefined || this.props.uploadExcel.formatHeaderData === null || this.props.uploadExcel.formatHeaderData.length === 0) {
      if(this.state.fileList.length <= 1){
        this.setState(({
          fileList: [],
        }));
        message.info(formatMessage({ id: 'uploadExcel.error.formatHeaderData' }));
      }else{
        // eslint-disable-next-line react/no-access-state-in-setstate
        let fileListBak = this.state.fileList;
        // @ts-ignore
        fileListBak = fileListBak.pop(this.state.fileList.length-1)
        this.setState(({
          fileList: fileListBak,
        }));
      }
      return false;
    }

    await dispatch({
      type: 'uploadExcel/getFormatBudgetData',
      payload: {
        caseInfoModel,
      },
    });

    if (this.props.uploadExcel.formatBudgetData === undefined || this.props.uploadExcel.formatBudgetData === null || this.props.uploadExcel.formatBudgetData.length === 0) {
      if(this.state.fileList.length <= 1){
        this.setState(({
          fileList: [],
        }));
        message.info(formatMessage({ id: 'uploadExcel.error.formatBudgetData' }));
      }else{
        // eslint-disable-next-line react/no-access-state-in-setstate
        let fileListBak = this.state.fileList;
        // @ts-ignore
        fileListBak = fileListBak.pop(this.state.fileList.length-1)
        this.setState(({
          fileList: fileListBak,
        }));
      }
      return false;
    }

    await dispatch({
      type: 'uploadExcel/getSheetUserData',
      payload: {
        caseInfoModel,
      },
    });

    if (this.props.uploadExcel.sheetUserData === undefined || this.props.uploadExcel.sheetUserData === null || this.props.uploadExcel.sheetUserData.length === 0) {
      if(this.state.fileList.length <= 1){
        this.setState(({
          fileList: [],
        }));
        message.info(formatMessage({ id: 'uploadExcel.error.sheetUserData' }));
      }else{
        // eslint-disable-next-line react/no-access-state-in-setstate
        let fileListBak = this.state.fileList;
        // @ts-ignore
        fileListBak = fileListBak.pop(this.state.fileList.length-1)
        this.setState(({
          fileList: fileListBak,
        }));
      }
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      // 取得本地的Schema
      const localSchema = TableUtils.getLocalSchema('excel');
      // 清空本地shema
      localHeader = [];

      // 解析schema (标题结构)
      localSchema.forEach((item: any)=>{
        this.getSubHeader(item,'');
      });


      const reader = new FileReader();
      reader.onload = async(e) => {
        // @ts-ignore
        const data = e.target.result;
        const workbook = XLSX.read(data, {type: "array"});

        // 从第二个sheet页开始解析
        const sheetStart = 2;

        // 清空当前的sheet名称
        sheetNames = [];
        // 清空所有的的sheet数据
        jsonSheetsData = [];

        for (let sheet = sheetStart; sheet < workbook.SheetNames.length; sheet += 1) {

          // 清空当前sheet页数据
          jsonResultData = [];

          const firstSheetName = workbook.SheetNames[sheet];

          const userList =  this.props.uploadExcel.sheetUserData.filter((userItem)=>
            userItem.userNmDeft.replace(' ','').replace('　','') ===
            firstSheetName.replace(' ','').replace('　','')
            ||
            userItem.userNmJp.replace(' ','').replace('　','') ===
            firstSheetName.replace(' ','').replace('　','')
            ||
            userItem.userNmEn.replace(' ','').replace('　','') ===
            firstSheetName.replace(' ','').replace('　','')
            ||
            userItem.userNmCn.replace(' ','').replace('　','') ===
            firstSheetName.replace(' ','').replace('　','')
            ||
            userItem.userNmFra.replace(' ','').replace('　','') ===
            firstSheetName.replace(' ','').replace('　','')
          );

          // 当前解析的sheet页名称存在于数据的场合
          if(userList.length > 0){

            const worksheet = workbook.Sheets[firstSheetName];
            const marges = worksheet["!merges"];

            // 表头的起始行
            const headerStartRow = this.props.uploadExcel.formatHeaderData[0].titSta - 1;

            // 根据表头的列数
            let endCol = 0;  // 数据终止列

            // 已知标题行 动态取得标题的合并的行数 从而得出列分组的行数
            const getHealderMargeRow = marges?.filter((item) => item.s.r === headerStartRow);

            if (getHealderMargeRow === undefined || getHealderMargeRow?.length <= 0) {
              // message.error('Failed to get'+ firstSheetName +'header row');
            } else {

              // 放入当前sheet页名称
              sheetNames.push(firstSheetName.replace(' ','').replace('　',''));

              // 标题行最后一行
              let headerEndRow = 0;

              // 取得总列数
              getHealderMargeRow?.forEach((item) => {
                if (item.e.c > endCol) {
                  endCol = item.e.c;
                }
                if (item.e.r > headerEndRow) {
                  headerEndRow = item.e.r;
                }
              })

              if (marges === undefined || marges.length <= 0) {
                // message.error('Failed to get'+ firstSheetName +'header row');
              } else {

                // 解析表头
                // 当所有sheet页的title一样时 只需解析一次title
                if(excelHeader.length === 0){

                  const margesChoosed = marges.filter((item)=>item.s.r===headerStartRow);
                  const margesSorted = margesChoosed.sort(function(a, b){return a.s.c - b.s.c})

                  let index = 0;
                  // 合并3和4行的数据
                  // const mergedRowData =[];
                  margesSorted.forEach((item)=>{

                    if(item.s.c === item.e.c){

                      const content = worksheet[XLSX.utils.encode_cell({ c: item.s.c, r: item.s.r})].v.replace(/[\r\n]/g,"");

                      const localSchema1 = localSchema.filter((itemData: { title: any; })=>itemData.title === content);
                      let key = '';
                      let disable = true;
                      if(localSchema1.length>0){
                        key = localSchema1[0].key;
                        disable = true;
                      }else{
                        disable = false;
                      }
                      // NO~単価 数据集合
                      const headerModel = {
                        index: index.toString(),
                        key,
                        title: content.replace(',',''),
                        disable,
                      }

                      // 将 列号和title 存入map
                      headerMapForData.set(item.s.c,content.replace(',',''));
                      excelHeader.push(headerModel);
                      index+=1;
                    }
                  })

                  // 子节点开始的列的位置
                  let subStartCol = 0;
                  margesSorted.forEach((item)=>{
                    if(item.s.r === item.e.r){
                      for(let i = item.s.c; i<item.e.c; i+=1){
                        const content = worksheet[XLSX.utils.encode_cell({ c: item.s.c, r: item.s.r})].v.replace(/[\r\n]/g,"");

                        if(content === '1月'){
                          subStartCol = i;
                        }
                        index+=1;
                      }
                    }
                  })

                  // 目前只支持拥有一级或者两级子标题

                  // 取得一级子标题的合并个数
                  let oneSubHeaderNo = 0;
                  const headerMargeList =  marges.filter((firstHeader)=>firstHeader.s.r ===firstHeader.e.r && firstHeader.s.r===headerStartRow);
                  oneSubHeaderNo = headerMargeList[0].e.c - headerMargeList[0].s.c + 1;

                  // 当存在第三次子标题的场合
                  // 取得二级子标题的合并个数
                  let towSubHeaderNo = 0;
                  if(headerEndRow - headerStartRow === 2 ){
                    const headerSubMargeList =  marges.filter((firstHeader)=>firstHeader.s.r ===firstHeader.e.r && firstHeader.s.r===headerStartRow +1);
                    towSubHeaderNo = headerSubMargeList[0].e.c - headerSubMargeList[0].s.c + 1;
                  }

                  // 获取子节点title
                  // to do 目前只实现表头合并两行
                  let subIndex = subStartCol;
                  // 子节点 列
                  // const childSize = 2;  // 当前结合列子节点只有两个
                  for(let j = subStartCol; j<subStartCol+15; j+=1) { // 循环遍历j为结合列的个数
                    // 父节点title
                    const fatherContent = worksheet[XLSX.utils.encode_cell({c: subIndex, r: headerStartRow})].v.replace(/[\r\n]/g,"");
                    for(let k = 0; k < oneSubHeaderNo; k+=1){ // 循环遍历k为一级子节点的位置

                      // 只有一级子标题的场合
                      if(headerEndRow - headerStartRow === 1 ){
                        // 子节点title
                        const subContent = worksheet[XLSX.utils.encode_cell({c: j+k, r: headerStartRow+1})].v.replace(/[\r\n]/g,"");

                        // 子数据表头处理
                        // const {key} = localSchema[j].children[k];
                        // 子数据集合(用于标题)
                        const subHeaderModel = {
                          index: `${j.toString()}_${k.toString()}`,
                          title: fatherContent+'.'+subContent,
                          align: 'right',
                        }
                        excelHeader.push(subHeaderModel);

                        // 将 列号和title 存入map
                        headerMapForData.set(subIndex,fatherContent+'.'+subContent);
                        subIndex+=1;

                        // 存在二级子标题的场合
                      }else if(headerEndRow - headerStartRow === 2 ){

                        for(let l = 0; l < towSubHeaderNo; l+=1) { // 循环遍历k为一级子节点的位置
                          // 子节点title
                          const subContent = worksheet[XLSX.utils.encode_cell({c: j+k+l, r: headerStartRow+2})].v.replace(/[\r\n]/g,"");

                          // 子数据表头处理
                          // const {key} = localSchema[j].children[k];
                          // 子数据集合(用于标题)
                          const subHeaderModel = {
                            index: `${j.toString()}_${k.toString()}`,
                            title: fatherContent+'.'+subContent,
                            align: 'right',
                          }
                          excelHeader.push(subHeaderModel);

                          // 将 列号和title 存入map
                          headerMapForData.set(subIndex,fatherContent+'.'+subContent);
                          subIndex+=1;

                        }
                      }
                    }
                  }

                  // localSchema 与 数据库中的设定合并
                  const result = TableUtils.merge(localHeader,this.props.uploadExcel.formatBudgetData);
                  // 将解析完excel的数据和数据库中的配置合并
                  jsonDataHeader = TableUtils.mergeExcel(excelHeader,result);

                  // 对不需要的excel列进行剔除 即map中的title赋值空串
                  for(let col = 0; col < headerMapForData.size; col+=1){
                    const mapTitle = headerMapForData.get(col);

                    const jsonDataHeaderParam = jsonDataHeader.filter((dataHeaderItem)=>dataHeaderItem.title===mapTitle);
                    if(jsonDataHeaderParam.length === 0){
                      headerMapForData.set(col,'');
                    }
                  }
                }

                // 解析sheet页中的数据

                const startRow = headerEndRow + 1; // 数据起始行
                let endRow = 0;  // 数据终止行
                const rowList:any[]=[]
                // 取得终止行 総合計（Aランク＋Bランク＋Cランク）
                const totalRowList = marges?.filter((item) => item.s.c === 0 );

                const sortedtotalRowList = totalRowList.sort(function(a, b){return a.e.r - b.e.r});

                sortedtotalRowList?.forEach((item) => {
                  if (item.s.r > endRow) {
                    rowList.push(item.s.r);
                  }
                });
                endRow = rowList[rowList.length-2];

                const startCol = 0; // 数据起始列

                // 当存在多个表格时，区分不同表格合并行的数据
                let margeRowNo = 0;
                for (let dataRow = startRow; dataRow <= endRow; dataRow += 1) {
                  const one_Row: any[] = [];
                  const obc_Row = {};

                  // no特殊处理
                  const key = dataRow - headerEndRow;
                  const keyModel = {
                    // 将有数据的列名 作为 dataIndex
                    key: 'key',
                    cellData: key,
                  }
                  one_Row.push(keyModel);

                  // 实际需要列的列号
                  let headerIndex = startCol;

                  for (let dataCol = startCol; dataCol <= endCol; dataCol += 1) {
                    let cell = worksheet[XLSX.utils.encode_cell({c: dataCol, r: dataRow})];

                    if (cell === undefined) {
                      // 当取得的单元格内容为空时，先判断是否是合并行
                      // @ts-ignore
                      // 取得范围内的合并数据
                      // eslint-disable-next-line @typescript-eslint/no-loop-func
                      const fieldMarge = marges.filter((item) => item.s.c === dataCol && item.s.r >= startRow && item.s.r < endRow);

                      if (fieldMarge.length > 0 && fieldMarge.length > margeRowNo) {
                        // 排序
                        const fieldMargeSorted = fieldMarge.sort(function (a, b) {
                          return a.s.r - b.s.r
                        })
                        cell = worksheet[XLSX.utils.encode_cell({
                          c: fieldMargeSorted[margeRowNo].s.c,
                          r: fieldMargeSorted[margeRowNo].s.r
                        })];
                      }
                    }


                    // 当传入的列号返回的title值为空的时候不追加数据
                    const mapTitle = headerMapForData.get(dataCol);
                    if(mapTitle !== ''){
                      const cellModel = {
                        key: jsonDataHeader[headerIndex].fieldClm,
                        cellData: cell !== undefined ? cell.w.replace(' ','') : '',
                      }
                      one_Row.push(cellModel);

                      headerIndex+=1;
                    }
                  }



                  let addFlag = true;
                  // 去除id为空的数据
                  const noCheckLst = one_Row.filter((checkFiled) => checkFiled.key === 'id');
                  // eslint-disable-next-line @typescript-eslint/no-loop-func
                  noCheckLst.forEach((checkItem) => {
                    const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
                    if (checkItem.cellData === undefined || checkItem.cellData === '' || !regPos.test(checkItem.cellData)) {

                      addFlag = false;
                      // 遇到 合并列的 合計 自增一 用于取得下一个表格中的数据
                      margeRowNo += 1;
                    } else {
                      // 将key顺序设置 从0开始
                      one_Row.filter((checkFiled) => checkFiled.key === 'key')[0].cellData = jsonResultData.length;
                      // 将no顺序设置 从1开始
                      one_Row.filter((checkFiled) => checkFiled.key === 'id')[0].cellData = jsonResultData.length + 1;
                    }
                  })

                  // 判断是否显示数据，临时用 売上計上会社 字段的列号判断(从数据库中取得)

                  // 取得必须入力的字段
                  let mustInputValue = 'COUNT_ORG_CD';
                  const filterList = this.props.uploadExcel.formatBudgetData.filter((budgetItem)=>
                    budgetItem.title === this.props.uploadExcel.formatHeaderData[0].effDataTit);
                  if(filterList.length>0){
                    mustInputValue = filterList[0].fieldClm;
                  }

                  // 对必须入力的没有入力的行数 进行去除
                  const getCheckFiled = one_Row.filter((checkFiled) => checkFiled.key === mustInputValue);
                  getCheckFiled.forEach((checkItem) => {
                    if (checkItem.cellData === undefined || checkItem.cellData === '' || checkItem.cellData === 'ー') {
                      addFlag = false;
                    }
                  })

                  /*                  if (addFlag) {
                                      // 对貨幣必须入力的没有入力的行数 进行去除
                                      const getCheckCurrCdFiled = one_Row.filter((checkFiled) => checkFiled.key === 'CURR_CD');
                                      getCheckCurrCdFiled.forEach((checkItem1) => {
                                        if (checkItem1.cellData === undefined || checkItem1.cellData === '' || checkItem1.cellData === 'ー') {
                                          addFlag = false;
                                          message.info(formatMessage({ id: 'uploadExcel.error.currCdMessage' }).replace('currCd','貨幣').replace('sheetNm',firstSheetName).replace('rowNo',(jsonResultData.length+1).toString()));
                                        }
                                      })
                                    } */

                  if (addFlag) {
                    // 将一行数组转换成为 Object
                    one_Row.forEach((item) => {
                      obc_Row[item.key] = item.cellData;
                    })

                    // 读取的数据集合
                    jsonResultData.push(obc_Row);
                  }
                }
              }
            }
            if(jsonResultData.length>0){
              // 分sheet页 存放数据
              jsonSheetsData.push(jsonResultData);
            }
          }
        }

        this.setState({
          searchLoading: false,
        })
        searchLoading = false;
        this.forceUpdate()
        resolve();
      };
      reader.readAsArrayBuffer(rawFile);
    });
  };

  onSelect = async (e: number) => {
    this.setState({
      year:e,
    })

    // 選択した年が変更 フォーマットデータを更新
    const {dispatch} = this.props;
    const language = this.props.user.currentUser?.dspLang;
    const caseYear = e.toString();
    const orgGroupId = this.props.user.currentUser?.orgGroupId;
    // 此处不用 loginUserCd
    const loginUserCd = '';
    const caseParam: FetchCaseType = { language, caseYear, orgGroupId, loginUserCd };

    const caseInfoModel = JSON.stringify(caseParam);
    await dispatch({
      type: 'uploadExcel/getFormatNameData',
      payload: {
        caseInfoModel,
      },
    });
  };

  onFormatSelect = (e: String) => {
    const formatNameLst = this.props.uploadExcel.formatNameData;
    if(formatNameLst.length>0){
      const selData = formatNameLst.filter((item)=>item.layNm===e);
      if(selData.length>0){
        this.setState({
          layCd: selData[0].layCd,
          layNm: e,
        })
      }
    }
  };

  render() {

    const getFormatOption = (list: FormatNameType[]) => {
      if (!list || list.length < 1) {
        return (
          <Option key={0} value={0}>
            {formatMessage({ id: 'common.message.noSelect' })}
          </Option>
        );
      }
      const listBak = list.filter((item)=>item.layNm !== null && item.layNm !== '');

      return listBak.map((item) => (
        <Option key={item.layCd} value={item.layNm}>
          {item.layNm}
        </Option>
      ));
    };

    return (
      <div>
        <Spin spinning={this.state.searchLoading && searchLoading}>
          <div className={styles.TopCard}>
            <Card>
              <div className={styles.uploadExcelTopDiv}>
                <div className={styles.uploadExcelLeftDiv}>
                  {formatMessage({ id: 'uploadExcel.label.year' })}
                  <br/>
                  {formatMessage({ id: 'uploadExcel.label.format' })}
                  <br/>
                </div>

                <div className={styles.uploadExcelRightDiv}>
                  <Select
                    className={styles.select}
                    defaultValue={this.state.year}
                    value={this.state.year}
                    onSelect={(e) => this.onSelect(e)}
                  >
                    <Option value={nowYear-1}>{nowYear-1}</Option>
                    <Option value={nowYear}>{nowYear}</Option>
                    <Option value={nowYear+1}>{nowYear+1}</Option>
                  </Select>
                  <br/>
                  <Select
                    className={styles.formatSelect}
                    value={this.state.layNm}
                    onSelect={(e) => this.onFormatSelect(e)}
                  >
                    {getFormatOption(this.props.uploadExcel.formatNameData)}
                  </Select>
                </div>
                <div className={styles.boxUpload}>
                  <br/>
                  <Dragger {...this.draggerProps()} fileList={this.state.fileList}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      {formatMessage({ id: 'uploadExcel.label.file' })}
                    </p>
                  </Dragger>
                </div>
              </div>
            </Card>
          </div>

          {jsonDataHeader.length>0 && this.state.init === false ? (
            <div>
              <br/>
              <UploadExcel
                tableName ="excel"
                sheetNames={sheetNames}
                headerSchema={jsonDataHeader}
                excelData={jsonSheetsData}
                year={this.state.year}
                orgGroupId={this.props.user.currentUser?.orgGroupId}
                effortUnitCd={this.props.uploadExcel.formatHeaderData[0].effortUnitCd}
                dispatch={this.props.dispatch}
                loginUserCd={this.props.user.currentUser?.userid}
                userList={this.props.uploadExcel.sheetUserData}
                amtRt={this.props.uploadExcel.formatHeaderData[0].amtRt}
                procName={this.props.uploadExcel.formatHeaderData[0].strdPro}
                modelVisible={this.props.uploadExcel.modelVisible.visible}
                message={this.props.uploadExcel.messageData.message}
                loadDataLoading={this.props.uploadExcel.setLoadDataLoading.loadDataLoading}
              />
            </div>
          ):<div />}
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ uploadExcel, user }: { uploadExcel: UploadExcelData; user: ConnectState }) => ({
    uploadExcel,
    user,
  }),
  // @ts-ignore
)(UploadExcelIndex);
