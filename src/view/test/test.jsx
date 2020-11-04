import React from 'react';
import "@css/test.less";
import height_utils from "@utils/height_utils.js";
export default class Test extends React.Component {
    constructor(props){
        super(props);
        this.state={
            navPadTop: height_utils.getStyle('navPadTop') ? height_utils.getStyle('navPadTop') : ""
        }
    }
    render(){
        return (
            <div className="researchContainer">

            </div>
        )
    }
} 