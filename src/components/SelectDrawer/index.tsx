import { ConnectState } from '@/models/connect';
import { SelectMenuItem, SelectUserNmItem } from '@/models/global';
import { Button, Divider, Drawer, message, Tree } from 'antd';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect, FormattedMessage } from 'umi';
import './index.less';
import { UserOutlined } from '@ant-design/icons';
import { formatMessage } from "@@/plugin-locale/localeExports";
import { history } from "@@/core/history";


message.config({
  duration: 5,
});

export interface SelectDrawerProps {
  show?: boolean;
  getContainer?: any;
  prefixCls?: string;
  customer?: any;
  oncust: boolean;
  dispatch: Dispatch<any>;
}

const SelectDrawer: React.FC<SelectDrawerProps> = (props) => {
  const {
    prefixCls = 'ant-pro',
    // @ts-ignore
    selectCollapsed,
    // @ts-ignore
    currentUser = {},
    customer = {},
    oncust,
  } = props;

  console.log("currentUser", currentUser);
  console.log("customer", customer);


  /**
   * 默认表示权限是否在权限中存在
   */
  // let defaultDspUserOrgCd =null != currentUser.dspUserOrgCd && undefined !==  currentUser.dspUserOrgCd?currentUser.dspUserOrgCd.split(","):[];
  // let defaultUserOrgCd = null !==  currentUser.authOrgCds && undefined !==  currentUser.authOrgCds?currentUser.authOrgCds.split(","):[];
  // let  defaultOrgCd: any[] | (() => string[])= [];
  // @ts-ignore
  // defaultDspUserOrgCd.forEach((item)=>{
  //   defaultUserOrgCd.forEach((authOrgCdItem: any)=>{
  //     if (item === authOrgCdItem){
  //       defaultOrgCd.push(item);
  //     }
  //   })
  // })
  // const [checkedKeys, setCheckedKeys] = useState<string[]>(defaultOrgCd);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultOrgCd);
  // const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>(defaultOrgCd);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<[]>([]);
  const [treeData, setTreeData] = useState<[]>([]);
  const [showTreeData, setShowTreeData] = useState<[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<[]>([]);
  const [authOrgCds, setAuthOrgCds] = useState<[]>([]); //権限
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  //let checkedItems = [];
  const changeReadStateOrganization = (payload: boolean): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectCollapseOrg',
        payload
      });
    }
  };




  /**
   * 设置title菜单
   * @param payload
   */
  const changeSelectMenuState = (payload: SelectMenuItem[]): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeSelectMenu',
        payload
      });
    }
  };

  /**
   * 设置页面的menu
   * @param panx
   */
  const selectHomePageMenu = (payload: any): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/selectHomePageMenu',
        payload
      });
    }
  };

  /**
   * 设置选中的用户
   * @param payload
   */
  const selectUserNameMenu = (payload: SelectUserNmItem): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/selectUserNameMenu',
        payload
      });
    }
  };

  // @ts-ignore
  const changeRightMenu = (parma1: boolean, parma2: boolean, parma3: boolean, parma4: boolean, parma5: boolean, parma6: boolean): void => {
    const { dispatch } = props;
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

  /**
   * 设置用户权限菜单
   * @param payload
   */
  const setUserOrgInfoList = (payload: {}): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/setUserOrgInfoList',
        payload
      });
    }
  };

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  /**
   * 复选框选择
   * @param checkedKeys
   * @param e
   */
  const onCheck = (checkedKeys: React.SetStateAction<string[]>, e: any) => {
    if (oncust === false) {
      let items = e.checkedNodes.filter((item: { orgDiv: string; }) => item.orgDiv === "2")
      let isSelects = false;
      items.some((item) => {
        //顧客組織区分


        let userInfoList = items.filter((e) => e.userCd === item.userCd)
        if (null !== userInfoList && undefined !== userInfoList && userInfoList.length > 1) {
          isSelects = true;
          return true;
        }
        return false;
      })
      if (isSelects) {
        message.info(formatMessage({ id: 'org.tree.select.users' }));
        return false;
      }
    } else {
      let items = e.checkedNodes.filter((item: { custOrgDiv: string; }) => item.custOrgDiv === "2")
      let isSelects = false;
      items.some((item) => {
        let custInfoList = items.filter((e) => e.custCstmrCd === item.custCstmrCd)
        if (null !== custInfoList && undefined !== custInfoList && custInfoList.length > 1) {
          isSelects = true;
          return true;
        }
      })
      if (isSelects) {
        message.info(formatMessage({ id: 'org.tree.select.cust' }));
        return false;
      }
    }

    /**
     * 当前选择的所有节点
     */
    setCheckedItems(e.checkedNodes);
    setCheckedKeys(checkedKeys);
  };

  // ページの先頭にあるメニューが表示されますか
  // @ts-ignore
  const changeBaseMenuShowState = (payload: boolean): void => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/displayBaseMenuFlag',
        payload
      });
    }
  };

  /**
   * 点击数节点内容非复选框
   * @param selectedKeys
   * @param e
   */
  const onSelect = (selectedKeys: React.SetStateAction<string[]>, e: any) => {
    /**
     * 隐藏窗口
     */
    changeReadStateOrganization(false);
    changeBaseMenuShowState(true);
    changeRightMenu(false, false, false, false, false, false);
    if (selectedKeys.length <= 0) {
      userDefaultItemsMenu(defaultExpandedKeys, currentUser.userDiv)
      // userDefaultItemsMenu(defaultExpandedKeys,currentUser.userDiv)
      history.push(`/homePage`);
      // return;
      selectedKeys.push(e.node.key)
    }
    const selectItemData: SelectMenuItem[] = [];
    //顧客組織区分
    if (oncust === false) {

      if (e.node.orgDiv === "2") {
        const selectUserItem: SelectMenuItem = {
          selectedKeys: e.node.userCd,
          selectedIndex: '1',
          selectedName: e.node.orgNm,
          path: "homePage",
          selectMenuData: selectMenuData([e.node.userCd], null, e.node.orgDiv, e.node.orgNm, "3", e.node.orgCd),
        };
        var dspUserOrgCd = e.node.dspUserOrgCd.split(",");
        var defaultItmes = [];
        dspUserOrgCd.forEach((key) => {
          var itemInfo = showTreeData.filter((item) => item.orgCd === key);
          if (null !== itemInfo && undefined !== itemInfo && "" !== itemInfo && itemInfo.length > 0) {
            defaultItmes.push(itemInfo[0])
          }
        });
        let toTalItemKeys = "";
        let selectedIndex = 0
        if (e.node.userDiv !== "1") {
          defaultItmes.forEach((item) => {
            if ("" !== toTalItemKeys) {
              toTalItemKeys = toTalItemKeys + "," + item.orgCd
            } else {
              toTalItemKeys = toTalItemKeys + item.orgCd
            }
            const selectItem: SelectMenuItem = {
              selectedKeys: item.orgCd,
              selectedIndex: '1',
              path: "homePage",
              selectedName: item.orgNm,
              selectMenuData: selectMenuData(
                [item.userCd],
                item.orgDiv === "1" ? [item.orgCd] : [item.parOrgCd],
                item.orgDiv, item.orgNm, item.orgDiv === "1" ? "2" : "3",
                item.orgCd),
            };

            let selectChildrenKeys = "";
            const selectChildrenItemData: SelectMenuItem[] = [];
            if (null !== item.children && undefined !== item.children && "" !== item.children) {
              item.children.forEach((childrenInfo: { orgCd: any; orgNm: any; parOrgCd: any; userCd: any; orgDiv: any; }) => {
                const childrenItem: SelectMenuItem = {
                  selectedKeys: childrenInfo.orgCd,
                  selectedIndex: '1',
                  path: "homePage",
                  selectedName: childrenInfo.orgNm,
                  selectMenuData: selectMenuData(
                    childrenInfo.orgDiv === "1" ? null : [childrenInfo.userCd],
                    childrenInfo.orgDiv === "1" ? [childrenInfo.orgCd] : [childrenInfo.parOrgCd],
                    childrenInfo.orgDiv, childrenInfo.orgNm, childrenInfo.orgDiv === "1" ? "2" : "3",
                    childrenInfo.orgCd),
                };
                if ("" !== selectChildrenKeys) {
                  selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.orgCd
                } else {
                  selectChildrenKeys = selectChildrenKeys + childrenInfo.orgCd
                }
                selectChildrenItemData.push(childrenItem);
              })
              // @ts-ignore
              selectItem.selectChildrenMenuData = selectChildrenItemData;
              // @ts-ignore
            }
            selectItemData.push(selectItem);
          })
        }

        if (e.node.userDiv === "1") {
          let defaultItmes: any = [];
          // let selectItemData: SelectMenuItem[] = [];
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "2",
            path: "formadvancedformSea?id=SearchActualityForecast",
            name: formatMessage({ id: 'actualityForecast.index.ActualityForecast' })
          })
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "3",
            path: "formadvancedformSeaRun?id=SearchRunningCases",
            name: formatMessage({ id: 'actualityForecast.index.RunningCases' })
          })

          // eslint-disable-next-line block-scoped-var
          defaultItmes.forEach((item: any) => {
            // @ts-ignore
            const selectItem: SelectMenuItem = {
              selectedKeys: item.key,
              selectedIndex: item.key,
              selectedName: item.name,
              path: item.path,
              selectMenuData: [],
            };
            selectItemData.push(selectItem);
          })
        }
        selectItemData.unshift(selectUserItem)
        changeSelectMenuState([])
        selectHomePageMenu([])

        changeSelectMenuState(selectItemData)
        selectHomePageMenu(selectItemData)

        // @ts-ignore
        selectUserNameMenu({});
        const selectUserNm: SelectUserNmItem = {
          userCd: selectItemData[0].selectedKeys,
          userNm: selectItemData[0].selectedName
        }
        selectUserNameMenu(selectUserNm);
      } else {
        selectedKeys?.forEach((item) => {
          const selectItem: SelectMenuItem = {
            selectedKeys: item,
            selectedIndex: '1',
            path: "homePage",
            selectedName: e.node.orgNm,
            selectMenuData: selectMenuData([e.node.userCd], [e.node.orgCd], e.node.orgDiv, e.node.orgNm, "2", e.node.orgCd),
          };
          let selectChildrenKeys = "";
          const selectChildrenItemData: SelectMenuItem[] = [];
          if (null !== e.node && undefined !== e.node && "" !== e.node &&
            null !== e.node.children && undefined !== e.node.children && "" !== e.node.children) {
            e.node.children.forEach((childrenInfo: { orgCd: any; orgNm: any; parOrgCd: any; orgDiv: any; userCd: any; }) => {
              const childrenItem: SelectMenuItem = {
                selectedKeys: childrenInfo.orgCd,
                selectedIndex: '1',
                path: "homePage",
                selectedName: childrenInfo.orgNm,
                selectMenuData: selectMenuData(
                  childrenInfo.orgDiv === "1" ? null : [childrenInfo.userCd],
                  childrenInfo.orgDiv === "1" ? [childrenInfo.orgCd] : [childrenInfo.parOrgCd],
                  childrenInfo.orgDiv, childrenInfo.orgNm, childrenInfo.orgDiv === "1" ? "2" : "3",
                  childrenInfo.orgCd),
              };
              if ("" !== selectChildrenKeys) {
                selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.orgCd
              } else {
                selectChildrenKeys = selectChildrenKeys + childrenInfo.orgCd
              }
              selectChildrenItemData.push(childrenItem);
            })
            // @ts-ignore
            selectItem.selectChildrenMenuData = selectChildrenItemData;
            // @ts-ignore
            /// selectItem.selectedKeys = selectChildrenKeys
          }
          selectItemData.push(selectItem);
        })
        changeSelectMenuState([])
        selectHomePageMenu([])
        changeSelectMenuState(selectItemData)
        selectHomePageMenu(selectItemData)
      }
    } else {
      if (e.node.custOrgDiv === "2") {

        const selectUserItem: SelectMenuItem = {
          selectedKeys: e.node.custCstmrCd,
          selectedIndex: '1',
          selectedName: e.node.custOrgNm,
          path: "homePage",
          selectMenuData: selectMenuData(
            [e.node.custCstmrCd], [authOrgCds.join(',')], e.node.custOrgDiv, e.node.custOrgNm, "3", e.node.custCaseCd),
        };
        var defaultItmes = [];
        let toTalItemKeys = "";
        let selectedIndex = 0
        if (e.node.userDiv !== "1") {
          defaultItmes.forEach((item) => {
            if ("" !== toTalItemKeys) {
              toTalItemKeys = toTalItemKeys + "," + item.custCaseCd
            } else {
              toTalItemKeys = toTalItemKeys + item.custCaseCd
            }
            const selectItem: SelectMenuItem = {
              selectedKeys: item.custCaseCd,
              selectedIndex: '1',
              path: "homePage",
              selectedName: item.custOrgNm,
              selectMenuData: selectMenuData(
                // 111
                [item.custOrgNm],
                item.custOrgDiv === "1" ? [item.custCaseCd] : [item.custParOrgCd],
                item.custOrgDiv,
                item.custOrgNm, item.custOrgDiv === "1" ? "2" : "3",
                item.custCaseCd),
            };

            let selectChildrenKeys = "";
            const selectChildrenItemData: SelectMenuItem[] = [];
            if (null !== item.children && undefined !== item.children && "" !== item.children) {
              item.children.forEach((childrenInfo: { custCaseCd: any; custOrgNm: any; custParOrgCd: any; custCstmrCd: any; custOrgDiv: any; }) => {
                const childrenItem: SelectMenuItem = {
                  selectedKeys: childrenInfo.custCaseCd,
                  selectedIndex: '1',
                  path: "homePage",
                  selectedName: childrenInfo.custOrgNm,
                  selectMenuData: selectMenuData(
                    childrenInfo.custOrgDiv === "1" ? null : [childrenInfo.custCstmrCd],
                    childrenInfo.custOrgDiv === "1" ? [childrenInfo.custCaseCd] : [childrenInfo.custParOrgCd],
                    childrenInfo.custOrgDiv, childrenInfo.custOrgNm, childrenInfo.custOrgDiv === "1" ? "2" : "3",
                    childrenInfo.custCaseCd),
                };
                if ("" !== selectChildrenKeys) {
                  selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.custCaseCd
                } else {
                  selectChildrenKeys = selectChildrenKeys + childrenInfo.custCaseCd
                }
                selectChildrenItemData.push(childrenItem);
              })
              // @ts-ignore
              selectItem.selectChildrenMenuData = selectChildrenItemData;
              // @ts-ignore
            }
            selectItemData.push(selectItem);
          })
        }

        if (e.node.userDiv === "1") {
          let defaultItmes: any = [];
          // let selectItemData: SelectMenuItem[] = [];
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "2",
            path: "formadvancedformSea?id=SearchActualityForecast",
            name: formatMessage({ id: 'actualityForecast.index.ActualityForecast' })
          })
          // eslint-disable-next-line block-scoped-var
          defaultItmes.push({
            key: "3",
            path: "formadvancedformSeaRun?id=SearchRunningCases",
            name: formatMessage({ id: 'actualityForecast.index.RunningCases' })
          })

          // eslint-disable-next-line block-scoped-var
          defaultItmes.forEach((item: any) => {
            // @ts-ignore
            const selectItem: SelectMenuItem = {
              selectedKeys: item.key,
              selectedIndex: item.key,
              selectedName: item.name,
              path: item.path,
              selectMenuData: [],
            };
            selectItemData.push(selectItem);
          })
        }
        selectItemData.unshift(selectUserItem)
        changeSelectMenuState([])
        selectHomePageMenu([])
        changeSelectMenuState(selectItemData)
        selectHomePageMenu(selectItemData)

        // @ts-ignore
        selectUserNameMenu({});
        const selectUserNm: SelectUserNmItem = {
          custCstmrCd: selectItemData[0].selectedKeys,
          custOrgNm: selectItemData[0].selectedName
        }
        selectUserNameMenu(selectUserNm);
      } else {
        selectedKeys?.forEach((item) => {
          const selectItem: SelectMenuItem = {
            selectedKeys: item,
            selectedIndex: '1',
            path: "homePage",
            selectedName: e.node.custOrgNm,
            selectMenuData: selectMenuData([e.node.custCstmrCd], [e.node.custCaseCd], e.node.custOrgDiv, e.node.custOrgNm, "2", e.node.custCaseCd),
          };
          let selectChildrenKeys = "";
          const selectChildrenItemData: SelectMenuItem[] = [];
          if (null !== e.node && undefined !== e.node && "" !== e.node &&
            null !== e.node.children && undefined !== e.node.children && "" !== e.node.children) {
            e.node.children.forEach((childrenInfo: { custCaseCd: any; custOrgNm: any; custParOrgCd: any; custOrgDiv: any; custCstmrCd: any; }) => {
              const childrenItem: SelectMenuItem = {
                selectedKeys: childrenInfo.custCaseCd,
                selectedIndex: '1',
                path: "homePage",
                selectedName: childrenInfo.custOrgNm,
                selectMenuData: selectMenuData(
                  childrenInfo.custOrgDiv === "1" ? null : [childrenInfo.custCstmrCd],
                  childrenInfo.custOrgDiv === "1" ? [childrenInfo.custCaseCd] : [childrenInfo.custParOrgCd],
                  childrenInfo.custOrgDiv, childrenInfo.custOrgNm, childrenInfo.custOrgDiv === "1" ? "2" : "3",
                  childrenInfo.custCaseCd),
              };
              if ("" !== selectChildrenKeys) {
                selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.custCaseCd
              } else {
                selectChildrenKeys = selectChildrenKeys + childrenInfo.custCaseCd
              }
              selectChildrenItemData.push(childrenItem);
            })
            // @ts-ignore
            selectItem.selectChildrenMenuData = selectChildrenItemData;
            // @ts-ignore
            /// selectItem.selectedKeys = selectChildrenKeys
          }
          selectItemData.push(selectItem);
        })
        changeSelectMenuState([])
        selectHomePageMenu([])
        changeSelectMenuState(selectItemData)
        selectHomePageMenu(selectItemData)
      }
    }
    setSelectedKeys(selectedKeys);
    history.push(`/homePage`);
  };

  const baseClassName = `${prefixCls}-setting`;

  useEffect(() => {
    if (null !== currentUser && undefined !== currentUser && null !== currentUser.orgVos && undefined !== currentUser.orgVos
      && (null !== customer && undefined !== customer && null !== customer.custTreeData && undefined !== customer.custTreeData))
      treedataInfoList();

  }, [currentUser, oncust, customer]);

  /**
    * 组装树函数
    * @param {array} data -- 要组装的list数组
    * @param {string} idKey -- 树节点的id的名称
    * @param {string} parentKey -- 树节点的父节点id的名称
    * @param {string} childListKey -- 树节点的子集list的id的名称
    */
  const toTree = (data = [],
    idKey = 'id',
    parentKey = 'pid',
    childListKey = 'subList') => {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
      delete item[childListKey];
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
      map[item[idKey]] = item;
    });
    var val: never[] = [];
    data.forEach((item) => {
      // @ts-ignore
      item.title = item.orgNm;
      // @ts-ignore
      item.key = item.orgCd;
      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item[parentKey]];

      //添加图标
      if (item.orgDiv === "2") {
        item.icon = <UserOutlined />;
      }
      // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent[childListKey] || (parent[childListKey] = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;

  }

  const custToTree = (data = [],
    idKey = 'id',
    parentKey = 'pid',
    childListKey = 'subList') => {
    data.forEach(function (item) {
      delete item[childListKey];
    });

    var map = {};
    data.forEach(function (item) {
      map[item[idKey]] = item;
    });
    var val: never[] = [];
    data.forEach((item) => {
      // @ts-ignore
      item.title = item.custOrgNm;
      // @ts-ignore
      item.key = item.custCaseCd;
      var parent = map[item[parentKey]];


      if (item.custOrgDiv === "2") {
        item.icon = <UserOutlined />;
      }
      if (parent) {
        (parent[childListKey] || (parent[childListKey] = [])).push(item);
      } else {
        val.push(item);
      }
    });
    return val;
  }


  let userList = [];
  let custList = [];

  /**
   * 获取所有组织父节点
   * @param orgItemCd
   */

  const treeParentNode = (dataList = [], orgItemCd = "") => {
    dataList.forEach((item: { orgCd: string; parOrgCd: string | null | undefined; }) => {
      if (orgItemCd === item.orgCd) {
        var itemInfo = userList.filter((item) => item.orgCd === orgItemCd);
        // @ts-ignore
        if (null === itemInfo || undefined === itemInfo || "" === itemInfo || itemInfo.length <= 0) {
          userList.push(item);
        }
        if (null !== item.parOrgCd && undefined !== item.parOrgCd && "" !== item.parOrgCd) {
          treeParentNode(dataList, item.parOrgCd);
        }
      }
    });
  }

  /**
    * 获取所有顾客父节点
    * @param orgItemCd
    */
  const custTreeParentNode = (dataList = [], orgItemCd = "") => {
    dataList.forEach((item: { custCaseCd: string; custParOrgCd: string | null | undefined; }) => {
      if (orgItemCd === item.custCaseCd) {
        var itemInfo = custList.filter((item) => item.custCaseCd === orgItemCd);
        // @ts-ignore
        if (null === itemInfo || undefined === itemInfo || "" === itemInfo || itemInfo.length <= 0) {
          custList.push(item);
        }
        if (null !== item.custParOrgCd && undefined !== item.custParOrgCd && "" !== item.custParOrgCd) {
          custTreeParentNode(dataList, item.custParOrgCd);
        }
      }
    });
  }

  /**
   * 获取所有组织子节点
   * @param id
   */
  const treeChildNode = id => {
    currentUser.orgVos.forEach((item) => {
      if (item.parOrgCd === id) {
        var itemInfo = userList.filter((e) => e.orgCd === item.orgCd);
        // @ts-ignore
        if (null === itemInfo || undefined === itemInfo || "" === itemInfo || itemInfo.length <= 0) {
          userList.push(item);
        }
        treeChildNode(item.orgCd);
      }
    })
  }

  /**
   * 获取所有顾客子节点
   * @param id
   */
  const custTreeChildNode = id => {
    customer.custTreeData.forEach((item) => {
      if (item.custParOrgCd === id) {
        var itemInfo = custList.filter((e) => e.custCaseCd === item.custCaseCd);
        // @ts-ignore
        if (null === itemInfo || undefined === itemInfo || "" === itemInfo || itemInfo.length <= 0) {
          custList.push(item);
        }
        custTreeChildNode(item.custCaseCd);
      }
    })
  }



  /**
   * 组装tree数据
   */
  let userOrgCd: any[] = [];
  const treedataInfoList = () => {

    
    userOrgCd = null !== currentUser.authOrgCds && undefined !== currentUser.authOrgCds ? currentUser.authOrgCds.split(",") : []
    userOrgCd.forEach((item: any) => {
      treeParentNode(currentUser.orgVos, item);
      treeChildNode(item);
      //権限
      setAuthOrgCds(userOrgCd)
    });
    
     
    let custOrgCd: any[] = userOrgCd;
    custOrgCd.forEach((item: any) => {
      const trimmedData = item.slice(0, 8);
      custTreeParentNode(customer.custTreeData, trimmedData);
      custTreeChildNode(trimmedData);
    });

    // @ts-ignore
    if (null !== userList && undefined !== userList && userList.length > 0 && !oncust) {
      let defaultDspUserOrgCd = null != currentUser.dspUserOrgCd && undefined !== currentUser.dspUserOrgCd ? currentUser.dspUserOrgCd.split(",") : [];

      let defaultOrgCd: any[] | ((prevState: string[]) => string[]) = [];
      defaultDspUserOrgCd.forEach((item: any) => {
        // @ts-ignore
        userList.forEach((authOrgCdItem: any) => {
          if (item === authOrgCdItem.orgCd) {
            defaultOrgCd.push(item);
          }
        })
      })

      setCheckedKeys(defaultOrgCd);
      setSelectedKeys(defaultOrgCd);
      setDefaultExpandedKeys(defaultOrgCd);
      // @ts-ignore
      setExpandedKeys(defaultOrgCd);
      setAutoExpandParent(true);
      setShowTreeData(userList);
    } else if (null !== custList && undefined !== custList && custList.length > 0 && oncust) {

      let defaultDspUserOrgCd = null != customer.authOrgCds && undefined !== customer.authOrgCds ? customer.authOrgCds.split(",") : [];

      let defaultOrgCd: any[] | ((prevState: string[]) => string[]) = [];
      defaultDspUserOrgCd.forEach((item: any) => {
        // @ts-ignore
        custList.forEach((authOrgCdItem: any) => {
          if (item === authOrgCdItem.custCaseCd) {
            defaultOrgCd.push(item);
          }
        })
      })
      // setCheckedKeys(defaultOrgCd);
      setSelectedKeys(defaultOrgCd);
      setDefaultExpandedKeys(defaultOrgCd);
      // @ts-ignore
      setExpandedKeys(defaultOrgCd);
      setAutoExpandParent(true);
      setShowTreeData(custList);
    }

    let sortUserList = [];
    let sortCustList = [];
    let treedataInfo = [];

    //顧客組織区分
    if (oncust === false) {
      currentUser.orgVos.forEach((orgInfoItem) => {
        var itemInfo = userList.filter((e) => e.orgCd === orgInfoItem.orgCd);
        // @ts-ignore
        if (null !== itemInfo && undefined !== itemInfo && "" !== itemInfo && itemInfo.length > 0) {
          sortUserList.push(orgInfoItem);
        }
      })

      treedataInfo = toTree(sortUserList, "orgCd", "parOrgCd", "children");
      setTreeData(treedataInfo);
      setUserOrgInfoList(currentUser.orgVos);


      userDefaultItemsMenu(checkedKeys, currentUser.userDiv)
    } else {
      customer.custTreeData.forEach((orgInfoItem) => {
        var itemInfo = custList.filter((e) => e.custCaseCd === orgInfoItem.custCaseCd);
        // @ts-ignore
        if (null !== itemInfo && undefined !== itemInfo && "" !== itemInfo && itemInfo.length > 0) {
          sortCustList.push(orgInfoItem);
        }
      })

      treedataInfo = custToTree(sortCustList, "custCaseCd", "custParOrgCd", "children");
      setTreeData(treedataInfo);
      setUserOrgInfoList(customer.custTreeData);
      userDefaultItemsMenu(checkedKeys, customer.custDiv)

    }
  }
  /**
   *
   */
  const userDefaultItemsMenu = (Keys, userDiv) => {
    if (null !== Keys && undefined !== Keys && "" !== Keys && Keys.length > 0) {
      const defaultItmes: any[] = [];
      //获取默认选项
      Keys.forEach((key) => {
        //顧客組織区分
        if (oncust === false) {
          var itemInfo = currentUser.orgVos.filter((item) => item.orgCd === key);
          if (null !== itemInfo && undefined !== itemInfo && "" !== itemInfo && itemInfo.length > 0) {
            defaultItmes.push(itemInfo[0])
          }
        } else {
          var itemInfo = customer.custTreeData.filter((item) => item.custCaseCd === key);
          if (null !== itemInfo && undefined !== itemInfo && "" !== itemInfo && itemInfo.length > 0) {
            defaultItmes.push(itemInfo[0])
          }
        }
      });
      if (null === defaultItmes || undefined === defaultItmes || defaultItmes.length <= 0) {
        return;
      }
      setCheckedItems(defaultItmes);
      treedDataCompare(defaultItmes, userDiv, "1",);
    }
  }

  const onTreedDataCompareBtnClick = () => {
    /**
     * 隐藏窗口
     */
    changeReadStateOrganization(false);
    changeBaseMenuShowState(true);
    changeRightMenu(false, false, false, false, false, false);

    treedataInfoList()
    // @ts-ignore
    if (null === checkedItems || undefined === checkedItems || "" === checkedItems || checkedItems.length <= 1) {
      message.info(formatMessage({ id: 'org.tree.select' }));
      return;
    }

    let userDiv = "";
    //顧客組織区分
    if (oncust === false) {
      let items = checkedItems.filter((item) => item.orgDiv === "2")
      let userOrgsDiv: any[] = [];
      checkedItems.forEach((item: any) => {
        userOrgsDiv.push(item.orgCd)
      })

      // @ts-ignore
      if (null !== items && undefined !== items && "" !== items && items.length > 0) {
        // 2：ユーザ
        if (items.length !== checkedItems.length) {

          // @ts-ignore
          setExpandedKeys(userOrgsDiv);
          setAutoExpandParent(true);
          message.info(formatMessage({ id: 'org.tree.select.level' }));
          return;
        }
        userDiv = "2"
        // @ts-ignore
        selectUserNameMenu({});
        // @ts-ignore
        const selectUserNm: SelectUserNmItem = {
          userCd: items[0].userCd,
          userNm: items[0].title,
        }
        selectUserNameMenu(selectUserNm);

      } else {
        // @ts-ignore
        let itemLevels = checkedItems.filter((item) => item.levels === checkedItems[0].levels)
        if (null !== itemLevels && undefined !== itemLevels && itemLevels.length > 0) {
          // @ts-ignore
          setExpandedKeys(userOrgsDiv);
          setAutoExpandParent(true);
          if (itemLevels.length !== checkedItems.length) {
            message.info(formatMessage({ id: 'org.tree.select.compare' }));
            return;
          }
        } else {
          // 无数据
          message.info(formatMessage({ id: 'org.tree.select' }));
          return;
        }
        userDiv = "1"
      }

    } else {
      let items = checkedItems.filter((item) => item.custOrgDiv === "2")
      let userOrgsDiv: any[] = [];
      checkedItems.forEach((item: any) => {
        userOrgsDiv.push(item.custCaseCd)
      })

      // @ts-ignore
      if (null !== items && undefined !== items && "" !== items && items.length > 0) {
        // 2：ユーザ
        if (items.length !== checkedItems.length) {

          // @ts-ignore
          setExpandedKeys(userOrgsDiv);
          setAutoExpandParent(true);
          message.info(formatMessage({ id: 'org.tree.select.levelcust' }));
          return;
        }
        userDiv = "2"
        // @ts-ignore
        selectUserNameMenu({});
        // @ts-ignore
        const selectUserNm: SelectUserNmItem = {
          userCd: items[0].userCd,
          userNm: items[0].title,
        }
        selectUserNameMenu(selectUserNm);

      } else {
        //1：組織
        // @ts-ignore
        let itemLevels = checkedItems.filter((item) => item.levels === checkedItems[0].levels)
        if (null !== itemLevels && undefined !== itemLevels && itemLevels.length > 0) {
          // @ts-ignore
          setExpandedKeys(userOrgsDiv);
          setAutoExpandParent(true);
          if (itemLevels.length !== checkedItems.length) {
            message.info(formatMessage({ id: 'org.tree.select.compare' }));
            return;
          }
        } else {
          // 无数据
          message.info(formatMessage({ id: 'org.tree.select' }));
          return;
        }
        userDiv = "1"
      }
    }

    treedDataCompare(checkedItems, "0", userDiv);
    history.push(`/homePage`);
  }

  const onTreeDataCancelBtnClick = () => {

    setCheckedItems([]);
    setSelectedKeys([]);
    setCheckedKeys([]);
  }
  /**
   * ユーザ区分	1：営業者、0：非営業者
   * @param dataList
   * @param userDiv
   */
  // 将被选中的项的数据进行处理，然后更新选中的菜单状态。　
  const treedDataCompare = (dataList, loginType, userDiv) => {
    let checkedItemList = [];
    // @ts-ignore
    if (null === dataList || undefined === dataList || "" === dataList) {
      checkedItemList = checkedItems;
    } else {
      checkedItemList = dataList;
    }
    const selectItemData: SelectMenuItem[] = [];

    let toTalItemKeys = "";
    let selectChildrenUserId = "";
    //顧客組織区分
    if (oncust === false) {
      // 组织part
      if (loginType !== "1") {
        checkedItemList.forEach((item) => {
          if ("" !== toTalItemKeys) {
            toTalItemKeys = toTalItemKeys + "," + item.orgCd
          } else {
            toTalItemKeys = toTalItemKeys + item.orgCd
          }
          if ("" !== selectChildrenUserId) {
            selectChildrenUserId = selectChildrenUserId + "," + item.userCd
          } else {
            selectChildrenUserId = selectChildrenUserId + item.userCd
          }
          const selectItem: SelectMenuItem = {
            selectedKeys: item.orgCd,
            selectedIndex: '1',
            selectedName: item.orgNm,
            path: "homePage",
            selectMenuData: selectMenuData(
              item.orgDiv === "1" ? null : [item.userCd],
              item.orgDiv === "1" ? [item.orgCd] : null, item.orgDiv, item.orgNm,
              item.orgDiv === "1" ? "2" : "3", item.orgCd
            ),
          };
          let selectChildrenKeys = "";
          const selectChildrenItemData: SelectMenuItem[] = [];
          if (null !== item.children && undefined !== item.children && "" !== item.children) {
            item.children.forEach((childrenInfo: { orgCd: any; orgNm: any; userCd: any; orgDiv: any; parOrgCd: any; }) => {
              const childrenItem: SelectMenuItem = {
                selectedKeys: childrenInfo.orgCd,
                selectedIndex: '1',
                path: "homePage",
                selectedName: childrenInfo.orgNm,
                selectMenuData: selectMenuData(
                  childrenInfo.orgDiv === "1" ? null : [childrenInfo.userCd],
                  childrenInfo.orgDiv === "1" ? [childrenInfo.orgCd] : [childrenInfo.parOrgCd],
                  childrenInfo.orgDiv, childrenInfo.orgNm, childrenInfo.orgDiv === "1" ? "2" : "3", childrenInfo.orgCd
                ),
              };
              if ("" !== selectChildrenKeys) {
                selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.orgCd
              } else {
                selectChildrenKeys = selectChildrenKeys + childrenInfo.orgCd
              }
              selectChildrenItemData.push(childrenItem);
            })
            // @ts-ignore
            selectItem.selectChildrenMenuData = selectChildrenItemData;
            // @ts-ignore
            //selectItem.selectedKeys = selectChildrenKeys
          }
          selectItemData.push(selectItem);

        })
      }
    } else {
      //顾客part
      if (loginType !== "1") {
        checkedItemList.forEach((item) => {
          if ("" !== toTalItemKeys) {
            toTalItemKeys = toTalItemKeys + "," + item.custCaseCd
          } else {
            toTalItemKeys = toTalItemKeys + item.custCaseCd
          }
          if ("" !== selectChildrenUserId) {
            selectChildrenUserId = selectChildrenUserId + "," + item.custCstmrCd
          } else {
            selectChildrenUserId = selectChildrenUserId + item.custCstmrCd
          }
          const selectItem: SelectMenuItem = {
            selectedKeys: item.custCaseCd,
            selectedIndex: '1',
            selectedName: item.custOrgNm,
            path: "homePage",
            selectMenuData: selectMenuData(
              item.custOrgDiv === "1" ? null : [item.custCstmrCd],
              item.custOrgDiv === "1" ? [item.custCaseCd] : null, item.custOrgDiv, item.custOrgNm,
              item.custOrgDiv === "1" ? "2" : "3", item.custCaseCd
            ),
          };
          let selectChildrenKeys = "";
          const selectChildrenItemData: SelectMenuItem[] = [];
          if (null !== item.children && undefined !== item.children && "" !== item.children) {
            item.children.forEach((childrenInfo: { custCaseCd: any; custOrgNm: any; custCstmrCd: any; custOrgDiv: any; custParOrgCd: any; }) => {
              const childrenItem: SelectMenuItem = {
                selectedKeys: childrenInfo.custCaseCd,
                selectedIndex: '1',
                path: "homePage",
                selectedName: childrenInfo.custOrgNm,
                selectMenuData: selectMenuData(
                  childrenInfo.custOrgDiv === "1" ? null : [childrenInfo.custCstmrCd],
                  childrenInfo.custOrgDiv === "1" ? [childrenInfo.custCaseCd] : [authOrgCds.join(',')],
                  childrenInfo.custOrgDiv, childrenInfo.custOrgNm, childrenInfo.custOrgDiv === "1" ? "2" : "3", childrenInfo.custCaseCd
                ),
              };
              if ("" !== selectChildrenKeys) {
                selectChildrenKeys = selectChildrenKeys + "," + childrenInfo.custCaseCd
              } else {
                selectChildrenKeys = selectChildrenKeys + childrenInfo.custCaseCd
              }
              selectChildrenItemData.push(childrenItem);
            })
            // @ts-ignore
            selectItem.selectChildrenMenuData = selectChildrenItemData;
            // @ts-ignore
            //selectItem.selectedKeys = selectChildrenKeys
          }
          selectItemData.push(selectItem);
        })
      }
    };

    let selectToTalItem: SelectMenuItem = [];
    if (loginType === "1") {
      let items = currentUser.orgVos.filter((item: { userCd: any; }) => item.userCd === currentUser.userid)
      selectToTalItem = {
        selectedKeys: items[0].userCd,
        selectedIndex: '1',
        selectedName: items[0].orgNm,
        path: "homePage",
        selectMenuData: selectMenuData([items[0].userCd], null, items[0].orgDiv, items[0].orgNm, "3", items[0].orgCd),
      };
      selectToTalItem = {
        selectedKeys: items[0].custCstmrCd,
        selectedIndex: '1',
        selectedName: items[0].custOrgNm,
        path: "homePage",
        selectMenuData: selectMenuData([items[0].custCstmrCd], null, items[0].custOrgDiv, items[0].custOrgNm, "3", items[0].custCaseCd),
      };
      let defaultItmes: any = [];
      defaultItmes.push({ key: "2", path: "formadvancedformSea?id=SearchActualityForecast", name: formatMessage({ id: 'actualityForecast.index.ActualityForecast' }) })

      defaultItmes.push({ key: "3", path: "formadvancedformSeaRun?id=SearchRunningCases", name: formatMessage({ id: 'actualityForecast.index.RunningCases' }) })

      defaultItmes.forEach((item: any) => {
        // @ts-ignore
        const selectItem: SelectMenuItem = {
          selectedKeys: item.key,
          selectedIndex: item.key,
          selectedName: item.name,
          path: item.path,
          selectMenuData: [],
        };
        selectItemData.push(selectItem);
      })
    } else {
      selectToTalItem = {
        selectedKeys: toTalItemKeys,
        selectedIndex: '1',
        path: "homePage",
        selectedName: formatMessage({ id: 'app.common.Total' }),
        selectMenuData: selectMenuData(userDiv === "2" ? [selectChildrenUserId] : null, userDiv === "1" ? [toTalItemKeys] : null, userDiv, formatMessage({ id: 'app.common.Total' }), "1", toTalItemKeys),
      };
    }
    selectItemData.unshift(selectToTalItem)
    changeSelectMenuState([])
    selectHomePageMenu([])
    changeSelectMenuState(selectItemData)
    selectHomePageMenu(selectItemData)
  }
  /**
   * 组装menu点击参数
   * @param userId
   * @param orgCd
   * @param orgType
   * @param tabName
   * @param tabType
   */
  const selectMenuData = (userCd: string | any[] | null, orgCd: string | any[] | null, orgType: string, tabName: string, tabType: string, selectOrgCd: string) => {
    return {
      userCd: userCd,
      orgCd: orgCd,
      orgType: orgType,
      tabName: tabName,
      tabType: tabType,
      selectOrgCd: selectOrgCd,
    }
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <Drawer
      visible={selectCollapsed}
      width={430}
      onClose={() => changeReadStateOrganization(false)}
      placement='left'
      //  getContainer={getContainer}

      style={{
        marginTop: 96,
        // marginLeft:-24,
        // marginTop:-24,
        zIndex: 999,
        //position: 'absolute',
        bottom: -96
      }}
    >
      <div className={`${baseClassName}-drawer-content`}>
        <Tree
          checkStrictly={true}
          checkable
          showLine
          showIcon
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          // expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={treeData}

        />
        <Button style={{ marginBottom: 4 }} onClick={() => onTreedDataCompareBtnClick()}>
          <FormattedMessage id="org.tree.set" defaultMessage="select" />
        </Button>
        <Button style={{ marginBottom: 4, marginLeft: 10 }} onClick={() => onTreeDataCancelBtnClick()}>
          <FormattedMessage id="org.tree.clear" defaultMessage="clear" />
        </Button>
        <Divider />
        <Divider />
        <Divider />
      </div>
    </Drawer >
  );
};

export default connect(({ global, user, cust, message }: ConnectState) => ({
  oncust: global.oncust,
  selectCollapsed: global.selectCollapsed,
  selectMenu: global.selectMenu,
  orgInfoList: global.orgInfoList,
  currentUser: user.currentUser,
  customer: cust.customer,
  message

}))(SelectDrawer);
