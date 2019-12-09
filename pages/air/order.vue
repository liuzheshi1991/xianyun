<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <div class="main">
                <OrderForm :data="data" @changeForm="setAside"/>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <OrderAside :data="data" :asideData="asideData"/>  
            </div>
        </el-row>
    </div>
</template>

<script>
import OrderForm from '@/components/air/orderForm'
import OrderAside from '@/components/air/orderAside'
export default {
    data () {
        return {
            data:{},
            asideData:{
                numUsers:0,
                allPrice:0
            }
        }
    },
    methods: {
        setAside(asideData){
            console.log('价格改变了');
            this.asideData = asideData
        }
    },
    components: {
      OrderForm,
      OrderAside
    },
    mounted () {
        const {query} = this.$route
        this.$axios({
            url:'airs/'+query.id,
            parmas:{
                seat_xid:query.seat_xid
            }
        }).then(res=>{
            console.log(res);
            this.data= res.data
            
        })
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }
</style>