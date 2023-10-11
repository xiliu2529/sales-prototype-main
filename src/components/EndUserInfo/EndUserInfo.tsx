import React, {Component} from 'react';
import { connect, Dispatch } from 'umi';
import {message, AutoComplete, Tooltip, Select} from 'antd';
import {formatMessage} from "@@/plugin-locale/localeExports";
import styles from './index.less';
import {AllEndUserType, CustomerOptionType, EndUserType} from "@/pages/FormAdvancedForm/data";


export interface EndUserInfoProps {
  dispatch:Dispatch;
  endUserLst: EndUserType[];
  allEndUserLst: AllEndUserType[];
  endUserCd: string;
  endUserNm: string;
  index:number;
  itemNm: string;
  checkLength: number;
  styleFlag: string;
  handleEndUser:any,
  disabled:boolean;
  onInputKeyDown:any,
  id: string;
}

interface EndUserInfoStates {
  endUserCd: string;
  endUserNm: string;
}

let selectFlag= false;

class EndUserInfo extends Component<EndUserInfoProps,EndUserInfoStates> {

  constructor(props: Readonly<EndUserInfoProps>) {
    super(props);
    this.state = {
      endUserCd: this.props.endUserCd,
      endUserNm: this.props.endUserNm,
    }
    // this.props.handleEndUser(this.state.endUserCd,this.state.endUserNm);
  }

  componentDidMount() {
    this.setState({
      endUserCd: this.props.endUserCd,
      endUserNm: this.props.endUserNm,
    });
    // @ts-ignore
    this.props.onRef('EndUserInfo',this)
  }

  clearEndUser= () => {
    this.setState({
      endUserCd: '',
      endUserNm: '',
    });
  }


  onEndUserBlurChange= (e: React.ChangeEvent<HTMLInputElement>) => {
    let paramCd= '';
    let paramNm = '';
    if (e!==undefined && e.target.value.toString() !== '') {
      // if (e.target.value.length > 100) {
      //   message.error(formatMessage({id: 'common.message.endUserNmLength'}));
      //   // @ts-ignore
      //   this.props.handleEndUser('',e.target.value.toString(),this.props.index);
      //   return;
      // }
      if (this.props.allEndUserLst !== null) {
        let endUserList = this.props.allEndUserLst;
        endUserList = endUserList.filter((item) => (item.endUserNmDft && item.endUserNmDft.toUpperCase().toString().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserNmCn && item.endUserNmCn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserNmEn && item.endUserNmEn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserNmFra && item.endUserNmFra.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserNmJp && item.endUserNmJp.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserShrtNmCn && item.endUserShrtNmCn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserShrtNmEn && item.endUserShrtNmEn.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserShrtNmFra && item.endUserShrtNmFra.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1)
          || (item.endUserShrtNmJp && item.endUserShrtNmJp.toUpperCase().indexOf(e.target.value.toString().toUpperCase().toString()) !== -1));
        if (endUserList !== undefined && endUserList !== null && endUserList.length === 1) {
          selectFlag = false;
          const {endUserCd} = endUserList[0];
          const cstmrNms = this.props.endUserLst.filter((item) => item.endUserCd === endUserCd);
          if (cstmrNms && cstmrNms.length > 0) {
            paramNm = cstmrNms[0].endUserNm;
          }
          paramCd = endUserCd.toString();
          this.setState({
            endUserCd: paramCd,
            endUserNm: paramNm,
          });

        } else   if (endUserList !== undefined && endUserList !== null && selectFlag && endUserList.length > 0 ) {
          selectFlag = false;
          endUserList = endUserList.filter((item) => (item.endUserNmDft && item.endUserNmDft.toUpperCase().toString()===(e.target.value.toString().toUpperCase().toString()))
            || (item.endUserNmCn && item.endUserNmCn.toUpperCase()===(e.target.value.toString().toUpperCase().toString()))
            || (item.endUserNmEn && item.endUserNmEn.toUpperCase()===(e.target.value.toString().toUpperCase().toString()))
            || (item.endUserNmFra && item.endUserNmFra.toUpperCase()===(e.target.value.toString().toUpperCase().toString()) )
            || (item.endUserNmJp && item.endUserNmJp.toUpperCase()===(e.target.value.toString().toUpperCase().toString()) )
            || (item.endUserShrtNmCn && item.endUserShrtNmCn.toUpperCase()===(e.target.value.toString().toUpperCase().toString()) )
            || (item.endUserShrtNmEn && item.endUserShrtNmEn.toUpperCase()===(e.target.value.toString().toUpperCase().toString()) )
            || (item.endUserShrtNmFra && item.endUserShrtNmFra.toUpperCase()===(e.target.value.toString().toUpperCase().toString()) )
            || (item.endUserShrtNmJp && item.endUserShrtNmJp.toUpperCase()===(e.target.value.toString().toUpperCase().toString())));
          if (endUserList !== undefined && endUserList !== null && endUserList.length === 1) {
            const {endUserCd} = endUserList[0];
            const cstmrNms = this.props.endUserLst.filter((item) => item.endUserCd === endUserCd);
            if (cstmrNms && cstmrNms.length > 0) {
              paramNm = cstmrNms[0].endUserNm;
            }
            paramCd = endUserCd.toString();
            this.setState({
              endUserCd: paramCd,
              endUserNm: paramNm,
            });
          }

        } else {
          this.setState({
            endUserCd: '',
            endUserNm: e.target.value.toString(),
          });
          paramCd = '';
          paramNm= e.target.value.toString();
        }
      } else {
        this.setState({
          endUserCd: '',
          endUserNm: '',
        });
        paramCd = '';
        paramNm= '';
      }
      // @ts-ignore
      this.props.handleEndUser(paramCd,paramNm,this.props.index);
    } else {
      this.setState({
        endUserCd: '',
        endUserNm: '',
      });
      paramCd = '';
      paramNm= '';
    }
  }

