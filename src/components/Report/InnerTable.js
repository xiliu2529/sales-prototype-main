import React from 'react';
import {Table, notification, Card, Col,} from 'antd';
import {formatMessage} from "@@/plugin-locale/localeExports";
import Logger from './Logger';
import InnerTableSchemaUtils from './InnerTableSchemaUtils';
import InnerTableRenderUtils from './InnerTableRenderUtils';
import TableUtils from './TableUtils';
import styles from './style.less';

const logger = Logger.getLogger('InnerTable');


/**
 * 内部表格组件
 */
class InnerTable extends React.PureComponent {

  /**
   * 组件初次挂载时parse schema
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.parseTableSchema(this.props,"");
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    logger.debug('receive new props and try to render, nextProps=%o', nextProps);
    // 之前因为antd的Form组件搞了一些黑盒操作, 表单每输入一次都会触发这个方法, 现在表单独立成一个组件了, 应该好了

    // 只有表名变化时才需要重新parse schema
      logger.debug('tableName changed and try to refresh schema');
      // to do 是否需要本地schema
      this.parseTableSchema(nextProps,"");
      this.formComponent = undefined;  // 这个别忘了, 如果schema变了, 表单当然也要变
  }


  /**
   * 解析表格的schema
   */
  parseTableSchema(props,index,index1) {
    const {tableName, schema,sumData,procedureDiv} = props;

    // 取得本地的Schema
    let localSchema;
    let resultSchema;

      if(index ==="" || index ===undefined){
        return;
      }

      let mNumber= 0;
      if( props.data.length !== 0 ){
        if(schema[index].length !== 0){
          schema[index].some((itemInfo) => {

        if(mNumber === index1){
          resultSchema = itemInfo;
          return true;
        }
            mNumber+=1;
          }
        )
        }
      }


    const parseResult = InnerTableSchemaUtils.getTableSchema(resultSchema,index);

    this.primaryKey = parseResult.primaryKey;
    // fieldMap是对原始的dataSchema做了一些处理, 方便查询用的
    this.fieldMap = parseResult.fieldMap;

      this.tableSchema = InnerTableRenderUtils.bindRender1(parseResult.tableSchema, tableName, this, props);


  }



  /**
   * 显示错误信息
   * @param errorMsg
   */
  error=(errorMsg)=> {
    // 对于错误信息, 要很明显的提示用户, 这个通知框要用户手动关闭
    notification.error({
      message: '出错啦!',
      description: `请联系管理员, 错误信息: ${errorMsg}`,
      duration: 0,
    });
  }

common =(datainfo1,scrollBar,screenHeight,itemIndex1,propsInfo, datainfo2,tableBottom,xHeight,itemIndex2)=>{
  let i =-1;
  let j=-1;
    return(
      <div>
      { datainfo1 !== null && datainfo1 !== "" && datainfo1.length !== 0 ?
          scrollBar !== null && scrollBar !== "" && scrollBar.length !==0 && xHeight > 50 ?
            itemIndex1 * 23 > screenHeight ?
                  <div style={{height:`${screenHeight.toString()}px`,overflowY:"scroll"}}>
                    {
                      datainfo1.map((item) => (
                          (<div>
                              {this.parseTableSchema(propsInfo, 1, i += 1)}
                              <Table
                                className={styles.innerTable2}
                                dataSource={item}
                                columns={this.tableSchema}
                                showHeader={false}
                                pagination={false}
                                fixed={false}
                                tableLayout='fixed'
                              />
                            </div>
                          )
                        )
                      )
                    }
                  </div>
                    :
                    <div  style={{overflowY:"scroll"}}>
                      {
                        datainfo1.map((item) => (
                            (<div>
                                {this.parseTableSchema(this.props, 1, i += 1)}
                                <Table
                                  className={styles.innerTable2}
                                  dataSource={item}
                                  columns={this.tableSchema}
                                  showHeader={false}
                                  pagination={false}
                                  tableLayout='fixed'
                                  fixed={false}
                                />
                              </div>
                            )
                          )
                        )
                      }
                    </div>
                  :
                  <div >
                    {
                      datainfo1.map((item) => (
                          (<div>
                              {this.parseTableSchema(propsInfo, 1, i += 1)}
                              <Table
                                className={styles.innerTable2}
                                dataSource={item}
                                columns={this.tableSchema}
                                showHeader={false}
                                pagination={false}
                                fixed={false}
                                tableLayout='fixed'
                              />
                            </div>
                          )
                        )
                      )
                    }
                  </div>
          :<div style={{height:`${screenHeight.toString()}px`,overflowY:"scroll"}}>
            <center  className={styles.noData}>{formatMessage({id: 'component.report.noData'})}</center>
          </div>
      }
  {datainfo2!== null && datainfo2 !== "" && datainfo2.length !== 0 ?
    scrollBar !== null && scrollBar !== "" && scrollBar.length !==0 && xHeight > 50 ?
       itemIndex2 * 23 > tableBottom ?
             <div style={{height:`${tableBottom.toString()}px`,overflowY:"scroll"}}>
              {
                datainfo2.map((item) => (
                    (<div>
                        {this.parseTableSchema(propsInfo, 2, j += 1)}
                        <Table
                          className={styles.innerTable2}
                          dataSource={item}
                          columns={this.tableSchema}
                          showHeader={false}
                          pagination={false}
                          tableLayout='fixed'
                          fixed={false}
                        />
                      </div>
                    )
                  )
                )
              }
            </div>
                 :
                 <div style={{overflowY:"scroll"}}>
                   {
                     datainfo2.map((item) => (
                         (<div>
                             {this.parseTableSchema(propsInfo, 2, j += 1)}
                             <Table
                               className={styles.innerTable2}
                               dataSource={item}
                               columns={this.tableSchema}
                               showHeader={false}
                               pagination={false}
                               tableLayout='fixed'
                               fixed={false}
                             />
                           </div>
                         )
                       )
                     )
                   }
                 </div>
            : <div>
              {
                datainfo2.map((item) => (
                    (<div>
                        {this.parseTableSchema(propsInfo, 2, j += 1)}
                        <Table
                          className={styles.innerTable2}
                          dataSource={item}
                          columns={this.tableSchema}
                          showHeader={false}
                          pagination={false}
                          tableLayout='fixed'
                          fixed={false}
                        />
                      </div>
                    )
                  )
                )
              }
            </div>
    : <div/>
  }
      </div>
    )
}




