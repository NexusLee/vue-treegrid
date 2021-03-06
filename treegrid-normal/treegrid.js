Vue.component('treegrid', {
    template: '<table class="table table-bordered tree-grid">\
                    <thead>\
                        <tr>\
                            <th>标题</th>\
                            <th>姓名</th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                        <tr v-for="(item, index) in items" v-show="show(item)" :class="\'level-\' + item.grade">\
                            <td>\
                                <i v-if="item.children" class="indented glyphicon" :class="{\'glyphicon-plus\':!item.expanded,\'glyphicon-minus\':item.expanded }" @click="toggle(index,item)"></i>\
                                <i v-else class="indented fa fa-files-o "></i>\
                                <a class="indented" style="display:inline-block;">{{item.text}}</a>\
                            </td>\
                            <td>\
                                {{item.name}}\
                            </td>\
                        </tr>\
                    </tbody>\
                </table>',
    props:['items'],
    data: function () {
        return {
        }
    },
    mounted() {
        let me = this;
        let initItems = [];
        if(me.items){
            initData(me.items,1,null);
            //me.items = initItems;
            this.$emit('data-change', initItems);
        }

        function initData(items,level,parent){
            let spaceHtml = "";
            for(var i=1;i<level;i++){
                spaceHtml+="";
            }
            _.each(items,function(item,index){
                item = Object.assign({},item,{"parent":parent,"level":level,"spaceHtml":spaceHtml});
                if((typeof item.expanded)=="undefined"){
                    item = Object.assign({},item,{"expanded":false});
                }
                if((typeof item.show) == "undefined"){
                    item = Object.assign({},item,{"isShow":false});
                }
                item = Object.assign({},item,{"load":(item.expanded?true:false)});
                initItems.push(item);
                if(item.children && item.expanded){
                    initData(item.children,level+1,item);
                }
            });
        }

    },
    computed:{

    },
    methods:{
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
            if(item.children){
                if(item.expanded){
                    item.expanded = !item.expanded;
                    me.close(index,item);
                }else {
                    item.expanded = !item.expanded;
                    if(item.load){
                        me.open(index,item);
                    }else {
                        item.load = true;
                        _.each(item.children,function(child,childIndex){
                            me.items.splice((index+childIndex+1),0,child);
                            Vue.set(me.items[index+childIndex+1],'parent',item);
                            //Vue.set(me.items[index+childIndex+1],'level',level);
                            Vue.set(me.items[index+childIndex+1],'spaceHtml',spaceHtml);
                            Vue.set(me.items[index+childIndex+1],'isShow',true);
                            Vue.set(me.items[index+childIndex+1],'expanded',false);
                        });
                    }
                }


            }
        },
        test:function(){
            console.log(this.items);
        },
        open:function(index,item){
            let me = this;

            if(item.children){
                open(index,item.children);
            }

            function open(index,items){
                _.each(items,function(child,childIndex){
                    child.isShow = true;
                    if(child.children){
                        open(index+childIndex+1,child.children);
                    }
                });
            }
        },
        close:function(index,item){
            let me = this;
            //debugger;
            if(item.children){
                close(index,item.children);
            }

            function close(index,items){
                _.each(items,function(child,childIndex){
                    child.isShow = false;
                    if(child.children){
                        close(index+childIndex+1,child.children);
                    }
                });
            }
        }
    }
})
//</script>