  onEndUserSelectChange = (e) => {
    selectFlag = true;
    let paramCd= '';
    let paramNm = '';
    if (e!==undefined && e.toString() !== '') {
      paramCd = 'undefined';
      paramNm= e.toString();
    }
    this.props.handleEndUser(paramCd,paramNm,this.props.index);
    this.setState({
      endUserCd: paramCd,
      endUserNm: paramNm,
    });
  }

  endUserChange = (e: string) => {
    let paramCd= '';
    let paramNm = '';
    selectFlag = false;
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
      this.props.handleEndUser(paramCd,paramNm,this.props.index);
    }
    this.setState({
      endUserCd: paramCd,
      endUserNm: paramNm,
    });
  };

  render() {
    const {endUserLst,allEndUserLst} = this.props;

  // 获取optionValue
    const endUserOptions: CustomerOptionType[] = [];
    if(endUserLst!==null && endUserLst.length>0){
      endUserLst.forEach((item) => {
        if (item.endUserNm !== null && item.endUserNm !== '') {
          let tooltips =item.endUserNm;
          if(allEndUserLst!== null && allEndUserLst.length>0){
            const titleInfo = allEndUserLst.filter((allItem)=>allItem.endUserCd.toString() === item.endUserCd.toString());
            if(titleInfo && titleInfo.length>0){
              tooltips = titleInfo[0].endUserNm;
            }
          }
          const optionItem: CustomerOptionType = {
            lable: item.endUserNm,
            value: item.endUserNm,
            key: item.endUserCd.toString(),
            title: tooltips,
          };
          endUserOptions.push(optionItem);
        }
      });
    }else{
      const optionItem: CustomerOptionType = {
        value: '',
        lable: '',
        key: '',
        title: '',
      };
      endUserOptions.push(optionItem);
    }

    let styleName = styles.select;
    if(this.props.styleFlag === '1'){
      styleName = styles.activitiesSearchItem;
    }

 // @ts-ignore
    return (
      // <Tooltip title={this.state.endUserNm} mouseLeaveDelay={0}  color='#FFFFFF'>
      <AutoComplete
        id={this.props.id}
        className={styleName}
        disabled={this.props.disabled}
        // onChange={(e) => this.endUserChange(e)}
        // @ts-ignore
        onSelect={(e) => this.onEndUserSelectChange(e)}
        onChange={(e) => this.endUserChange(e)}
        // @ts-ignore
        onBlur={(e) => this.onEndUserBlurChange(e)}
        value={this.state.endUserNm}
        allowClear
        options={endUserOptions}
        onInputKeyDown={this.props.onInputKeyDown}
        filterOption={(inputValue, option) =>{
          // @ts-ignore
          if (allEndUserLst !== null && allEndUserLst !== undefined) {
            const allEndUserInfo = allEndUserLst.filter((item) => (item.endUserNmDft && item.endUserNmDft.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserNmCn && item.endUserNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserNmEn && item.endUserNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserNmFra && item.endUserNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserNmJp && item.endUserNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserShrtNmCn && item.endUserShrtNmCn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserShrtNmEn && item.endUserShrtNmEn.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserShrtNmFra && item.endUserShrtNmFra.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1)
              || (item.endUserShrtNmJp && item.endUserShrtNmJp.toUpperCase().indexOf(inputValue.toUpperCase().toString()) !== -1));
            if (allEndUserInfo && allEndUserInfo.length > 0 && option) {
              const endUsercds = allEndUserInfo.filter((item) => (item.endUserCd!==null && item.endUserCd.toString()=== option.key));
              if(endUsercds && endUsercds.length > 0){
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
)(EndUserInfo)


