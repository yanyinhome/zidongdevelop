import React, { Component } from 'react';

import '@css/home.less'
import Container from "@components/container";
import router from "@router/router";
import common_api from "@services/api/common_api"
import user_utils from "@utils/user_utils";
import { isEmpty } from "@utils/libs";

export default class Home extends Component {
    testApi = () => {
        user_utils.getResearchUser().then(user => {
            if (!isEmpty(user)) {
                let param = {
                    phone: user.users.phone,
                    accountName: "P1028908".replace(/\s+/g, ''),
                    accountPassword: user_utils.md5Pwd("123456"),
                    systemCode: '0005'
                };
                common_api.secondLogin((res) => {
                    console.log(res, "res")
                }, null, param)
                let param2 = { t: 6, topicType: 6, u: user.users.userId }
                common_api.getNoticeInfoCount((res) => {
                    console.log(res, "res1");
                }, null, param2
                )
            }
        })
    }
    render() {
        return (
            <Container
                navClass={`whtnavbar linenavbar`}
                navlabel='主页'
                leftIcons={[{
                    icon: 'leftback',
                    label: '',
                    // event: () => router.goback()
                }]}
            >
                <section body={"true"} className={`abt-conn`}>
                    <p>中信建投证券成立于2005年11月2日，是经中国证监会批准设立的全国性大型综合证券公司。公司注册于北京，注册资本76.46亿元，在全国30个省、市、自治区设有327家营业网点，并设有中信建投期货有限公司、中信建投资本管理有限公司、中信建投（国际）金融控股有限公司、中信建投基金管理有限公司和中信建投投资有限公司等5家子公司。公司在为政府、企业、机构和个人投资者提供优质专业的金融服务过程中建立了良好的声誉，自2010年起连续十年被中国证监会评为目前行业最高级别的A类AA级证券公司。</p>
                    <p>中信建投证券成立于2005年11月2日，是经中国证监会批准设立的全国性大型综合证券公司。公司注册于北京，注册资本76.46亿元，在全国30个省、市、自治区设有327家营业网点，并设有中信建投期货有限公司、中信建投资本管理有限公司、中信建投（国际）金融控股有限公司、中信建投基金管理有限公司和中信建投投资有限公司等5家子公司。公司在为政府、企业、机构和个人投资者提供优质专业的金融服务过程中建立了良好的声誉，自2010年起连续十年被中国证监会评为目前行业最高级别的A类AA级证券公司。</p>
                    <p>中信建投证券成立于2005年11月2日，是经中国证监会批准设立的全国性大型综合证券公司。公司注册于北京，注册资本76.46亿元，在全国30个省、市、自治区设有327家营业网点，并设有中信建投期货有限公司、中信建投资本管理有限公司、中信建投（国际）金融控股有限公司、中信建投基金管理有限公司和中信建投投资有限公司等5家子公司。公司在为政府、企业、机构和个人投资者提供优质专业的金融服务过程中建立了良好的声誉，自2010年起连续十年被中国证监会评为目前行业最高级别的A类AA级证券公司。</p>
                    <p>中信建投证券成立于2005年11月2日，是经中国证监会批准设立的全国性大型综合证券公司。公司注册于北京，注册资本76.46亿元，在全国30个省、市、自治区设有327家营业网点，并设有中信建投期货有限公司、中信建投资本管理有限公司、中信建投（国际）金融控股有限公司、中信建投基金管理有限公司和中信建投投资有限公司等5家子公司。公司在为政府、企业、机构和个人投资者提供优质专业的金融服务过程中建立了良好的声誉，自2010年起连续十年被中国证监会评为目前行业最高级别的A类AA级证券公司。</p>
                    <section>
                        <button onClick={() => { router.push("test") }}>
                            测试跳转
                        </button>
                    </section>
                </section>
                <section bottom={"true"} className='testbottom'>
                    <div onClick={this.testApi}>测试api</div>
                </section>
            </Container>
        );
    }
}
