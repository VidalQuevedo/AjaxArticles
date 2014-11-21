'use strict';

;(function(app){ 

	function ArticleList(){
		this.data = [];
		this.getArticleData();
		// this.renderArticleList();
	}

	ArticleList.prototype = {
		getArticleData: function(){

			var req = new XMLHttpRequest();
			req.onload = function(){ console.log(this.responseText)};
			req.open('get', 'http://www.corsproxy.com/www.whitehouse.gov/facts/json/all/college%20affordability', true);
			req.send();
		},
		renderArticleList: function(){
			this.data.forEach(function(i){
				console.log(i);
			});
		}
	};

	app.articleList = new ArticleList();

})(window.app = window.app || {});