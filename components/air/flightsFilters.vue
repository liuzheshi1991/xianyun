<template>
  <div class="filters">
      <el-row type="felx" class='filters-top' justify="space-between" align="center">
          <el-col :span="8">
              单程：
              {{data.info.departCity}} - {{data.info.destCity}}
              /
              {{data.info.departDate}}
          </el-col>
          <el-col :span="4">
              <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="runfilters">
                    <el-option v-for="(item,index) in data.options.airport" :key="index"
                    :label="item"
                    :value="item"
                    >
                    </el-option>
                </el-select>
          </el-col>
           <el-col :span="4">
                <el-select size="mini" v-model="flightTimes"  placeholder="起飞时间" @change="runfilters">
                    <el-option
                    v-for="(item,index) in data.options.flightTimes" :key="index"
                    :label="`${item.from}:00-${item.to}:00`"
                    :value="`${item.from},${item.to}`"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                  <el-select size="mini" v-model="company" placeholder="航空公司" @change="runfilters">
                    <el-option
                        v-for="(item, index) in data.options.company"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="airSize" placeholder="机型" @change="runfilters">
                    <el-option
                    v-for="(item,index) in sizeOption " :key="index"
                    :label="item.name"
                    :value="item.size">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <div class="filter-cancel">
            筛选：
            <el-button 
                       type="primary" 
                       round 
                       plain 
                       size="mini" 
                       @click="handleFiltersCancel">
                撤销
    		</el-button>
        </div>
  </div>
</template>

<script>
export default {
    props: ["data"],
    data () {
        return {
                //机型
                sizeOption:[
                {name:'大',size:'L'},
                {name:'中',size:'M'},
                {name:'小',size:'S'},
                ],
                airport:'',
                flightTimes:'',
                airSize:'',
                company:''

        }
    },
    methods: {
        //封装4个筛选事件发送最终的数据
        runfilters(){
            let newData = this.data.flights
            if(this.airport){
               newData=this.hangdleAirport(newData)
            }
             if(this.flightTimes){
                newData=this.handleFlightTimes(newData)
            }
             if(this.airSize){
               newData= this.handleAirSize(newData)
            }
             if(this.company){
               newData= this.handleCompany(newData)
            }
        //   将所有过滤器都放在一起做一遍, 每一次前一个过滤器过滤完的结果应该是后一个过滤器的数据输入
        // 最后才一次执行更新数据操作
            this.$emit('sendNewDate',newData)
        },
        //筛选飞机场事件触发
        hangdleAirport(oldData){
          var newData = oldData.filter(
              
             v=> v.org_airport_name==this.airport
              
          )
          return newData
        },
        //起飞筛选事件触发
        handleFlightTimes(oldData){
        
             var newData = oldData.filter(v=>{
                var depHour=+v.dep_time.split(':')[0]
                var before = this.flightTimes.split(',')[0]
                var after = this.flightTimes.split(',')[1]
               
                return before<=depHour&&depHour<after
             }
            )
              return newData
        },
        //选中航空公司事件触发
        handleCompany(oldData){
            var newData = oldData.filter(
            element => element.airline_name == this.company
          )
          return newData
        },
        //飞机机型筛选事件触发
        handleAirSize(oldData) {
      var newData = oldData.filter(
        element => element.plane_size == this.airSize
      );
      return newData;
    },
        //清楚筛选
        handleFiltersCancel(){
            this.airport='',
            this.flightTimes='',
            this.airSize='',
            this.company=''
            this.runfilters()
        }
    }
}
</script>

<style scoped lang="less">
    .filters{
        margin-bottom:20px;
    }

    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }

    .filter-cancel{
        margin-top:10px;
    }
</style>