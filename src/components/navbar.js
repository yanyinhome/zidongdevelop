import React, { Component } from 'react';
import '@css/container.less'
import height_utils from "@utils/height_utils.js";
 

export default class NavBar extends Component {
    constructor(props){
        super(props)
        this.state={
            navPadTop: height_utils.getStyle('navPadTop') ? height_utils.getStyle('navPadTop') : "",
            iosnav: height_utils.getStyle('navHeight') ? height_utils.getStyle('navHeight') : "",
        }
    }
    render(){
        return (
                <section className={`inavbar ${this.state.navPadTop} ${this.props.class}`}>
                    <section className={`nav-conn ${this.state.iosnav}`}>
                        <section className={`navbar-left `}>
                            {this.props.leftIcons ? this.props.leftIcons.map((item, index) => {
                                return <i key={index} className={item.icon}
                                        event-id={this.props.eventIdLeft}
                                        event-label={this.props.eventLabelLeft}
                                        onClick={item.event}>{item.label}</i>
                            }) : ''}
                        </section>
                        <section className={`navbar-title`}>{this.props.navlabel}</section>
                        <section className={`navbar-right`}>
                            {this.props.rightIcons ? this.props.rightIcons.map((item, index) => {
                                return <i key={index} className={item.icon}
                                        event-id={this.props.eventIdRight}
                                        event-label={this.props.eventLabelRight}
                                        onClick={item.event}>{item.label}</i>
                            }) : ''}
                        </section>
                    </section>
                </section>
            )
        }
}