import { DataModal} from '../../../pages/Report/data';
import styles from "@/components/Report/style.less";

module.exports = [
  {
    key: '0',
    width: 20,
    // align:"right",
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };

      if (row["0"] ==="") {
        obj.props.colSpan  = 6;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    }
  },
  {
    key: '1',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row["0"] ==="") {
        obj.props.colSpan  = 0;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '2',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row["0"] ==="") {
        obj.props.colSpan  = 0;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '3',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row["0"] ==="") {
        obj.props.colSpan  = 0;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '4',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row["0"] ==="") {
        obj.props.colSpan  = 0;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '5',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row["0"] ==="") {
        obj.props.colSpan  = 0;
      }else{
        obj.props.colSpan  = 1;
      }
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '6',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.colSpan  = 1;
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '7',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.colSpan  = 1;
      obj.props.align= "right";
      return obj;
    },
  },

  {
    key: '8',
    render: (value: any, row: DataModal, index: any) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.colSpan  = 1;
      obj.props.align= "right";
      return obj;
    },
  },
];
