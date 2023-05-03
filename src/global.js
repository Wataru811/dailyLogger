

class Global {
	constructor() {
		//this.projects = [];
		this.projs = [];
		this.path = "";
		this.author = ""
		//this.restore();
	}
	/*
		restore() {
			console.log(store.get('projects', {}));
			this.projs = store.get('projects', {});
			this.author = store.get('author', "");
			this.path = store.get('path', "~/.electron-user/");
		}
		store() {
			store.set('projects', this.projs)
			store.set('path', this.path)
			store.set('author', this.author)
		}
	*/

	addProj(name, path) {
		this.projs[name] = path;
		console.log(this.projs)
		//this.store()
	}
	setSysPath(path) {
		this.path = path;
		//this.store()
	}
	setSysAuthor(author) {
		this.author = author;
		//this.store()
	}



	delProj(name) {
		delete this.projs[name];
		console.log(this.projs)
		//this.store();
	}

	getProjs() {
		return this.projs;
		//return Object.keys(this.projs).sort();
	}
}

module.exports = Global