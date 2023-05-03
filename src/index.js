document.addEventListener('DOMContentLoaded', () => {

	// project dialog
	const modal = document.getElementById('myModal');
	const projDelButton = document.getElementById('ProjDelBtn');
	const openModalButton = document.getElementById('openModalBtn');
	const closeModalButton = document.getElementsByClassName('close-btn')[0];
	console.log(document.getElementsByClassName('close').length);
	const submitButton = document.getElementById('newProj');
	const inputText = document.getElementById('inputProj');

	projDelButton.onclick = () => {
		var e = document.getElementById("sel-project");
		var value = e.value;
		console.log(value)
		if (confirm(value + " を削除しますか？")) {
			console.log("del")
		}
	};

	openModalButton.onclick = () => {
		console.log("oepn!")
		modal.style.display = 'block';
	};

	closeModalButton.onclick = () => {
		console.log("close!")
		modal.style.display = 'none';
	};
	submitButton.onclick = () => {
		const textValue = inputText.value;
		console.log('Submitted text: ', textValue);
		// (処理はrenderで) 	
		modal.style.display = 'none';
	};

	// モーダルの外側をクリックしたときにモーダルを閉じる
	window.onclick = (event) => {
		if (event.target === modal) {
			modal.style.display = 'none';
			modalS.style.display = 'none';
		}
	};

	// settings dialog ======================================================
	const modalS = document.getElementById('settingsModal');
	const closeModalButtonS = document.getElementsByClassName('close-btnS')[0];
	const openModalButtonS = document.getElementsByClassName('open-btnS')[0];
	const saveDefPathButtons = document.getElementById('saveDefPath');
	closeModalButtonS.onclick = () => {
		modalS.style.display = 'none';
	};
	openModalButtonS.onclick = () => {
		modalS.style.display = 'block';
	};
	saveDefPathButtons.onclick = () => {
		modalS.style.display = 'none';
	};



});
