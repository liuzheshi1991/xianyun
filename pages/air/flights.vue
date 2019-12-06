<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                    
                </div>
                
                <!-- 航班头部布局 -->
                <FlightsListHead/>
                
                
                <!-- 航班信息 -->
                  <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item"/>
                  <el-row  type="flex" justify="center">
                <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="flightsData.total">
    </el-pagination>
                  </el-row>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
            </div>
        </el-row>
    </section>
</template>

<script>

import moment from "moment";
import FlightsListHead from '@/components/air/flightsListHead.vue'
import FlightsItem from '@/components/air/flightsItem.vue'
export default {
    components: {
        FlightsListHead,
        FlightsItem
    },
    data(){
        return {
            flightsData: {
                flights:[]
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
           return this.flightsData.flights.slice(start,end)
        }
    },
    mounted () {
       this.$axios({
           url:'/airs',
           params:this.$route.query
       }).then(res=>{
           console.log(res);
           this.flightsData=res.data
        //    this.dataList= this.flightsData.flights
       })
    },
    methods: {
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