        //As there are limitations for Google Analytics for amount of requests sent per interval of time,
        //large amount of async requests will cause an error response. To handle this,
        //a seek method can be used.

        function getUserData(clientIdArr) {
                    
            return $.Deferred(function(defer){
            
                fetch_user_data(clientIdArr).then(function(data) {
                    
                    defer.resolve(data);
                    
                },function(error){				
                    
                    defer.reject(error);
                });			
            });
        }


        function fetch_user_data(clientIdArr, opt_current_user, opt_user_data) {
			
			var current_user = opt_current_user || 0;
			var user_data = opt_user_data || [];
			
			var clientId = clientIdArr[current_user];
			
			var userObj = {
						
				"viewId": viewId,
				"pageSize": 100000,
				"dateRange": {
					"startDate": "90daysAgo",
					"endDate": "today"
				},
				"user": {						
					"type": "CLIENT_ID",
					"userId": clientId 
				},
				"activityTypes": [
					"PAGEVIEW"
				]
			};
			
			
			return gapi.client.request({

				path: '/v4/userActivity:search',
				root: 'https://analyticsreporting.googleapis.com/',
				method: 'POST',
				body: userObj
				
			}).then(function(resp) {
				
				var userData = {
					clientId: clientId,
					sessions: resp.result.sessions						
				};
				
				user_data.push(userData);
					
				current_user += 1;
				
				if (current_user < clientIdArr.length) {
					return fetch_user_data(clientIdArr, current_user, user_data);
				}
				else {
					return user_data;
				}
			});
		}				
		
		
		function getAccessData(days) {			
			
			return $.Deferred(function(defer){
			
				fetch_access_data(days).then(function(data) {
					
					defer.resolve(data);
					
				},function(error){				
					
					defer.reject(error);
				});			
			});			
		}		
		
		
		function fetch_access_data(days, opt_current_day, opt_access_data) {
			
			var current_day = opt_current_day || 0;
			var access_data = opt_access_data || [];
			
			var date = moment().subtract(current_day + 1, "days").format("YYYY-MM-DD");
			
			return gapi.client.request({

				path: '/v4/reports:batchGet',
				root: 'https://analyticsreporting.googleapis.com/',
				method: 'POST',
				body: {
					reportRequests: [
						{
							viewId: viewId,
							pageSize: 100000,
							dateRanges: [
								{
								startDate: date,
								endDate: date
								}
							],
							dimensions: [],
							metrics: [
								{
								expression: 'ga:pageviews'
								},
								{
								expression: 'ga:sessions'
								},
							]
						}
					]
				}
			}).then(function(resp) {
				
				var obj = {
					date: date,
					data: resp					
				}
				
				access_data.push(obj);
					
				current_day += 1;
				
				if (current_day < days) {
					return fetch_access_data(days, current_day, access_data);
				}
				else {
					return access_data;
				}
			});
		}
		
		
		
		function getCompanyData(options) {
			
			return $.Deferred(function(defer){
			
				fetch_company_data(options).then(function(data) {
					
					defer.resolve(data);
					
				},function(error){				
					
					defer.reject(error);
				});			
			});			
		}
		
		
		
		function fetch_company_data(options, opt_current_day, opt_company_data) {
			
			var params = options;
			var days = options.days;
			var dimArr = options.dimensions;
			
			var dimensions = [];
			
			for (var i=0; i < dimArr.length; i++) {
				
				var dim = {
					"name": dimArr[i]									
				}
				dimensions.push(dim);
			}
			
			
			var current_day = opt_current_day || 0;
			var company_data = opt_company_data || [];
			
			var date = moment().subtract(current_day + 1, "days").format("YYYY-MM-DD");
			
			return gapi.client.request({

				path: '/v4/reports:batchGet',
				root: 'https://analyticsreporting.googleapis.com/',
				method: 'POST',
				body: {
					reportRequests: [
						{
							viewId: viewId,
							pageSize: 100000,
							dateRanges: [
								{
								startDate: date,
								endDate: date
								}
							],
							dimensions: dimensions,
							metrics: [
								{
								expression: 'ga:pageviews'
								},
								{
								expression: 'ga:sessions'
								},
							]
						}
					]
				}
			}).then(function(resp) {
				
				var obj = {
					date: date,
					data: resp					
				}
				
				company_data.push(obj);
					
				current_day += 1;
				
				if (current_day < days) {
					return fetch_company_data(params, current_day, company_data);
				}
				else {
					return company_data;
				}
			});
		}