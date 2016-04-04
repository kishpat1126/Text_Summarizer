
var recallAPI = true;
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    if(localStorage.lastUrl!=null && localStorage.lastUrl==url)
      recallAPI = false;
    else 
      localStorage.setItem("lastUrl", url); 
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

// to get current tab url
getCurrentTabUrl(function(url) {
	// display url in page
  if(!recallAPI){
      $('#pageUrl').append('<a target="_blank" href="' + url + '">' + url + "</a>");
      document.getElementById('summary').textContent = localStorage.summary;
      document.getElementById('url1').href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(localStorage.link1); 
      document.getElementById('url1').textContent = localStorage.link1;
      document.getElementById('url2').href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(localStorage.link2);
      document.getElementById('url2').textContent = localStorage.link2;
      document.getElementById('url3').href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(localStorage.link3);
      document.getElementById('url3').textContent = localStorage.link3;
      return;
  }

	$('#pageUrl').append('<a target="_blank" href="' + url + '">' + url + "</a>");

	// send request to remote API
	$.ajax("https://joanfihu-article-analysis-v1.p.mashape.com/link", {
		headers: {
			'X-Mashape-Key': '55xIXflZQDmshN8xMSDvxvZjkvxyp1kgJmnjsnpTApsY58RELA',
		},
		dataType: 'json',
		data: {
			link: url,
			entity_description: 'False'
		},
		success: function(data, textStatus, jqXHR) {
			// display the text summary in page
			var summaryDiv = document.getElementById('summary');
      console.log(data, textStatus, jqXHR);
			localStorage.summary = data.summary.join(' ');
      summaryDiv.textContent = localStorage.summary;
      console.log(data, textStatus, jqXHR);
      //prints relevant links
      var url1 = encodeURIComponent(data.entities[0]);
      var url1Link = document.getElementById('url1');
      url1Link.textContent = data.entities[0];
      url1Link.href = 'https://en.wikipedia.org/wiki/' + url1;
      localStorage.link1 = data.entities[0];

      var url2 = encodeURIComponent(data.entities[1]);
      var url2Link = document.getElementById('url2');
      url2Link.textContent = data.entities[1];
      url2Link.href = 'https://en.wikipedia.org/wiki/' + url2;
      localStorage.link2 = data.entities[1];

      var url3 = encodeURIComponent(data.entities[2]);
      var url3Link = document.getElementById('url3');
      url3Link.textContent = data.entities[2];
      url3Link.href = 'https://en.wikipedia.org/wiki/' + url3;
      localStorage.link3 = data.entities[2];
		}
	})

});


