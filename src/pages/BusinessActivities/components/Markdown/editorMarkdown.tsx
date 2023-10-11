import React from "react";
import {Dispatch} from "@@/plugin-dva/connect";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/i18n/zh-cn';
import '@toast-ui/editor/dist/i18n/ja-jp';
import {getLanguage} from "@/pro-layout/locales";
import styles from './index.less';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

export interface MarkdownProps {
  MarkdownRef:any;
  initialEditType:string;
  initialValue:string;
  newCloseFlag:boolean;
  disableButton:boolean;

}

const Markdown: React.FC<MarkdownProps> = (props) => {
  let {
    newCloseFlag,
    disableButton,
    dispatch,
    MarkdownRef,
    initialEditType,
    initialValue,
  } = props;

  const plugins = [
    [
      colorSyntax
    ]
  ]

  initialValue = initialValue.replaceAll("</table><br>\r\n<br>\r\n<br>\r\n", `</table>`);
  initialValue = initialValue.replaceAll(`</table><p>\r\n</p><p>\r\n</p>`,`</table>`);
  initialValue = initialValue.replaceAll("</table>", `</table><p>\r\n</p>\r\n\r\n`);

  initialValue = initialValue.replace(/(?:[\n])/g,'');
  initialValue = initialValue.replaceAll(`<br data-tomark-pass=""></br>`,'');
  initialValue = initialValue.replaceAll(`<br data-tomark-pass=""><br>`,'');
  initialValue = initialValue.replaceAll(`<br data-tomark-pass="">`,'');
  initialValue = initialValue.replaceAll(` data-tomark-pass=""`,'');
  let flag;
  const  editorStateChange = {
    change:()=>{
     const text = MarkdownRef.current.getInstance().getMarkdown()

      debugger
      if(text ==='' && disableButton===false) {
        flag = false;
      }else {
        flag = true;
      }
     /* if(text ==='' && disableButton===false) {
        flag = false;
      }
      if(text ==='' && disableButton===true) {
        flag = true;
      }
      if(text !=='' && disableButton === false) {
        flag = true;
      }
      if(text !=='' && disableButton === true) {
        flag = true;
      }
*/
      dispatch({
        type: 'global/inForceFlag',
        payload: flag
      });
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: flag
      });
      dispatch({
        type: 'global/disableButton',
        payload: flag
      });
      dispatch({
        type: 'global/editorMarkDownFlag',
        payload: flag
      });
    }


/*      if((text ==='' && disableButton) && !newCloseFlag) {
        flag = false;
      }else {
        flag = true;
      }

      dispatch({
          type: 'global/inForceFlag',
          payload: flag
        });
        dispatch({
          type: 'global/dialogBoxFlag',
          payload: flag
        });
        dispatch({
          type: 'global/disableButton',
          payload: flag
        });
      }*/
     /* if(text!==''|| newCloseFlag || text===''){
        flag=true;
      }else {
        flag=false;
      }
      dispatch({
        type: 'global/inForceFlag',
        payload: !saveButtonFlag
      });
      dispatch({
        type: 'global/dialogBoxFlag',
        payload: flag
      }); */


  }
  return (


    <div className={styles.editorMarkdown}>
    <Editor
      initialValue={initialValue}
      previewStyle="vertical"
      height="300px"
      initialEditType={initialEditType}
      //initialEditType="markdown"
      useCommandShortcut={true}
      ref={MarkdownRef}
      //language={getLanguage()}
      // @ts-ignore
      plugins={plugins}
      events={editorStateChange}
    />
    </div>
  );
};
export default Markdown;
