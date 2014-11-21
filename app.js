'use strict';

;(function(app){ 

	function ArticleList(){
		
		this.data = [];
		this.getArticleData(this.renderArticleList);

	}

	ArticleList.prototype = {
		getArticleData: function(callback){

			var al = this;
			var req = new XMLHttpRequest();
			
			req.open('get', 'data.json', true);
			
			req.onload = function(){ 
				
				if (this.readyState != 4) return; // if not done yet, just get out of here

				if (this.status != 200 && this.status != 304) { 
					al.data = [{"Error": this.status + ' - ' + this.statusText}];
				} else {
					al.data = JSON.parse(this.responseText);
				}
				
				callback.apply(al);
			};
			
			req.send();
		},
		renderArticleList: function(){
			
			var output = '';
			var al = this;
			if (this.data.length === 0) {
				output = 'There are no items to display.';
			} else if (this.data.length === 1 && this.data[0]["Error"]) {
				output = this.data[0]["Error"];
			} else {
				this.data.forEach(function(i){
					output+= al.formatArticle(i);
				});
			}

			document.querySelector('#article-container').innerHTML = output;
		},
		formatArticle: function(article){
			var output = '<article>' +
			'	<header>' +
			'		<h1>' +
			'			<a href="' + article.url + '"> ' + article.url_title + ' </a>' +
			'		</h1>' +
			'		<p>' +
			'			Body: "' + article.body + '" <br>' +
			'			Category: "' + article.category + '" <br>' +
			'			Path: "' + article.path + '" <br>' +
			'			Type: "' + article.type + '" <br>' +
			'			UID: "' + article.uid + '" <br>' +
			'			URL: "' + article.url + '" <br>' +
			'			URL Title: "' + article.url_title +'" '+ 
			'		</p>' +
			'	</header>' +
			'</article>';

			return output;
		}
	};

	app.articleList = new ArticleList();

})(window.app = window.app || {});