<template>
  <div class="aside">
      <div class="air-info">
          <el-row type="flex" justify="space-between" class="info-top">
              <div>{{data.dep_date}}</div>
              <div>{{data.org_city_name}}-{{data.dst_city_name}}</div>
          </el-row>
           <el-row type="flex" justify="space-between" class="info-step" align="center">
               <el-col :span="5" class="flight-airport">
                   <strong>{{data.dep_time}}</strong>
                   <span>{{data.org_airport_name}}{{data.org_airport_quay}}</span>
               </el-col>
               <el-col :span="14" class="flight-time">
                   <span>{{runkTime}}</span>
                   <span>{{data.airline_name}}{{data.flight_no}}</span>
               </el-col> 
                <el-col :span="5" class="flight-airport">
                     <strong>{{data.arr_time}}</strong>
                   <span>{{data.dst_airport_name}}{{data.dst_airport_quay}}</span>
                </el-col>
           </el-row>
      </div>
      <el-row type="flex" justify="space-between" class="info-bar">
          <span>订单总价</span>
          <span>金额</span>
          <span>数量</span>
      </el-row>
      <el-row type="flex" justify="space-between" class="info-bar">
          <span>成人机票</span>
          <span>{{data.base_price}}</span>
          <span>x{{asideData.numUsers}}</span>
      </el-row>
        <el-row type="flex" justify="space-between" class="info-bar">
          <span>基建+燃油</span>
          <span>￥{{data.airport_tax_audlet}}/人/单程</span>
          <span>x{{asideData.numUsers}}</span>
      </el-row>
        <el-row type="flex" justify="space-between" class="info-bar">
          <span>应付总额</span>
          <span class="price">￥{{asideData.allPrice}}</span>
      </el-row>
  </div>
</template>

<script>
export default {
    props: ["data","asideData"],
    computed: {
        runkTime(){
            //数据还没传过来 就给他一个空
            if(!this.data.dep_time) return "";
            //转化分钟
            var dep = this.data.dep_time.split(':')
            var arr = this.data.arr_time.split(':')
            //注意 + 号是拼接字符串 
            var depVal= dep[0]*60+ +dep[1]
            var arrVal= arr[0]*60+ +arr[1]
            //相减得到分钟
            let dis = arrVal-depVal;
            //如果是第二天凌晨需要加上24小时
            if(dis<0){
                dis = arrVal + 24*60 - depVal
            }
            //得到相差时间进行拼接
            return `${Math.floor(dis/60)}时${dis%60}分`
        }
    }
}
</script>

<style scoped lang="less">
/*aside*/
.aside{
    width: 350px;
    height: fit-content;
    border:1px #ddd solid;
}

.air-info{
    padding:15px;

    .info-top{
        margin-bottom:10px;
        > div:last-child{
            font-size:14px;
        }
    }

    .info-step{
        .flight-airport{
            strong{
                display: block;
                font-size: 22px;
                font-weight: normal;
            }

            span{
                font-size: 12px;
                color:#999;
            }
        }

        .flight-time{
            text-align: center;
            font-size: 12px;
            color:#999;
            span{
                display: block;
            }
        }
    }
}

.info-bar{
    border-top:1px #ddd dashed;
    padding: 10px 15px;
    font-size: 14px;
    color: #666;

    .price{
        font-size:28px;
        color: orange;
    }
}
</style>