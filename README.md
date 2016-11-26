# vue-treegrid
![image](https://github.com/NexusLee/vue-treegrid/raw/master/screenshots/EFEEEC99-0B77-4DD1-B0D0-E1F932897F5B.png)
```
<treeGrid :items="data" v-on:data-change="listenToMessage"></treeGrid>

data:function(){
  return {
    data:[
      {"id":"1","text":"商品管理","name":"name1","grade": "0",
          "children":[
              {"id":"11","text":"商品列表","name":"name2","grade": "1"},
              {"id":"12","text":"添加新商品","name":"name3","grade": "1"},
              {"id":"13","text":"商品分类","name":"name4","grade": "1","children":[
                  {"id":"131","text":"商品列表1","name":"name11","grade": "2","children":[
                      {"id":"1311","text":"商品列表13","name":"name1311","grade": "3"}
                  ]}
              ]}
          ]
      },
      {"id":"2","text":"2","name":"name5","grade": "0",
          "children":[
              {"id":"21","text":"商品列表2","name":"name5","grade": "1"},
          ]
      }
    ]
  }
},
components:{
  treeGrid:treeGrid
},
methods: {
  listenToMessage: function(data){
      this.data = data;
  }
}

```




ps:不要怪样式不对，群友说了，谁用谁写样式 :(

