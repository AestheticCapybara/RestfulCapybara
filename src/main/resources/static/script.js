document.addEventListener("DOMContentLoaded", function() {
	let apiBaseUrl = "http://localhost:8080/restfulCapybara";
	const field = document.getElementById('field');
	const capybaraBaseInterval = 4000;
	const capybaraMaxRandomInterval = 10001;
	let capybaraCount = 0;

	init();

	async function init() {
		getAddress();
		await loadCapybaras();
	}

	// Capybara handling
	async function loadCapybaras() {
		const capybaras = await REST_getCapybaras();
		if (!capybaras) return;
		for (const capybara of capybaras)
			spawnCapybara(capybara.name.name, capybara.id)
	}

	async function createCapybara(parent) {
		const capybara = await REST_newCapybara();
		if (!capybara) return;
		spawnCapybara(capybara.name.name, capybara.id, parent)
	}

	function spawnCapybara(name, id, parent) {
		capybaraCount++;
		const capybara = document.createElement('div');
		const nametag = document.createElement('div');

		capybara.style.top = parent ? parent.style.top : '50%';
		capybara.style.left = parent ? parent.style.left : '50%';
		capybara.classList.add('capybara');
		capybara.id = `capybara${capybaraCount}`;
		capybara.setAttribute('data-id', id);
		capybara.setAttribute('data-name', name);
		capybara.setAttribute('data-moving', "false");

		nametag.textContent = name;
		nametag.classList.add('nametag');
		capybara.appendChild(nametag);

		capybara.onclick = () => capybaraClick(capybara);
		field.appendChild(capybara);

		capybara.addEventListener("transitionstart", () =>
			capybara.setAttribute("data-moving", "true"));
		capybara.addEventListener("transitionend", () =>
			capybara.setAttribute("data-moving", "false"));

		moveCapybara(capybara);

		const interval =
			capybaraBaseInterval + Math.floor(Math.random() * capybaraMaxRandomInterval);
		setInterval(() => moveCapybara(capybara, interval), interval);
	}

	function moveCapybara(capybara) {
		const currentX = parseInt(capybara.style.left, 10);
		const [newX, newY] = getRandomPosition(capybara);
		const nametag = capybara.querySelector('.nametag');

		if (newX > currentX) {
			capybara.style.transform = 'scaleX(-1)';
			nametag.style.transform = 'scaleX(-1)';
		} else if (newX < currentX) {
			capybara.style.transform = 'scaleX(1)';
			nametag.style.transform = 'scaleX(1)';
		}

		capybara.style.left = `${newX}px`;
		capybara.style.top = `${newY}px`;
	}

	function capybaraClick(parent) {
		if (parent && (parent.getAttribute("data-moving") === 'true')) return;
		createCapybara(parent);
		createCapybara(parent);
	}

	function clearField() {
		REST_deleteAllCapybaras();
		location.reload();
	}

	// Helper functions
	function getAddress() {
		const cookies = document.cookie.split(';').reduce((acc, cookie) => {
			const [key, value] = cookie.trim().split('=');
			acc[key] = value;
			return acc;
		}, {});

		if (cookies.apiAddress) {
			apiBaseUrl = cookies.apiAddress;
		}
		document.getElementById("apiAddress").value = apiBaseUrl;
	}

	function getRandomPosition(element) {
		const x = field.offsetWidth - element.clientWidth;
		const y = field.offsetHeight - element.clientHeight;
		const randomX = Math.floor(Math.random() * x);
		const randomY = Math.floor(Math.random() * y);
		return [randomX, randomY];
	}

	// Event handling
		// Modal
	document.getElementById('openModal').onclick = function() {
		document.getElementById('modal').style.display = 'block';
	};

	document.getElementById('closeModal').onclick = function() {
		document.getElementById('modal').style.display = 'none';
	};

	document.getElementById('saveAddress').onclick = function() {
		const address = document.getElementById('apiAddress').value;
		document.cookie = `apiAddress=${address};path=/`;
		location.reload();
	};

	document.getElementById('deleteAllCapybaras').onclick = function() {
		clearField();
	};

		// Context menu
	document.addEventListener('contextmenu', function(event) {
		if (!event.target.classList.contains('field') &&
			!event.target.classList.contains('capybara')
		) return;
		event.preventDefault();

		const contextMenu = document.getElementById('contextMenu');
		const dataBox = contextMenu.querySelector('.context-menu-data');
		const deleteBtn = contextMenu.querySelector("#deleteCapybara");
		const createBtn = contextMenu.querySelector("#createCapybara");

		contextMenu.style.top = `${event.pageY}px`;
		contextMenu.style.left = `${event.pageX}px`;
		contextMenu.style.display = 'block';
		dataBox.style.display = 'none';
		deleteBtn.style.display = 'none';
		createBtn.style.display = 'block';

		createBtn.onclick = () => {
			createCapybara();
		}

		if (event.target.classList.contains('capybara')) {
			dataBox.style.display = 'flex';
			deleteBtn.style.display = 'block';
			createBtn.style.display = 'none';
			const capybaraId = event.target.getAttribute('data-id');
			const capybaraName = event.target.getAttribute('data-name');

			const idField = contextMenu.querySelector("#capybaraId");
			idField.textContent = `ID: ${capybaraId}`;

			const nameField = contextMenu.querySelector("#capybaraName");
			nameField.textContent = `Name: ${capybaraName}`;

			deleteBtn.onclick = () => {
				REST_deleteCapybara(capybaraId);
				event.target.remove();
				contextMenu.style.display = 'none';
			};
		}
	});

	window.onclick = () => {
		document.getElementById('contextMenu').style.display = 'none';
	};

	// REST operations
	async function REST_newCapybara() {
		const GET_randomName =
			await fetch(`${apiBaseUrl}/names/random`, {method: "GET"})
				.catch(() => {return null})
		if (!GET_randomName || !GET_randomName.ok) return null;
		const randomName = await GET_randomName.json();

		const POST_newCapybara =
			await fetch(`${apiBaseUrl}/capybaras?nameId=${randomName.id}`, {method: "POST"})
				.catch(() => {return null});
		if (!POST_newCapybara || !POST_newCapybara.ok) return null;
		return await POST_newCapybara.json();
	}

	async function REST_getCapybaras() {
		const GET_allCapybaras =
			await fetch(`${apiBaseUrl}/capybaras/all`, { method: "GET" })
				.catch(() => {return null});
		if (!GET_allCapybaras || !GET_allCapybaras.ok) return null;
		return await GET_allCapybaras.json();
	}

	async function REST_deleteCapybara(id) {
		const DELETE_capybara =
			await fetch(`${apiBaseUrl}/capybaras?id=${id}`, { method: "DELETE" })
				.catch(() => {return false});
		return !(!DELETE_capybara || !DELETE_capybara.ok);
	}

	async function REST_deleteAllCapybaras() {
		const DELETE_allCapybaras =
			await fetch(`${apiBaseUrl}/capybaras/all`, { method: "DELETE" })
				.catch(() => {return false});
		return !(!DELETE_allCapybaras || !DELETE_allCapybaras.ok);
	}
});
