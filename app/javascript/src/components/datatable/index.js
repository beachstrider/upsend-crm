import React from 'react';
import DataTable from 'react-data-table-component';
import Checkbox from '@material-ui/core/Checkbox';
import styles from './styles';

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

export class Datatable extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let { data, ...rest } = this.props;
    
    return(
      <DataTable
        theme="solarized"
        customStyles={styles}
        noHeader
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={selectProps}
        subHeaderWrap={false}
        persistTableHead
        onSelectedRowsChange={s => this.props.onSelectedRowsChange(s)}
        data={data}
        {...rest}
      />
    );
  }
}

export class IconColName extends React.Component{
  render(){
    return(
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={this.props.icon} style={{height: '16px'}} />
        &nbsp;&nbsp;
        {this.props.children}
      </div>
    );
  }
}