  render() {
    let screenHeight;
    let tableHead;
    let tableBottom;
    let itemIndex1=0;
    let itemIndex2=0;
    let scrollDefault;
    let xHeight;

    this.props.data[1].map((item)=>{
      itemIndex1+=item.length;
    })
    this.props.data[2].map((item)=>{
      itemIndex2+=item.length;
    })

    screenHeight = window.screen.height - 410;

    // scrollDefault = window.screen.height - 410;
    if(this.props.procedureDiv.scrollBar !== null && this.props.procedureDiv.scrollBar !== "" && this.props.procedureDiv.scrollBar.length !==0) {
      xHeight = window.screen.height - 380;
      const strArr = this.props.procedureDiv.scrollBar.split(",");
      strArr.map((item) => {
        if (item !== "X") {
          xHeight -=item;
        }
      })
      // @ts-ignore
      if(strArr[0] ==="X"){
        tableHead =xHeight
      }else{
        // eslint-disable-next-line prefer-destructuring
        tableHead = strArr[0];
      }

      // @ts-ignore
      if(strArr[2] ==="X"){
        tableBottom =xHeight
      }else{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tableBottom = strArr[2];
      }

      // @ts-ignore
      if(strArr[1] !=="X"){
        // eslint-disable-next-line prefer-destructuring
        screenHeight = strArr[1];
      }else{
        screenHeight = xHeight;
      }
    }else{
      if(this.props.schema[0].length !== 0) {
        this.props.schema[0].some((itemInfo) => {
          // eslint-disable-next-line radix
          tableHead= parseInt(itemInfo[0].rowMarge) * 23+10;
        })
      }
    }

    // eslint-disable-next-line prefer-const
      scrollDefault =window.screen.height - 380- tableHead;

    let m=-1;

    return (
      <div>
        <div className={styles.YearDiv}>{this.props.year}{formatMessage({ id: 'report.label.year' })}{this.props.formatName}</div>
            <div >
              {this.props.data[0] !== null && this.props.data[0] !== "" && this.props.data[0].length !== 0 ?
                  <div style={{height:`${tableHead.toString()}px`,overflowY:"scroll"}}>
                    {
                      this.props.data[0].map((item) => (
                        (<div>
                            { this.parseTableSchema(this.props,0,m+=1) }
                            <Table
                              className={styles.innerTableHead}
                              dataSource={[]}
                              columns={this.tableSchema}
                              pagination={false}
                              tableLayout='fixed'
                              fixed={false}
                            />
                          </div>
                          )))
                          }
                   </div>
                  :
                <div/>
                }
              { this.props.procedureDiv.scrollBar === "" || xHeight < 50 ?
                <div  style={{height:`${scrollDefault.toString()}px`,overflowY:"scroll"}}> {this.common(this.props.data[1],this.props.procedureDiv.scrollBar,
                  screenHeight,itemIndex1,this.props,this.props.data[2],tableBottom,xHeight,itemIndex2)}</div>
                :
                <div> {this.common(this.props.data[1],this.props.procedureDiv.scrollBar,
                  screenHeight,itemIndex1,this.props,this.props.data[2],tableBottom,xHeight,itemIndex2)}</div>
              }
            </div>
      </div>
    );
  }
}

export default InnerTable;
