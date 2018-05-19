const cwd = __dirname + '/../../';
const fs = require('fs');
const config = {};
const getdirs = (path, callback) => {
	fs.readdir(path, (err, files) => {
		if (!err) {
			const dirs = [];
			for (let file of files) {
				if (fs.statSync(path + file).isDirectory) {
					dirs.push(file);
				}
			}
			callback(dirs);
		}
	});
};
const updateConfig = cfg => {
	let str;
	if (cfg.options) {
		str = cfg.options[cfg.value];
	}
	else if (typeof cfg.value === 'number' && cfg.value > 99999) {
		str = cfg.value.toExponential();
	}
	else {
		str = cfg.value.toString();
	}
	const node = cfg.node.firstChild.firstChild;
	node.innerHTML =  cfg.id + ' = ';
	create('span', str, node);
};

const navProject = document.querySelector('#nav-project');
const navRun = document.querySelector('#nav-run');
const mainConfig = document.querySelector('#main-config');
const loadProject = global.loadProject = name => {
	navProject.lastChild.lastChild.innerHTML = name;
	const project_dir = cwd + 'projects/' + name + '/';
	fs.readFile(project_dir + 'config.ini', 'utf8', (err, data) => {
		const lines = data.split('\n');
		for (let line of lines) {
			if (line.indexOf('#') != -1) {
				line = line.slice(0, line.indexOf('#'));
			}
			if (line.indexOf('=') != -1) {
				line = line.replace(/ /g, '').split('=');
				const cfg = config[line[0]];
				if (cfg) {
					switch(cfg.type) {
						case 'int': case 'list': cfg.value = parseInt(line[1]); break;
						case 'float': cfg.value = parseFloat(line[1]); break;
						case 'bool': cfg.value = (parseInt(line[1]) != 0); break;
					}
				}
			}
		}

		const menuLayer = document.querySelector('#menu-layer');
		const clickConfig = {
			list(e) {

			},
			int(e) {
				
			},
			float(e) {

			},
			bool() {
				this.cfg.value = !this.cfg.value;
				updateConfig(this.cfg);
			}
		};

		for (let cfg of config.entries) {
			if (cfg.type === 'seperator') {
				cfg.node = create('.seperator', mainConfig);
				create('', cfg.name, cfg.node);
			}
			else if (cfg.id) {
				cfg.node = create(mainConfig, clickConfig[cfg.type]);
				cfg.node.cfg = cfg;
				const text = create(cfg.node);
				create(text);
				create('', cfg.name, text);
				updateConfig(cfg);
			}
		}

		if (config.mode) {
			navRun.lastChild.lastChild.innerHTML = config.mode.options[config.mode.value];
		}
	});
};

fs.readFile(cwd + 'gui/config.json', 'utf8', (err, data) => {
	data = JSON.parse(data);
	config.entries = data;
	for (let entry of data) {
		if (entry.id) {
			config[entry.id] = entry;
		}
	}
	if (localStorage.getItem('inv.cu_project')) {
		loadProject(localStorage.getItem('inv.cu_project'));
	}
	else {
		getdirs(cwd + 'projects/', dirs => {
			loadProject(dirs[0]);
		});
	}
});