<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    class="form"
  >
  <el-form-item class="form-item" prop="username"> 
      <el-input
        placeholder="用户名/手机号"
        v-model="form.username"     
      >
      </el-input>
    </el-form-item>
  <el-form-item class="form-item" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model="form.password"
      >
    </el-input>
    </el-form-item>
        <p class="form-text">
            <nuxt-link to="#">忘记密码</nuxt-link>
        </p>
    <el-button class="submit" type="primary" @click="handlerLoginSubmit">登录</el-button>
    
  </el-form>
</template>

<script>
export default {
    data () {
        return {
            form:{
                username:'',
                password:''
            },
            rules:{
                username:[{required:true,message:'输入不能为空',trigger:'blur'}],
                password:[{required:true,message:'输入不能为空',trigger:'blur'}]
            }
        }
    },
    methods: {
        handlerLoginSubmit(){
            this.$refs["form"].validate((valid)=>{
                if(valid){
                this.$store.dispatch('user/login',this.form).then(res=>{
                    this.$message.success('登录成功')
                    setTimeout(() => {
                        this.$router.replace('/')
                    }, 1000);
                })
                }else{
                    return false;
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>
