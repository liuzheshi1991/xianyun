<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(user,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select"  v-model='user.username'>
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model='user.id'>
              <el-select slot="prepend" value="1" placeholder="请选择" >
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDelUsers(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
          <el-checkbox-group v-model="insurance">
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox :label="item.id" border>{{item.type}}：￥{{item.price}}/份×1  最高赔付{{item.compensation}}</el-checkbox>
        </div> 
          </el-checkbox-group>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入手机号" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handlerSubmit">提交订单</el-button>
        <span v-show="false">{{allPrice}}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
    props: ["data"],
    data () {
        return {
            insurance:[],
            users:[{username:'',id:''}],
            contactPhone:'',
            contactName:'',
            captcha:''
        }
    },
    computed: {
        allPrice(){
            var res = this.data.base_price
            var len = this.users.length
            res+= res*(len-1) //机票基础金额
            this.insurance.forEach(id=>{
                //这个id 是我们选中的id
                this.data.insurances.forEach(item=>{
    //这个item是数据所有的对象，如果这个数据的对象id等于我们选中的id的话就将价格加上去
                    if (item.id==id) {
                        res+=item.price*len
                    }
                })
            })
            //机场建设和燃油
            res+=this.data.airport_tax_audlet*len
            //子传父数据
            this.$emit('changeForm',{numUsers:len,allPrice:res})
            return res
        }
    },
    methods: {
        //手机验证码
        handleSendCaptcha(){
           if(!this.contactPhone) {
               return
           }
             this.$axios({
        url: `captchas`,
        method: "POST",
        data: {
            tel: this.contactPhone
        }
    }).then(res=>{
        let {code} = res.data
        this.$confirm(`获取到的验证码是${code}`, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
        })
    })
        },
        //添加乘机人
        handleAddUsers(){
            this.users.push({name:'',id:''})
        },
        //删除乘机人
        handleDelUsers(index){
          this.users.splice(index,1)
        },
        //提交按钮事件
        handlerSubmit(){
          
          var orderData = {
              users:this.users,
              insurances:this.insurance,
              contactName:this.contactName,
              contactPhone:this.contactPhone,
              invoice:false,
              seat_xid:this.$route.query.seat_xid,
              air:this.data.id,
              captcha:this.captcha
          }
          const token = this.$store.state.user.userInfo.token
            if(!token){
                this.$message({
                    message:'请先登录',
                    type:'error'
                })
                this.$router.push({
                    path:'/user/login'
                })
                return
            }
             this.$axios({
        url: "/airorders",
        method: "post",
        data: orderData,
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res=>{
                console.log(res.data);
            })
        .catch(err=>{
            const {message} = err.response.data
            this.$confirm(message,'提示',{
                confirmButtonText:'确定',
                showCancelButton:false,
                type:'error'
            })
        }
            
        )
        }
    }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>