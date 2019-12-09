<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->

                <FlightsFilters :data="cacheFlightsData" @sendNewDate="sendNewDate"/>
             
                
                <!-- 航班头部布局 -->
                <FlightsListHead />
                
                
                <!-- 航班信息 -->
                <div>
                  <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item"/>
                  <el-row  type="flex" justify="center">
                <el-pagination
                    v-if="dataList.length>0"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[2, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="flightsData.flights.length">
                    </el-pagination>
                      <div v-else-if="!loading">
                      本页暂无数据
                         </div>
                  </el-row>
                
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <FlightsAside/>
            </div>
        </el-row>
    </section>
</template>

<script>

import moment from "moment";
import FlightsListHead from '@/components/air/flightsListHead.vue'
import FlightsItem from '@/components/air/flightsItem.vue'
import FlightsFilters from '@/components/air/flightsFilters.vue'
import FlightsAside from '@/components/air/flightsAside.vue'
export default {
  
    components: {
        FlightsListHead,
        FlightsItem,
        FlightsFilters,
        FlightsAside
    },
    data(){
        return {
            loading: true,
            cacheFlightsData: {
            flights: [],
            info: {},
            options: {}
            }, // 缓存原始航班总数据
            flightsData: {
                flights:[],
                info:{},
                options:{}
            }, // 航班总数据
            // dataList: []  ,   // 航班列表数据，用于循环flightsItem组件，单独出来是因为要分页
            pageSize:10,
            pageIndex:1
        }
    },
    computed: {
        dataList(){
            var start = (this.pageIndex-1)*this.pageSize
            var end = start+this.pageSize
            return this.flightsData.flights.slice(start, end);
        }
    },
    watch: {
        "$route"(){
             this.loadPageDate()
        }
    },
    mounted () {
     
         this.loadPageDate()
    },
    methods: {
        //封装获取数据
        loadPageDate(){
        this.$axios({
        url:'/airs',
        params:this.$route.query
       }).then(res=>{
           console.log(res);
           this.flightsData=res.data
        //    this.dataList= this.flightsData.flights
        this.cacheFlightsData = {...this.flightsData}
         this.loading= false
       })
        },
        //子组件传来的筛选事件触发
        sendNewDate(newData){
            console.log(123);
            this.flightsData.flights=newData
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
        },
        handleCurrentChange(pageIndex){
            this.pageIndex = pageIndex
        }
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>