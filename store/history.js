export const state =()=>({
    // 存储返回的数据
   list:[

   ]
})

export const mutations= {
    addHistoryItem(state,data){
        state.list.push(data);
    }
}