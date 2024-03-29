<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px">
            <el-form-item label="出发城市">
                <!-- fetch-suggestions 返回输入建议的方法 -->
                <!-- select 点击选中建议项时触发 -->
                <el-autocomplete
                :highlight-first-item ="true"
                v-model="form.departCity"
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                class="el-autocomplete"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="到达城市">
                <el-autocomplete
                :highlight-first-item ="true"
                v-model="form.destCity"
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                class="el-autocomplete"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                v-model="form.departDate"
                placeholder="请选择日期" 
                style="width: 100%;"
                @change="handleDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
import moment from "moment";
export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
                form: {
            departCity: "", // 出发城市
            departCode: "", // 出发城市代码
            destCity: "", // 到达城市
            destCode: "", // 到达城市代码
            departDate: "" // 日期字符串
      }
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
          if(index===1){
            this.$confirm('此功能暂未开放,请选择单程票', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning'
        })
          }
                
        },
        //因为出发地和到达地的输入之后有对应的值出来的逻辑都是一样的，可以封装成一个函数
    querySearchAsync(queryString) {
      return new Promise((resolve, reject) => {
        // 如果关键字是空，则直接返回
        if (!queryString) {
          return resolve([]);
        }

        this.$axios({
          url: `/airs/city`,
          params: {
            name: queryString
          }
        }).then(res => {
          const { data } = res.data;

          // 下拉提示列表必须要有value字段
          const citys = data.map(v => {
            return {
              ...v,
              value: v.name.replace("市", "")
            };
          });
          const cityList = citys.filter(item=>{
            if(item.sort){
              return true
            }
          })
          resolve(cityList);
        });
      });
    },

        // 出发城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        async queryDepartSearch(value, cb){
           var arr = await this.querySearchAsync(value)
           if(arr.length){
             
                this.form.departCode = arr[0].sort;
           }
           cb(arr)
        },

        // 目标城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
       async queryDestSearch(value, cb){
             var arr = await this.querySearchAsync(value)
           if(arr.length){
           
                this.form.destCode = arr[0].sort;
           }
           cb(arr)
        },
       
        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            this.departCode = item.sort
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            this.destCode =item.sort
        },

        // 确认选择日期时触发
        handleDate(value){
          this.form.departDate= moment(value).format('YYYY-MM-DD')
        },

        // 触发和目标城市切换时触发
        handleReverse(){
          var {departCity,departCode,destCity,destCode} = this.form
          this.form.departCity = destCity
          this.form.destCity = departCity
          this.form.departCode = destCode
          this.form.destCode = departCode
        },

        // 提交表单是触发
        handleSubmit(){
         for(var o in this.form){
           if(this.form[o].endsWith('市')){
             this.form[o] = this.form[o].replace('市','')
           }
         }
         this.$store.commit('history/addHistoryItem',this.form)
        
           console.log(this.form),
         this.$router.push({
           path:'/air/flights',
           query:this.form
         })
        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
