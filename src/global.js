

class Global {
	constructor() {
		//this.projects = [];
		this.projs = [];
		this.person = [];
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
	getProjs() {
		return this.projs;
	}

	addProj(name, path) {
		this.projs[name] = path;
	}

	delProj(name) {
		delete this.projs[name];
	}

	getPersonList() {
		return this.person;
	}

	addPerson(name) {
		this.person.push(name);
	}

	delPerson(name) {
		const index = this.person.indexOf(name);
		if (index > -1) {
			this.person.splice(index, 1);
		}
	}

	setSysPath(path) {
		this.path = path;
		//this.store()
	}
	setSysAuthor(author) {
		this.author = author;
		//this.store()
	}
}

module.exports = Global