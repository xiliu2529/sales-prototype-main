import React, {Component} from 'react';
import { connect, Dispatch } from 'umi';
import {AutoComplete, message, Tooltip} from 'antd';
import '@/utils/messageConfig';
import styles from './index.less';
import {
  AllCustomerType,
  CustomerOptionType, CustomerType,
  OptionType
} from "@/pages/FormAdvancedForm/data";
import {CaseType} from "@/pages/FormAdvancedForm/components/EditRunningCases/data";
import {formatMessage} from "@@/plugin-locale/localeExports";


export interface CustomerInfoProps {
  dispatch:Dispatch;
  customerLst: CustomerType[];
  allCustomerLst: AllCustomerType[];
  caseLst: CaseType[];
  cstmrCd: string;
  cstmrNm: string;
  index: number;
  itemNm: string;
  checkLength: number;
  caseFlag: string;
  styleFlag: string;
  handleCustomer:any,
  disabled:boolean,
  onInputKeyDown:any,
  id: string;
  bottom:boolean,
}

interface CustomerInfoStates {
  cstmrCd: string;
  cstmrNm: string;
}

let selectFlag= false;
let inputFlag = true;
let customerOriginValue='';

class CustomerInfo extends Component<CustomerInfoProps,CustomerInfoStates> {

  constructor(props: Readonly<CustomerInfoProps>) {
    super(props);
    this.state = {
      cstmrCd: this.props.cstmrCd,
      cstmrNm: this.props.cstmrNm,
    }
  }

  componentDidMount() {
    inputFlag = true;
    this.setState({
      cstmrCd: this.props.cstmrCd,
      cstmrNm: this.props.cstmrNm,
    });
    // @ts-ignore
    this.props.onRef('CustomerInfo',this)
  }

  clearCustomer= () => {
    // selectFlag= false;
    // inputFlag = true;
    // customerOriginValue='';
    this.setState({
      cstmrCd: '',
      cstmrNm: '',
    });
  }


  onCustomerSelectChange= (e:any) => {
    selectFlag = true;
    inputFlag = false;

    if (this.props.allCustomerLst !== null) {
      const customerSelect = this.props.customerLst.filter((item)=>item.cstmrNm === e.toString());
      this.setState({
        cstmrCd:customerSelect[0].cstmrCd,
        cstmrNm: e.toString(),
      });
      this.props.handleCustomer(customerSelect[0].cstmrCd, e.toString(), '', this.props.index);
    }

  }

  onCustomerFocusChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e!==undefined && e.target.value.toString() !== '') {
      customerOriginValue =e.target.value.toString();
    }
  }

  onCustomerBlurChange= (e: React.ChangeEvent<HTMLInputElement>) => {
      let paramCd= '';
      let paramNm = '';
      let paramCaseNo = '';
      if (e!==undefined && e.target.value.toString() !== '' ) {
        if ( customerOriginValue !== e.target.value.toString()) {
          if (this.props.allCustomerLst !== null) {
            let customrList = this.props.allCustomerLst;
            customrList = customrList.filter((item) => (item.cstmrNmDft && item.cstmrNmDft.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrNmCn && item.cstmrNmCn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrNmEn && item.cstmrNmEn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrNmFra && item.cstmrNmFra.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrNmJp && item.cstmrNmJp.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrShrtNmCn && item.cstmrShrtNmCn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrShrtNmEn && item.cstmrShrtNmEn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrShrtNmFra && item.cstmrShrtNmFra.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
              || (item.cstmrShrtNmJp && item.cstmrShrtNmJp.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1));
            if (customrList !== undefined && customrList !== null && customrList.length === 1) {
              selectFlag = false;
              const {cstmrCd} = customrList[0];
              paramCd = cstmrCd.toString();
              const cstmrNms = this.props.customerLst.filter((item) => item.cstmrCd === cstmrCd);
              if (cstmrNms && cstmrNms.length > 0) {
                paramNm = cstmrNms[0].cstmrNm;
              }

              if (this.props.caseFlag === "0") {
                if (this.props.caseLst !== undefined && this.props.caseLst !== null && this.props.caseLst.cd !== undefined && this.props.caseLst.cd !== null) {
                  const caseOptionsParam: OptionType[] = [];
                  this.props.caseLst.cd.forEach((item) => {
                    if (item.caseNm !== null && item.caseNm !== '' && item.cstmrCd.toString() === cstmrCd.toString()) {
                      const optionItem: OptionType = {
                        value: item.caseNm,
                      };
                      caseOptionsParam.push(optionItem);
                    }
                  });

                  if (caseOptionsParam.length === 1) {
                    paramCaseNo = caseOptionsParam[0].value;
                  } else {
                    paramCaseNo = '';
                  }
                } else {
                  paramCaseNo = '';
                }
              }
            } else if (customrList !== undefined && customrList !== null && (selectFlag || inputFlag) && customrList.length > 0) {
              selectFlag = false;
              customrList = customrList.filter((item) => (item.cstmrNmDft && item.cstmrNmDft.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrNmCn && item.cstmrNmCn.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrNmEn && item.cstmrNmEn.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrNmFra && item.cstmrNmFra.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrNmJp && item.cstmrNmJp.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrShrtNmCn && item.cstmrShrtNmCn.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrShrtNmEn && item.cstmrShrtNmEn.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrShrtNmFra && item.cstmrShrtNmFra.toUpperCase() === (e.target.value.toString().toUpperCase().toString()))
                || (item.cstmrShrtNmJp && item.cstmrShrtNmJp.toUpperCase() === (e.target.value.toString().toUpperCase().toString())));
              if (customrList !== undefined && customrList !== null && customrList.length === 1) {
                const {cstmrCd} = customrList[0];
                paramCd = cstmrCd.toString();
                const cstmrNms = this.props.customerLst.filter((item) => item.cstmrCd === cstmrCd);
                if (cstmrNms && cstmrNms.length > 0) {
                  paramNm = cstmrNms[0].cstmrNm;
                }
                if (this.props.caseFlag === "0") {
                  if (this.props.caseLst !== undefined && this.props.caseLst !== null && this.props.caseLst.cd !== undefined && this.props.caseLst.cd !== null) {
                    const caseOptionsParam: OptionType[] = [];
                    this.props.caseLst.cd.forEach((item) => {
                      if (item.caseNm !== null && item.caseNm !== '' && item.cstmrCd.toString() === cstmrCd.toString()) {
                        const optionItem: OptionType = {
                          value: item.caseNm,
                        };
                        caseOptionsParam.push(optionItem);
                      }
                    });

                    if (caseOptionsParam.length === 1) {
                      paramCaseNo = caseOptionsParam[0].value;
                    } else {
                      paramCaseNo = '';
                    }
                  } else {
                    paramCaseNo = '';
                  }
                }
              } else {
              paramCd = 'undefined';
              paramNm = e.target.value.toString();
              paramCaseNo = '';
            }
            } else {
              paramCd = 'undefined';
              paramNm = e.target.value.toString();
              paramCaseNo = '';
            }
          } else {
            paramCd = 'undefined';
            paramNm = e.target.value.toString();
            paramCaseNo = '';
          }
          this.props.handleCustomer(paramCd, paramNm, paramCaseNo, this.props.index);
        }else{
          paramCd = 'undefined';
          paramNm=  e.target.value.toString();
          paramCaseNo ='';
        }
      }else{
        paramCd = 'undefined';
        paramNm= '';
        paramCaseNo ='';
      }
      this.setState({
        cstmrCd: paramCd,
        cstmrNm: paramNm,
      });
  }


  customerChange = (e: string) => {
      let paramCd= '';
      let paramNm = '';
      let paramCaseNo = '';
      selectFlag = false;
      inputFlag = false;
      if (e!==undefined && e.toString() !== '') {
        if (this.props.checkLength && e.length > this.props.checkLength) {
          const errorInfo = formatMessage({id: 'common.message.inputMessage'}).replace('%1',this.props.itemNm);
          message.error(errorInfo.replace('%2',this.props.checkLength));
          return
        }
        paramCd = 'undefined';
        paramNm= e.toString();
      }else{
        paramCd = 'undefined';
        paramNm= '';
        paramCaseNo ='';
        this.props.handleCustomer(paramCd,paramNm,paramCaseNo,this.props.index);
      }
      this.setState({
        cstmrCd: paramCd,
        cstmrNm: paramNm,
      });
  };

  render() {
    const {customerLst,allCustomerLst} = this.props;

    // option Valueを取得
    const customerOptions: CustomerOptionType[] = [];
      if (customerLst !== null && customerLst.length > 0) {
        customerLst.forEach((item) => {
          if (item.cstmrNm !== null && item.cstmrNm !== '') {
            let tooltips = item.cstmrNm;
            if (allCustomerLst !== null && allCustomerLst.length > 0) {
              const titleInfo = allCustomerLst.filter((allItem) => allItem.cstmrCd.toString() === item.cstmrCd.toString());
              if (titleInfo && titleInfo.length > 0) {
                tooltips = titleInfo[0].cstmrNm;
              }
            }
            const optionItem: CustomerOptionType = {
              lable: item.cstmrNm,
              value: item.cstmrNm,
              key: item.cstmrCd.toString(),
              title: tooltips,
            };
            customerOptions.push(optionItem);
          }
        });
      } else {
        const optionItem: CustomerOptionType = {
          lable: '',
          value: '',
          key: '',
          title: '',
        };
        customerOptions.push(optionItem);
      }
      let styleName = styles.select;
      if(this.props.styleFlag === '1'){
        styleName = styles.activitiesSearchItem;
      }
      if(this.props.styleFlag === '2'){
      styleName = styles.messageSearchItem;
      }

 // @ts-ignore
    return (
      // <Tooltip title={this.state.cstmrNm} mouseLeaveDelay={0}  color='#FFFFFF'>
      <AutoComplete
        autoFocus={this.props.bottom}
        id={this.props.id}
        disabled={this.props.disabled}
        className={styleName}
        // autoFocus
        // dropdownMatchSelectWidth={280}
        defaultValue={this.state.cstmrNm}
        value={this.state.cstmrNm}
        onChange={(e) => this.customerChange(e)}
        onSelect={(e) => this.onCustomerSelectChange(e)}
        // @ts-ignore
        onBlur={(e) => this.onCustomerBlurChange(e)}
        onFocus={(e) => this.onCustomerFocusChange(e)}
        allowClear
        options={customerOptions}
        onInputKeyDown={this.props.onInputKeyDown}
        filterOption={(inputValue, option) => {
            if (allCustomerLst !== null && allCustomerLst !== undefined) {
              const allCstrInfo = allCustomerLst.filter((item) => (item.cstmrNmDft && item.cstmrNmDft.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrNmCn && item.cstmrNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrNmEn && item.cstmrNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrNmFra && item.cstmrNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrNmJp && item.cstmrNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrShrtNmCn && item.cstmrShrtNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrShrtNmEn && item.cstmrShrtNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrShrtNmFra && item.cstmrShrtNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
                || (item.cstmrShrtNmJp && item.cstmrShrtNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1));
              if (allCstrInfo && allCstrInfo.length > 0 && option) {
                const cstmrcds = allCstrInfo.filter((item) => (item.cstmrCd !== null && item.cstmrCd.toString() === option.key));
                if (cstmrcds && cstmrcds.length > 0) {
                  return true;
                }
              }
            }
            return false;
          }
        }
      />
      // </Tooltip>
    );
}
}
export default connect(
// eslint-disable-next-line no-empty-pattern
({
}: {
}) => ({
}),
)(CustomerInfo)


