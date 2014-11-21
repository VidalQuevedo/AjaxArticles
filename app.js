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
			
			req.open('get', 'http://www.corsproxy.com/www.whitehouse.gov/facts/json/all/college%20affordability', true);
			
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
				this.data.sort(this.compareArticleTitles);
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
		},
		compareArticleTitles: function(a,b){
			
			a.url_title = this.addTitleCase(a.url_title);
			b.url_title = this.addTitleCase(b.url_title);

			if (a.url_title < b.url_title) {
				return -1;
			} else if (a.url_title > b.url_title) {
				return 1;
			} else {
				return 0;
			}
		},
		addTitleCase: function(str) {
			return str.split(' ').forEach(function(word){
				return word.charAt(0).toUpperCase() + word.substr(1);
			}).join(' ');
		}
	};

	app.articleList = new ArticleList(); // attaching ArticleList to the global app object allows to keep it separate from other units.

})(window.app = window.app || {});