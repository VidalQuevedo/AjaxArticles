'use strict';

;(function(app){ 

	function ArticleList(){
		
		this.displayArticleList();
	
	}

	ArticleList.prototype = {
		/**
		 * Bootstraps list.
		 * 
		 */
		displayArticleList: function(){
			this.data = [];
			this.getArticleData(this.buildArticleList);
		},
		/**
		 * Gets article JSON data and renders it via callback
		 * 
		 * @callback function to call after data has been successfully 
		 * parsed
		 *
		 */		
		getArticleData: function(callback){
			var al = this;
			var req = new XMLHttpRequest();
			
			req.open('get', 'http://www.corsproxy.com/www.whitehouse.gov/facts/json/all/college%20affordability', true);
			
			req.onload = function(){ 
				
				// if not done yet, just get out of here
				if (this.readyState != 4) return; 

				// if error status, generate error message
				if (this.status != 200 && this.status != 304) { 
					al.data = [{"Error": this.status + ' - ' + this.statusText}];
				} else {
					
					// if 200 OK, parse and store data
					al.data = JSON.parse(this.responseText);
				}
				
				// render article list
				callback.apply(al);
			};
			
			req.send();
		},
		/**
		 * Populates article list
		 * 
		 */			
		buildArticleList: function(){
			
			var output = '';
			var al = this;
			if (this.data.length === 0) {
				output = 'There are no items to display.';
			} else if (this.data.length === 1 && this.data[0]["Error"]) {
				output = this.data[0]["Error"];
			} else {
				
				// Add Title Case formatting to all titles for better sorting
				this.addTitleCase();
				
				// Order articles by url_title
				this.data.sort(this.compareArticleTitles);

				// Generate output
				this.data.forEach(function(i){
					output+= al.formatArticle(i);
				});
			}

			// Add articles to #article-container
			document.querySelector('#article-container').innerHTML = output;
		},
		/**
		 * Adds title case to article titles
		 * (e.g. 'my article' -> 'My Article')
		 * 
		 */			
		addTitleCase: function() {
			this.data.forEach(function(a){
				a.url_title = a.url_title.split(' ').map(function(word){
					return word.charAt(0).toUpperCase() + word.substr(1);
				}).join(' ');
			});
		},
		/**
		 * Compares article titles and reorders articles accordingly
		 * 
		 * @return int
		 */
		compareArticleTitles: function(a,b){

			if (a.url_title < b.url_title) {
				return -1;
			} else if (a.url_title > b.url_title) {
				return 1;
			} else {
				return 0;
			}
		},
		/**
		 * Adds HTML tags to article data
		 * 
		 * @return string
		 */		
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
			'</article><hr>';

			return output;
		}
	};

	// Instantiate and save Article List instance into app
	app.articleList = new ArticleList();

})(window.app = window.app || {});