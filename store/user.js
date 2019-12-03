export const state =()=>({
    // 存储返回的数据
    userInfo:{
        token:'',
        user:{}
    }
})

export const mutations={
    // 保存用户的信息到state
    setUserInfo(state,data){
        state.userInfo=data
    },
    clearUserInfo(state,info){
        //把本地储存清空
        localStorage.removeItem('store')
        //把vux清空
        state.userInfo={}
    }
}

export const actions ={
    login({commit},data){
       return this.$axios({
            url:'/accounts/login',
            method:'POST',
            data
        }).then(res=>{
            commit('setUserInfo',res.data)
        })
    }
}