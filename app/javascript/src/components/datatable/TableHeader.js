import React from 'react';
import { copy, downloadCSV, downloadExcel, print } from './actionFunctions';

const ActionBar = (props) => {
  return (
    <div className="dt-buttons">      
      <button className="dt-button buttons-copy buttons-html5" onClick={() => props.onCopy()}><span>Copy</span></button> 
      <button className="dt-button buttons-csv buttons-html5" onClick={() => props.onExportToCSV()}><span>CSV</span></button> 
      <button className="dt-button buttons-excel buttons-html5" onClick={() => props.onExportToExcel()}><span>Excel</span></button> 
      <button className="dt-button buttons-print" onClick={() => props.onExportToPrint()}><span>Print</span></button> 
    </div>
  )
}

const SearchBar = (props) => {
  return (
    <div className="dataTables_filter">
      <label>Search:<input type="search" onChange={(e) => props.onSearch(e.target.value)} /></label>
    </div>
  )
}

export default class TableHeader extends React.Component{
  render(){
    return(
      <div className="btl-header">
        <div>
          { this.props.actable === true &&
            <ActionBar 
              onCopy={() => copy(this.props.data)} 
              onExportToCSV={() => downloadCSV(this.props.data)} 
              onExportToExcel={() => downloadExcel(this.props.data)}
              onExportToPrint={() => print(this.props.data)}
            />
          }
        </div>
        <div>
          { this.props.searchable === true &&
            <SearchBar onSearch={(val) => this.props.onSearch(val)} />
          }
        </div>
      </div>
    );
  }
}