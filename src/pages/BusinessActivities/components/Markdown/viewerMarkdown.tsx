import React from "react";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import styles from './index.less';
export interface ViewerMarkdownProps {
  MarkdownRef:any;
  initialValue:string;
}

const SPACE_UNICODE = {
  'ensp': '\u2002',
  'emsp': '\u2003',
  'nbsp': '\u00a0'
}

const ViewerMarkdown: React.FC<ViewerMarkdownProps> = (props) => {
  let {
    initialValue,
  } = props;

  initialValue = initialValue.replaceAll("</table><br>\r\n<br>\r\n<br>\r\n", `</table>`);
  initialValue = initialValue.replaceAll(`</table><p>\r\n</p><p>\r\n</p>`,`</table>`);
  initialValue = initialValue.replaceAll("</table>", `</table><p>\r\n</p>\r\n\r\n`);



  initialValue = initialValue.replace(/(?:[\n])/g,'');
  initialValue = initialValue.replaceAll(`<br data-tomark-pass=""></br>`,''); 
  initialValue = initialValue.replaceAll(`<br data-tomark-pass=""><br>`,'');    
  initialValue = initialValue.replaceAll(`<br data-tomark-pass="">`,'');             
  initialValue = initialValue.replaceAll(` data-tomark-pass=""`,''); 

  return (
    <div className={styles.viewMarkdown}>
    <Viewer 
      initialEditType="markdown"    
      initialValue={initialValue}
    />
    </div>
  );
};
export default  ViewerMarkdown;
