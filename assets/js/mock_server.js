(function() {

	var server = sinon.fakeServer.create();
	server.autoRespondAfter = 500;

	server.respondWith('GET', '/api/category', function(xhr) {
		xhr.respond(200, {
			'Content-Type': 'application/json'
		}, 'hoge');
	});


})();