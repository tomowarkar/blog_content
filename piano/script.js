const keys = document.querySelectorAll('.key')

keys.forEach(key=>{
  key.addEventListener('click', ()=>playPiano(key))
})

function playPiano(key) {
  const audio = document.getElementById(key.dataset.sound)
  audio.currentTime = 0
  audio.play()
}