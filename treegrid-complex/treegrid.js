Vue.component('treegrid', {
    template: '<table class="table table-bordered tree-grid">\
                    <tbody>\
                        <tr v-for="(item, index) in currentItems" v-show="show(item)" :class="\'level-\' + item.grade">\
                            <td style="text-align: left;padding-left: 20px">\
                                <a><i v-if="item.children && item.children.length>0" class="indented glyphicon" :class="{\'glyphicon-plus\':!item.expanded,\'glyphicon-minus\':item.expanded }" @click="toggle(index,item)"></i></a>\
                                <a class="indented" style="display:inline-block;">{{item.text}}</a>\
                                </i>\
                            </td>\
                            <td>\
                            {{item.name}}\
                            </td>\
                        </tr>\
                    </tbody>\
                </table>',
    props:['items'],
    created() {
    },
    data() {
        return {
            initialized: false,
            currentItems: []
        }
    },
    mounted() {
    },
    watch: {
        "items": {
            handler (newVal, oldVal){
                if(!this.initialized){
                    this.initialized = true;
                    this.currentItems = []
                    this.initItems(newVal);
                }else{
                    this.updateItems(newVal);
                }
            },
            deep: true
        },
        "currentItems": {
            handler (newVal, oldVal){
            },
            deep: true
        }
    },
    computed:{

    },
    methods:{
        initItems: function(items){
            let me = this;
            if(items){
                initData(items,1,null);
            }

            function initData(items, level, parent) {
                let spaceHtml = "";
                for (var i = 1; i < level; i++) {
                    spaceHtml += "";
                }
                [].forEach.call(items, function (item, index) {
                    item = Object.assign({},item,{"parent":parent,"level":level,"spaceHtml":spaceHtml});
                    if((typeof item.expanded)=="undefined"){
                        item = Object.assign({},item,{"expanded":false});
                    }
                    if((typeof item.show) == "undefined"){
                        item = Object.assign({},item,{"isShow":false});
                    }
                    item = Object.assign({},item,{"load":(item.expanded?true:false)});

                    me.currentItems[index] = JSON.parse(JSON.stringify(item));
                });
            }
        },
        updateItems: function(items){
            let me = this, temp = [], sortedOriginItems = [], sortedItems = [], sortedItemsIds = [];

            sortOriginItems(items);

            //treegrid数组同步children
            me.currentItems.map(function(item, index){
               if(item.grade === 0){
                   temp.push(item);
               }
            });

            //同步最外层目录
            items.map(function(el, idx){
                var ids = [];
                me.currentItems.map(function(item,index){
                    ids.push(item.id)
                });

                if((ids.toString()).indexOf(el.id) === -1){
                    me.currentItems.push(structing(el, 1, null));
                }
            });

            sortCurrentItems(temp);

            //同步数组children
            let childIndex = 0;
            me.currentItems.map(function(item, index){
                childIndex = 0;
                if(item.children){
                    sortedOriginItems.map(function(el, idx){
                        if(el.id === item.id){
                            item.children = el.children;
                        }
                    })
                }
                if(item.load){
                    sortedOriginItems.map(function(el, idx){
                       if(el.parentId === item.id){
                           childIndex ++;
                           var isExitItem = getLoadedItem(el.id);
                           if(!isExitItem) {
                               me.currentItems.splice((index + childIndex), 0, el);
                               Vue.set(me.currentItems[index + childIndex], 'isShow', true);
                               Vue.set(me.currentItems[index + childIndex], 'expanded', false);
                               Vue.set(me.currentItems[index + childIndex], 'parent', item);
                               Vue.set(me.currentItems[index + childIndex], 'spaceHtml', "");
                           }
                       }
                   })
               }

                me.currentItems.map(function(item1, index1){
                    if(item1.parentId === item.id){
                        if((sortedItemsIds.toString()).indexOf(item1.id) == -1){
                            me.currentItems.splice((index1), 1);
                        }
                    }
                })
            });

            //给原数组排序,添加到新数组中
            function sortCurrentItems(items){
                items.map(function(item, index){
                    sortedItems.push(item);
                    sortedItemsIds.push(item.id)
                    if(item.children)
                        sortCurrentItems(item.children);
                })
            }

            //获取已加载项
            function getLoadedItem(id){
                var item = null;
                me.currentItems.map(function(el, index){
                    if(el.id === id){
                       item = el;
                    }
                })
                return item;
            }

            //获取列表数据
            function sortOriginItems(items){
                items.map(function(item, index){
                    sortedOriginItems.push(item);
                    if(item.children)
                        sortOriginItems(item.children);
                })
            }

            //初始化数据
            function structing(item, level, parent){
                item = Object.assign({},item,{"parent":parent,"level":level,"spaceHtml":""});
                if((typeof item.expanded)=="undefined"){
                    item = Object.assign({},item,{"expanded":false});
                }
                if((typeof item.show) == "undefined"){
                    item = Object.assign({},item,{"isShow":true});
                }
                item = Object.assign({},item,{"load":(item.expanded?true:false)});

                return item;
            }

        },
        show:function(item){
            return ((item.level==1) || (item.parent && item.parent.expanded && item.isShow));
        },
        toggle:function(index,item){
            let me = this;
            let level = item.level+1;
            let spaceHtml = "";
            for(var i=1;i<level;i++){
                spaceHtml+="<i class='fa fa-files-o'></i>";
            }
            if (item.children) {
                if(item.expanded){
                    item.expanded = !item.expanded;
                    me.close(index, item);
                }else {
                    item.expanded = !item.expanded;
                    if(item.load){
                        me.open(index,item);
                    }else {
                        item.load = true;
                        [].forEach.call(item.children, function (child, childIndex) {
                            me.currentItems.splice((index+childIndex+1),0,child);
                            Vue.set(me.currentItems[index+childIndex+1],'parent',item);
                            Vue.set(me.currentItems[index+childIndex+1],'spaceHtml',spaceHtml);
                            Vue.set(me.currentItems[index+childIndex+1],'isShow',true);
                            Vue.set(me.currentItems[index+childIndex+1],'expanded',false);

                        });
                    }
                }
            }
        },
        test:function(){
            console.log(this.currentItems);
        },
        open:function(index,item){
            let me = this;

            if (item.children) {
                open(index, item.children);
            }

            function open(index,items){
                [].forEach.call(items,function(child,childIndex){
                    me.currentItems[index+childIndex+1].isShow = true;
                });
            }
        },
        close:function(index,item){
            let me = this;
            if (item.children) {
                close(index, item.children);
            }

            function close(index,items){
                [].forEach.call(items,function(child,childIndex){
                    me.currentItems[index+childIndex+1].isShow = false;
                });
            }
        }
    }
})
