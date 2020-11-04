import React, { Component, Fragment } from 'react';
import '@css/container.less'
import NavBar from "@components/navbar";
import height_utils from "@utils/height_utils.js";

export default class Container extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bodyPaddingBottom: "",
            INavBarHeight: height_utils.getStyle('bodypadtop') ? height_utils.getStyle('bodypadtop') : ""
        }
    }
    componentDidMount() {
        const bottom = document.querySelector("#bottom");
        if (bottom) {
            const BottomHeight=bottom.offsetHeight;
            const fontSize= document.getElementsByTagName("html")[0].style.fontSize;
            const realBottomHeight=parseInt(BottomHeight*75/parseFloat(fontSize));
            this.setState(
               { bodyPaddingBottom:`padbot${parseInt(realBottomHeight)}`}
            )
        }
    }
    renderChild(child) { // 控制内容的分发
        if (child.props.bottom) {
            return <div id="bottom"  key="bottom">{child}</div>
        } else if(child.props.body){
            return <div id="body" key="body"  className={`${this.state.INavBarHeight} ${this.state.bodyPaddingBottom}`}>{child}</div>
        }
    }
    render() {
        return (
            <section className={`container `}>
                <NavBar class={this.props.navClass} leftIcons={this.props.leftIcons} navlabel={this.props.navlabel} rightIcons={this.props.rightIcons}/>
                <Fragment>
                    {Array.isArray(this.props.children) ?
                            this.props.children.map((child) => {
                                return this.renderChild(child)
                            }) : this.props.children && this.renderChild(this.props.children)}
                </Fragment>  
            </section>
        );
    }
}
