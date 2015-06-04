$(function(){
var model = {
	init : function(){
		if( !localStorage.notes ){
			localStorage.notes = JSON.stringify([]);
		}
	},
	getAllData : function(){
		if( localStorage.notes ){
			return JSON.parse(localStorage.notes);
		}
	},
	addData : function(obj){
		var data = JSON.parse(localStorage.notes);
		data.push(obj);
		localStorage.notes = JSON.stringify(data);
	},
	createNode : function(data,id){
		return { content : data , done : false , id : id }
	},
	lastId :function(){
		if( localStorage.notes ){
			if(JSON.parse(localStorage.notes).length == 0){
				return 0;
			}
			else
				return parseInt((JSON.parse(localStorage.notes)[ (JSON.parse(localStorage.notes).length) - 1]).id)
		}
	},
	nodeEditModel : function(data,id){
		var fetchedata = this.getAllData();
		fetchedata[id] = data;
		localStorage.notes = JSON.stringify(fetchedata);
	},
	deleteNote : function(){
		var fetchedata = this.getAllData();
		var tempArray = [];
		fetchedata.map(function(value,index){
			if(!value.done){
				tempArray.push(value);
			}
		});
		localStorage.notes = JSON.stringify(tempArray);
	}
};
var view = {
	init : function(){
		this.render();
		$('.todo-form').submit(function(){
			controller.add(  controller.createNote( $('.todo-form input').val() , controller.getId()+1 ) );
		});
	},
	render : function(){
		//var uniqueId = controller.getId();
		var completeCount = 0;
		var totalRecords = 0;
		var contentStr = '';
		if( localStorage.notes ){
			$.each(controller.getTodos(),function(k,v){
				if(v.done)
					contentStr += '<li class="done">' + v.content + '</li>';
				else
					contentStr += '<li>' + v.content + '</li>';
			});
			$('.todo-list').html(contentStr);
			$.each(controller.getTodos(),function(k1,v1){
				totalRecords++;
				if($('.todo-list li:eq('+k1+')').hasClass('done')){
					completeCount++;
				}
				$('.todo-list li:eq('+k1+')').bind('click',function(id){
					return function(){
						if($(this).hasClass('done'))
							$(this).removeClass('done');
						else
							$(this).addClass('done');
						controller.nodeEdit(id);
						view.render();
					}
				}(k1));
			});
			$('.info-window .complete-count').html('Left Tasks ' + (totalRecords-completeCount));
		}
	}
};
var filterView = {
	init : function(){
		this.render();
	},
	render : function(){
		$('.all').click(function(){
			view.render();
		});
		$('.completed').click(function(){
			view.render();
			$.each($('.todo-list li'),function(k,v){
				if(!$(this).hasClass('done')){
					$(this).remove();
				}
			});
		});
		$('.active').click(function(){
			view.render();
			$.each($('.todo-list li'),function(k,v){
				if($(this).hasClass('done')){
					$(this).remove();
				}
			});
		});
		$('.delete-completed').click(function(){
			controller.deleteTask();
			view.render();
		});
	}
};

var controller = {
	init : function(){
		view.init();
		model.init();
		filterView.init();
	},
	add : function(obj){
		model.addData(obj);
	},
	getTodos : function(){
		return model.getAllData();
	},
	createNote : function(data,id){
		return model.createNode(data,id);
	},
	getId : function(){
		return model.lastId();
	},
	nodeEdit : function(id){
		var allNote = this.getTodos();
		allNote[id].done = !(allNote[id].done);
		model.nodeEditModel(allNote[id],id);
	},
	deleteTask : function(){
		model.deleteNote();
	}
};

controller.init();
})