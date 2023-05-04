document.addEventListener('DOMContentLoaded', () => {

	// project dialog
	const modal = document.getElementById('myModal');
	const modal2 = document.getElementById('dlgPerson');
	const projDelButton = document.getElementById('ProjDelBtn');
	const openModalButton = document.getElementById('openModalBtn');
	const openDlgPerson = document.getElementById('openDlgPerson');
	const closeModalButton = document.getElementById('close-btn');
	const closeModalButton2 = document.getElementById('close-btn2');
	const submitButton = document.getElementById('newProj');
	const submitButton2 = document.getElementById('newPerson');
	const inputText = document.getElementById('inputProj');
	const personText = document.getElementById('log-target');
	const personSel = document.getElementById('sel-person');



	projDelButton.onclick = () => {
		var e = document.getElementById("sel-project");
		var value = e.value;
		console.log(value)
		//if (confirm(value + " を削除しますか？")) {
		//	console.log("del")
		//}
	};

	openModalButton.onclick = () => {
		modal.style.display = 'block';
	};

	openDlgPerson.onclick = () => {
		modal2.style.display = 'block';
	};

	personSel.onchange = (elm) => {
		console.log(elm)

		personText.value = elm.target.value;
	};



	closeModalButton.onclick = () => {
		console.log("close!")
		modal.style.display = 'none';
	};
	closeModalButton2.onclick = () => {
		console.log("close!")
		modal2.style.display = 'none';
	};


	submitButton.onclick = () => {
		const textValue = inputText.value;
		console.log('Submitted text: ', textValue);
		// (処理はrenderで) 	
		modal.style.display = 'none';
	};

	submitButton2.onclick = () => {
		const textValue = inputText.value;
		console.log('Submitted text: ', textValue);
		// (処理はrenderで) 	
		modal2.style.display = 'none';
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
