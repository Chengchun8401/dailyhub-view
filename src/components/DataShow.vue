<template>
    <div class="data-view">
        <!--书签点击量概况-->
        <el-row class="collect-click">
            <el-col :span="4">
                <el-card class="total-click">
                    <div class="num">{{ totalClick }}</div>
                    <div class="data-description">总访问量</div>
                </el-card>
            </el-col>

            <el-col :span="4">
                <el-card class="total-click">
                    <div class="num">{{ weekClick }}</div>
                    <div class="data-description">七日访问</div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card id="weeklyClick" class="weekly-click"></el-card>
            </el-col>
        </el-row>

        <!--热门书签点击量展示-->
        <el-row class="hot-collect-show">
            <el-col :span="6">
                <el-card id="collectPie"></el-card>
            </el-col>

            <el-col :span="14">
                <el-card id="collectBar"></el-card>
            </el-col>
        </el-row>



    </div>



</template>

<script>

import * as echarts from 'echarts/core';
import {
    TitleComponent,
    GridComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';

import { LineChart } from 'echarts/charts';
import { BarChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    GridComponent,
    TooltipComponent,
    CanvasRenderer,
    UniversalTransition,
    LabelLayout,
    LegendComponent,
    LineChart,
    BarChart,
    PieChart,
]);

export default {
    name: "DataShow",

    data(){
        return{
            totalClick: '-',
            weekClick: '-',
            weeklyData: [],
            collectInfo: [],
        }
    },

    methods: {
        // 初始数据拉取
        getClickData(){
            this.getRequest('/collect/count/info').then(resp => {
                if(resp.success){
                    this.totalClick = resp.data.totalClick;
                    this.weekClick = resp.data.weekClick;
                    this.weeklyData = resp.data.data;
                    this.initWeeklyDateLine();
                }
            })

        },

        // 获取书签及其点击量
        getCollectInfo(){
            this.getRequest('/collect/pre').then(resp => {
                if(resp.success){
                    this.collectInfo = resp.data;
                    this.initCollectBar();
                    this.initCollectPie();
                }
            })
        },

        // 配置近七日点击量展示表格
        initWeeklyDateLine(){
            const chartDom = document.getElementById('weeklyClick');
            const myChart = echarts.init(chartDom);
            let option;
            let weekly = this.weeklyData;

            // 数据处理
            let click = [];
            for (let i = 0; i <weekly.length; i++) {
                click.push(parseInt(weekly[i].click));
            }

            let date = []
            for (let i = 0; i <weekly.length; i++) {
                date.push(weekly[i].date)
            }

            // 翻转数组
            click.reverse();
            date.reverse();

            option = {
                title: {
                    text: '七日访问量',
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#679bdc',
                        fontStyle: 'normal',

                    },
                    x: 'center',
                    top: 10,
                },
                xAxis: {
                    type: 'category',
                    data: date
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '访问量',
                        type: 'line',
                        smooth: true,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 8,
                        data: click,
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(32, 33, 36,.7)',
                    borderColor: 'rgba(32, 33, 36,0.20)',
                    borderWidth: 1,
                    textStyle: { // 文字提示样式
                        color: '#fff',
                        fontSize: '12'
                    },
                    axisPointer: { // 坐标轴虚线
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                }
            };

            option && myChart.setOption(option);
            document.getElementById("weeklyClick").removeAttribute('_echarts_instance_');
        },

        // 配置各书签访问量
        initCollectBar(){
            const chartDom = document.getElementById('collectBar');
            const myChart = echarts.init(chartDom);
            let option;
            let info = this.collectInfo;

            let titles = [];
            for (let i = 0; i < info.length; i++) {
                titles.push(info[i].title);
            }

            let click = [];
            for (let i = 0; i < info.length; i++) {
                click.push(parseInt(info[i].click));
            }

            option = {
                title: {
                    text: '访问量总览',
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#679bdc',
                        fontStyle: 'normal',
                    },
                    x: 'center',
                    top: 10,
                },
                xAxis: {
                    type: 'category',
                    data: titles
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: click,
                        type: 'bar'
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(32, 33, 36,.7)',
                    borderColor: 'rgba(32, 33, 36,0.20)',
                    borderWidth: 1,
                    textStyle: { // 文字提示样式
                        color: '#fff',
                        fontSize: '12'
                    },
                }
            };

            option && myChart.setOption(option);
            document.getElementById("collectBar").removeAttribute('_echarts_instance_');
        },

        initCollectPie(){
            const chartDom = document.getElementById('collectPie');
            const myChart = echarts.init(chartDom);
            let option;
            let info = this.collectInfo;

            let data = [];
            for (let i = 0; i < info.length; i++) {
                let o = {};
                o.value = parseInt(info[i].click);
                o.name = info[i].title;
                data.push(o);
            }

            option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '访问量',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }
                ]
            };

            option && myChart.setOption(option);
            document.getElementById("collectPie").removeAttribute('_echarts_instance_');
        }
    },

    mounted() {
        this.getClickData();
        this.getCollectInfo();
    }
}
</script>

<style scoped>
/*整体页面布局*/
.data-view {
    width: 100%;
    height: 100%;
}

/*书签点击量概况*/
.collect-click {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

/* 总点击量展示 */
.total-click {
    height: 220px;
    width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 数字统计显示 */
.num {
    font-size: 35px;
    color: #679bdc;
    font-weight: bold;
    text-align: center
}

/* 数字描述 */
.data-description{
    color: #679bdc;
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
}

/*近七天点击量统计*/
.weekly-click {
    height: 220px;
    width: 100%;
}

/*热门书签统计*/
.hot-collect-show {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

#collectBar {
    height: 320px;
    width: 100%;
}

#collectPie{
    width: 350px;
    height: 320px;
}

</style>