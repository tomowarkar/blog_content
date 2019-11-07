document.querySelector('#copyBtn').addEventListener("click", () => {
	let copyText = document.getElementById("copyObj");

  copyText.select();
  copyText.setSelectionRange(0, 99999); 

  document.execCommand("copy");

  alert("Copied : " + copyText.value);
});
